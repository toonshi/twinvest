// types.mo - Core type definitions for Twinvest platform
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

module {
    // === IDENTITY & ROLES ===
    public type Role = {
        #investor;
        #freelancer;
        #client;
        #admin;
    };

    public type UserProfile = {
        principal: Principal;
        role: Role;
        email: ?Text;
        created_at: Time.Time;
        kyc_status: KYCStatus;
        profile_data: ?ProfileData;
    };

    public type ProfileData = {
        name: ?Text;
        company: ?Text;
        wallet_address: ?Text;
        phone: ?Text;
        country: ?Text;
    };

    // === KYC & COMPLIANCE ===
    public type KYCStatus = {
        #pending;
        #in_review;
        #approved;
        #rejected: Text; // rejection reason
        #expired;
    };

    public type KYCDocument = {
        id: Text;
        document_type: DocumentType;
        file_hash: Text;
        uploaded_at: Time.Time;
        status: KYCStatus;
        verified_by: ?Principal;
    };

    public type DocumentType = {
        #passport;
        #drivers_license;
        #utility_bill;
        #bank_statement;
        #company_registration;
        #tax_certificate;
    };

    // === INVESTMENT & PORTFOLIO ===
    public type Investment = {
        id: Text;
        investor: Principal;
        invoice_id: Text;
        amount_invested: Nat;
        investment_date: Time.Time;
        expected_return: Nat;
        maturity_date: Time.Time;
        status: InvestmentStatus;
        risk_rating: RiskRating;
    };

    public type InvestmentStatus = {
        #active;
        #matured;
        #defaulted;
        #cancelled;
        #pending_payment;
    };

    public type RiskRating = {
        #low;
        #medium;
        #high;
        #very_high;
    };

    public type Portfolio = {
        investor: Principal;
        total_invested: Nat;
        active_investments: Nat;
        total_returns: Nat;
        avg_return_rate: Float;
        investments: [Investment];
        last_updated: Time.Time;
    };

    // === INVOICE MARKETPLACE ===
    public type Invoice = {
        id: Text;
        freelancer: Principal;  // Changed from borrower to freelancer
        invoice_number: Text;
        amount: Nat;
        due_date: Time.Time;
        created_at: Time.Time;
        description: Text;
        client_info: ClientInfo;  // Changed from debtor_info to client_info
        financing_request: FinancingRequest;
        status: InvoiceStatus;
        risk_assessment: ?RiskAssessment;
    };

    public type ClientInfo = {  // Changed from DebtorInfo
        name: Text;
        company: ?Text;
        credit_rating: ?Text;
        payment_history_score: ?Float;
    };

    public type FinancingRequest = {
        requested_amount: Nat;
        discount_rate: Float;
        min_investment: Nat;
        max_investment: ?Nat;
        funding_deadline: Time.Time;
        current_funding: Nat;
        investors_count: Nat;
    };

    public type InvoiceStatus = {
        #draft;
        #pending_approval;
        #available_for_funding;
        #partially_funded;
        #fully_funded;
        #paid;
        #overdue;
        #defaulted;
    };

    public type RiskAssessment = {
        overall_score: Float;
        payment_probability: Float;
        debtor_risk_factors: [Text];
        market_conditions: Text;
        assessed_by: Text;
        assessed_at: Time.Time;
    };

    // === TRANSACTIONS ===
    public type Transaction = {
        id: Text;
        user: Principal;
        transaction_type: TransactionType;
        amount: Nat;
        currency: Currency;
        timestamp: Time.Time;
        status: TransactionStatus;
        reference: ?Text;
        gas_fee: ?Nat;
    };

    public type TransactionType = {
        #investment;
        #withdrawal;
        #return_payment;
        #fee_payment;
        #refund;
    };

    public type Currency = {
        #ICP;
        #USD;
        #EUR;
    };

    public type TransactionStatus = {
        #pending;
        #completed;
        #failed: Text;
        #cancelled;
    };

    // === ANALYTICS & DASHBOARD ===
    public type DashboardMetrics = {
        investor: Principal;
        total_portfolio_value: Nat;
        active_investments_count: Nat;
        total_returns: Nat;
        avg_monthly_return: Float;
        risk_distribution: RiskDistribution;
        recent_activity: [RecentActivity];
        performance_chart_data: [PerformancePoint];
        last_calculated: Time.Time;
    };

    public type RiskDistribution = {
        low_risk: Nat;
        medium_risk: Nat;
        high_risk: Nat;
        very_high_risk: Nat;
    };

    public type RecentActivity = {
        activity_type: ActivityType;
        description: Text;
        amount: ?Nat;
        timestamp: Time.Time;
        status: Text;
    };

    public type ActivityType = {
        #investment_made;
        #return_received;
        #kyc_updated;
        #withdrawal_requested;
        #document_uploaded;
    };

    public type PerformancePoint = {
        date: Time.Time;
        portfolio_value: Nat;
        return_percentage: Float;
    };

    // === NOTIFICATIONS ===
    public type Notification = {
        id: Text;
        recipient: Principal;
        title: Text;
        message: Text;
        notification_type: NotificationType;
        created_at: Time.Time;
        read_at: ?Time.Time;
        action_url: ?Text;
        priority: Priority;
    };

    public type NotificationType = {
        #investment_opportunity;
        #payment_received;
        #kyc_update;
        #system_alert;
        #portfolio_update;
        #invoice_status_change;
    };

    public type Priority = {
        #low;
        #medium;
        #high;
        #urgent;
    };

    // === API RESPONSES ===
    public type ApiResult<T> = Result.Result<T, ApiError>;

    public type ApiError = {
        #not_found: Text;
        #unauthorized;
        #invalid_input: Text;
        #internal_error: Text;
        #insufficient_funds;
        #kyc_required;
        #role_required: Role;
    };

    // === PAGINATION ===
    public type PaginationParams = {
        page: Nat;
        limit: Nat;
    };

    public type PaginatedResponse<T> = {
        data: [T];
        total_count: Nat;
        page: Nat;
        limit: Nat;
        has_next: Bool;
    };

    // === UTILITY FUNCTIONS ===
    public func generateId(prefix: Text, timestamp: Time.Time) : Text {
        prefix # "-" # Int.toText(timestamp) # "-" # Int.toText(timestamp % 1000);
    };

    public func roleToText(role: Role) : Text {
        switch (role) {
            case (#investor) "investor";
            case (#freelancer) "freelancer";
            case (#client) "client";
            case (#admin) "admin";
        };
    };

    public func textToRole(text: Text) : ?Role {
        switch (text) {
            case ("investor") ?#investor;
            case ("freelancer") ?#freelancer;
            case ("client") ?#client;
            case ("admin") ?#admin;
            case (_) null;
        };
    };
}