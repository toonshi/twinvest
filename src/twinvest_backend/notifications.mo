// notifications.mo - Handles user notifications and alerts
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Types "types";

actor Notifications {
    
    // === STABLE STORAGE ===
    private stable var notificationsEntries : [(Text, Types.Notification)] = [];
    private stable var userNotificationMappingEntries : [(Principal, [Text])] = [];
    private stable var notificationPreferencesEntries : [(Principal, NotificationPreferences)] = [];
    
    // === ADDITIONAL TYPES ===
    public type NotificationPreferences = {
        email_enabled: Bool;
        push_enabled: Bool;
        sms_enabled: Bool;
        investment_alerts: Bool;
        payment_alerts: Bool;
        kyc_alerts: Bool;
        system_alerts: Bool;
        marketing_emails: Bool;
    };
    
    // === STATE VARIABLES ===
    private var notifications = HashMap.HashMap<Text, Types.Notification>(
        0, Text.equal, Text.hash
    );
    
    private var userNotificationMapping = HashMap.HashMap<Principal, [Text]>(
        0, Principal.equal, Principal.hash
    );
    
    private var notificationPreferences = HashMap.HashMap<Principal, NotificationPreferences>(
        0, Principal.equal, Principal.hash
    );
    
    // === UPGRADE HOOKS ===
    system func preupgrade() {
        notificationsEntries := notifications.entries() |> Array.fromIter(_);
        userNotificationMappingEntries := userNotificationMapping.entries() |> Array.fromIter(_);
        notificationPreferencesEntries := notificationPreferences.entries() |> Array.fromIter(_);
    };
    
    system func postupgrade() {
        notifications := HashMap.fromIter<Text, Types.Notification>(
            notificationsEntries.vals(), notificationsEntries.size(), 
            Text.equal, Text.hash
        );
        userNotificationMapping := HashMap.fromIter<Principal, [Text]>(
            userNotificationMappingEntries.vals(), userNotificationMappingEntries.size(), 
            Principal.equal, Principal.hash
        );
        notificationPreferences := HashMap.fromIter<Principal, NotificationPreferences>(
            notificationPreferencesEntries.vals(), notificationPreferencesEntries.size(), 
            Principal.equal, Principal.hash
        );
    };
    
    // === NOTIFICATION MANAGEMENT ===
    
    public func create_notification(
        recipient: Principal,
        title: Text,
        message: Text,
        notificationType: Types.NotificationType,
        priority: Types.Priority,
        actionUrl: ?Text
    ) : async Types.ApiResult<Types.Notification> {
        // Check user preferences before creating notification
        let preferences = get_user_preferences(recipient);
        
        let shouldCreate = switch (notificationType) {
            case (#investment_opportunity or #portfolio_update) preferences.investment_alerts;
            case (#payment_received) preferences.payment_alerts;
            case (#kyc_update) preferences.kyc_alerts;
            case (#system_alert) preferences.system_alerts;
            case (#invoice_status_change) true; // Always create for critical updates
        };
        
        if (not shouldCreate) {
            return #err(#invalid_input("User has disabled this type of notification"));
        };
        
        let now = Time.now();
        let notificationId = Types.generateId("notif", now);
        
        let notification : Types.Notification = {
            id = notificationId;
            recipient = recipient;
            title = title;
            message = message;
            notification_type = notificationType;
            created_at = now;
            read_at = null;
            action_url = actionUrl;
            priority = priority;
        };
        
        notifications.put(notificationId, notification);
        
        // Update user's notification list
        let userNotifications = switch (userNotificationMapping.get(recipient)) {
            case (?notifs) Array.append([notificationId], notifs);
            case null [notificationId];
        };
        
        // Keep only the last 100 notifications per user
        let limitedNotifications = if (userNotifications.size() > 100) {
            Array.subArray(userNotifications, 0, 100)
        } else {
            userNotifications
        };
        
        userNotificationMapping.put(recipient, limitedNotifications);
        
        #ok(notification)
    };
    
    public query(msg) func get_my_notifications(
        unreadOnly: ?Bool,
        pagination: ?Types.PaginationParams
    ) : async Types.ApiResult<Types.PaginatedResponse<Types.Notification>> {
        switch (userNotificationMapping.get(msg.caller)) {
            case (?notificationIds) {
                let userNotifications = Buffer.Buffer<Types.Notification>(0);
                
                for (notifId in notificationIds.vals()) {
                    switch (notifications.get(notifId)) {
                        case (?notification) {
                            let includeNotification = switch (unreadOnly) {
                                case (?true) notification.read_at == null;
                                case _ true;
                            };
                            
                            if (includeNotification) {
                                userNotifications.add(notification);
                            };
                        };
                        case null {};
                    };
                };
                
                let totalCount = userNotifications.size();
                let (page, limit) = switch (pagination) {
                    case (?params) (params.page, params.limit);
                    case null (0, 20);
                };
                
                let startIndex = page * limit;
                let endIndex = Int.min(startIndex + limit, totalCount);
                
                let paginatedData = Buffer.Buffer<Types.Notification>(0);
                var i = startIndex;
                while (i < endIndex) {
                    paginatedData.add(userNotifications.get(i));
                    i += 1;
                };
                
                #ok({
                    data = Buffer.toArray(paginatedData);
                    total_count = totalCount;
                    page = page;
                    limit = limit;
                    has_next = endIndex < totalCount;
                })
            };
            case null {
                #ok({
                    data = [];
                    total_count = 0;
                    page = 0;
                    limit = 20;
                    has_next = false;
                })
            };
        };
    };
    
    public shared(msg) func mark_notification_as_read(notificationId: Text) : async Types.ApiResult<Text> {
        switch (notifications.get(notificationId)) {
            case (?notification) {
                if (notification.recipient != msg.caller) {
                    return #err(#unauthorized);
                };
                
                let updatedNotification = {
                    notification with
                    read_at = ?Time.now();
                };
                
                notifications.put(notificationId, updatedNotification);
                #ok("Notification marked as read")
            };
            case null #err(#not_found("Notification not found"));
        };
    };
    
    public shared(msg) func mark_all_as_read() : async Types.ApiResult<Text> {
        switch (userNotificationMapping.get(msg.caller)) {
            case (?notificationIds) {
                let now = Time.now();
                var updatedCount = 0;
                
                for (notifId in notificationIds.vals()) {
                    switch (notifications.get(notifId)) {
                        case (?notification) {
                            if (notification.read_at == null) {
                                let updatedNotification = {
                                    notification with
                                    read_at = ?now;
                                };
                                notifications.put(notifId, updatedNotification);
                                updatedCount += 1;
                            };
                        };
                        case null {};
                    };
                };
                
                #ok("Marked " # Int.toText(updatedCount) # " notifications as read")
            };
            case null #ok("No notifications to mark as read");
        };
    };
    
    public shared(msg) func delete_notification(notificationId: Text) : async Types.ApiResult<Text> {
        switch (notifications.get(notificationId)) {
            case (?notification) {
                if (notification.recipient != msg.caller) {
                    return #err(#unauthorized);
                };
                
                notifications.delete(notificationId);
                
                // Remove from user's notification list
                switch (userNotificationMapping.get(msg.caller)) {
                    case (?notificationIds) {
                        let filteredIds = Array.filter<Text>(notificationIds, func(id) {
                            id != notificationId
                        });
                        userNotificationMapping.put(msg.caller, filteredIds);
                    };
                    case null {};
                };
                
                #ok("Notification deleted")
            };
            case null #err(#not_found("Notification not found"));
        };
    };
    
    // === NOTIFICATION PREFERENCES ===
    
    public shared(msg) func update_notification_preferences(
        preferences: NotificationPreferences
    ) : async Types.ApiResult<NotificationPreferences> {
        notificationPreferences.put(msg.caller, preferences);
        #ok(preferences)
    };
    
    public query(msg) func get_notification_preferences() : async Types.ApiResult<NotificationPreferences> {
        switch (notificationPreferences.get(msg.caller)) {
            case (?preferences) #ok(preferences);
            case null {
                // Return default preferences
                let defaultPreferences = get_default_preferences();
                #ok(defaultPreferences)
            };
        };
    };
    
    private func get_user_preferences(user: Principal) : NotificationPreferences {
        switch (notificationPreferences.get(user)) {
            case (?preferences) preferences;
            case null get_default_preferences();
        };
    };
    
    private func get_default_preferences() : NotificationPreferences {
        {
            email_enabled = true;
            push_enabled = true;
            sms_enabled = false;
            investment_alerts = true;
            payment_alerts = true;
            kyc_alerts = true;
            system_alerts = true;
            marketing_emails = false;
        }
    };
    
    // === BULK NOTIFICATIONS ===
    
    public func broadcast_system_notification(
        title: Text,
        message: Text,
        priority: Types.Priority,
        targetRole: ?Types.Role
    ) : async Types.ApiResult<Text> {
        // Note: In a real implementation, this would call UserManagement canister
        // to get all users or users with specific role
        
        var notificationCount = 0;
        
        // For demo purposes, we'll create a few sample notifications
        let sampleRecipients = [
            Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
            Principal.fromText("rdmx6-jaaaa-aaaaa-aaadq-cai")
        ];
        
        for (recipient in sampleRecipients.vals()) {
            let result = await create_notification(
                recipient,
                title,
                message,
                #system_alert,
                priority,
                null
            );
            
            switch (result) {
                case (#ok(_)) notificationCount += 1;
                case (#err(_)) {};
            };
        };
        
        #ok("Broadcast sent to " # Int.toText(notificationCount) # " users")
    };
    
    // === INVESTMENT-SPECIFIC NOTIFICATIONS ===
    
    public func notify_investment_opportunity(
        investorPrincipal: Principal,
        invoiceId: Text,
        amount: Nat,
        returnRate: Float,
        riskLevel: Text
    ) : async Types.ApiResult<Text> {
        let title = "New Investment Opportunity";
        let message = "A new invoice matching your criteria is available for investment. Amount: $" # 
                     Int.toText(amount) # ", Expected return: " # Float.toText(returnRate) # "%";
        
        let result = await create_notification(
            investorPrincipal,
            title,
            message,
            #investment_opportunity,
            #medium,
            ?("/dashboard/investor/opportunities/" # invoiceId)
        );
        
        switch (result) {
            case (#ok(_)) #ok("Investment opportunity notification sent");
            case (#err(error)) #err(error);
        };
    };
    
    public func notify_payment_received(
        investorPrincipal: Principal,
        amount: Nat,
        investmentId: Text
    ) : async Types.ApiResult<Text> {
        let title = "Payment Received";
        let message = "You've received a return payment of $" # Int.toText(amount) # 
                     " from your investment.";
        
        let result = await create_notification(
            investorPrincipal,
            title,
            message,
            #payment_received,
            #high,
            ?("/dashboard/investor/investments/" # investmentId)
        );
        
        switch (result) {
            case (#ok(_)) #ok("Payment notification sent");
            case (#err(error)) #err(error);
        };
    };
    
    public func notify_kyc_status_change(
        userPrincipal: Principal,
        newStatus: Types.KYCStatus
    ) : async Types.ApiResult<Text> {
        let (title, message, priority) = switch (newStatus) {
            case (#approved) ("KYC Approved", "Your KYC verification has been approved. You can now start investing.", #high);
            case (#rejected(reason)) ("KYC Rejected", "Your KYC verification was rejected: " # reason, #high);
            case (#in_review) ("KYC Under Review", "Your KYC documents are being reviewed.", #medium);
            case (#expired) ("KYC Expired", "Your KYC verification has expired. Please update your documents.", #high);
            case (#pending) ("KYC Pending", "Please complete your KYC verification to start investing.", #medium);
        };
        
        let result = await create_notification(
            userPrincipal,
            title,
            message,
            #kyc_update,
            priority,
            ?("/dashboard/profile/kyc")
        );
        
        switch (result) {
            case (#ok(_)) #ok("KYC status notification sent");
            case (#err(error)) #err(error);
        };
    };
    
    // === ANALYTICS ===
    
    public query(msg) func get_unread_count() : async Nat {
        switch (userNotificationMapping.get(msg.caller)) {
            case (?notificationIds) {
                var unreadCount = 0;
                
                for (notifId in notificationIds.vals()) {
                    switch (notifications.get(notifId)) {
                        case (?notification) {
                            if (notification.read_at == null) {
                                unreadCount += 1;
                            };
                        };
                        case null {};
                    };
                };
                
                unreadCount
            };
            case null 0;
        };
    };
    
    public query(msg) func get_notification_stats() : async {
        total_notifications: Nat;
        unread_count: Nat;
        high_priority_unread: Nat;
        last_notification_time: ?Time.Time;
    } {
        switch (userNotificationMapping.get(msg.caller)) {
            case (?notificationIds) {
                var unreadCount = 0;
                var highPriorityUnread = 0;
                var lastNotificationTime : ?Time.Time = null;
                
                for (notifId in notificationIds.vals()) {
                    switch (notifications.get(notifId)) {
                        case (?notification) {
                            // Update last notification time
                            switch (lastNotificationTime) {
                                case (?lastTime) {
                                    if (notification.created_at > lastTime) {
                                        lastNotificationTime := ?notification.created_at;
                                    };
                                };
                                case null {
                                    lastNotificationTime := ?notification.created_at;
                                };
                            };
                            
                            // Count unread notifications
                            if (notification.read_at == null) {
                                unreadCount += 1;
                                
                                // Count high priority unread
                                if (notification.priority == #high or notification.priority == #urgent) {
                                    highPriorityUnread += 1;
                                };
                            };
                        };
                        case null {};
                    };
                };
                
                {
                    total_notifications = notificationIds.size();
                    unread_count = unreadCount;
                    high_priority_unread = highPriorityUnread;
                    last_notification_time = lastNotificationTime;
                }
            };
            case null {
                {
                    total_notifications = 0;
                    unread_count = 0;
                    high_priority_unread = 0;
                    last_notification_time = null;
                }
            };
        };
    };
    
    // === NOTIFICATION TEMPLATES ===
    
    public func notify_invoice_status_change(
        freelancerPrincipal: Principal,
        invoiceId: Text,
        oldStatus: Types.InvoiceStatus,
        newStatus: Types.InvoiceStatus
    ) : async Types.ApiResult<Text> {
        let (title, message, priority) = switch (newStatus) {
            case (#available_for_funding) ("Invoice Approved", "Your invoice has been approved and is now available for funding.", #high);
            case (#fully_funded) ("Invoice Fully Funded", "Congratulations! Your invoice has been fully funded by investors.", #high);
            case (#paid) ("Invoice Paid", "Your invoice has been marked as paid. Funds will be distributed to investors.", #high);
            case (#overdue) ("Invoice Overdue", "Your invoice is now overdue. Please contact the client for payment.", #urgent);
            case (#defaulted) ("Invoice Defaulted", "Your invoice has been marked as defaulted.", #urgent);
            case _ ("Invoice Status Updated", "Your invoice status has been updated.", #medium);
        };
        
        let result = await create_notification(
            freelancerPrincipal,
            title,
            message,
            #invoice_status_change,
            priority,
            ?("/dashboard/freelancer/invoices/" # invoiceId)
        );
        
        switch (result) {
            case (#ok(_)) #ok("Invoice status notification sent");
            case (#err(error)) #err(error);
        };
    };
    
    public func notify_portfolio_milestone(
        investorPrincipal: Principal,
        milestoneType: Text,
        amount: Nat
    ) : async Types.ApiResult<Text> {
        let title = "Portfolio Milestone Reached!";
        let message = switch (milestoneType) {
            case ("first_investment") "Congratulations on your first investment on Twinvest!";
            case ("portfolio_10k") "Your portfolio has reached $10,000!";
            case ("portfolio_50k") "Amazing! Your portfolio has reached $50,000!";
            case ("portfolio_100k") "Incredible! You've reached $100,000 in your portfolio!";
            case ("roi_target") "You've achieved your target ROI this month!";
            case _ "You've reached a new portfolio milestone!";
        };
        
        let result = await create_notification(
            investorPrincipal,
            title,
            message,
            #portfolio_update,
            #medium,
            ?("/dashboard/investor/portfolio")
        );
        
        switch (result) {
            case (#ok(_)) #ok("Portfolio milestone notification sent");
            case (#err(error)) #err(error);
        };
    };
    
    // === CLEANUP FUNCTIONS ===
    
    public func cleanup_old_notifications(daysOld: Nat) : async Text {
        let cutoffTime = Time.now() - (Int.abs(daysOld) * 86400_000_000_000); // days in nanoseconds
        var deletedCount = 0;
        
        // Create a list of notification IDs to delete
        let toDelete = Buffer.Buffer<Text>(0);
        
        for ((notifId, notification) in notifications.entries()) {
            if (notification.created_at < cutoffTime and notification.read_at != null) {
                toDelete.add(notifId);
            };
        };
        
        // Delete old notifications
        for (notifId in toDelete.vals()) {
            notifications.delete(notifId);
            deletedCount += 1;
            
            // Also remove from user mappings
            for ((user, notifIds) in userNotificationMapping.entries()) {
                let filteredIds = Array.filter<Text>(notifIds, func(id) {
                    id != notifId
                });
                userNotificationMapping.put(user, filteredIds);
            };
        };
        
        "Deleted " # Int.toText(deletedCount) # " old notifications"
    };
    
    // === UTILITY FUNCTIONS ===
    
    public query func get_notification_types() : async [Text] {
        ["investment_opportunity", "payment_received", "kyc_update", "system_alert", "portfolio_update", "invoice_status_change"]
    };
    
    public query func health_check() : async {status: Text; timestamp: Int; notification_count: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            notification_count = notifications.size();
        }
    };
}