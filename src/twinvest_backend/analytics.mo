// analytics.mo - Handles dashboard metrics and analytics
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Types "types";

actor Analytics {
    
    // === STABLE STORAGE ===
    private stable var dashboardMetricsEntries : [(Principal, Types.DashboardMetrics)] = [];
    private stable var recentActivitiesEntries : [(Principal, [Types.RecentActivity])] = [];
    private stable var performanceDataEntries : [(Principal, [Types.PerformancePoint])] = [];
    
    // === STATE VARIABLES ===
    private var dashboardMetrics = HashMap.HashMap<Principal, Types.DashboardMetrics>(
        0, Principal.equal, Principal.hash
    );
    
    private var recentActivities = HashMap.HashMap<Principal, [Types.RecentActivity]>(
        0, Principal.equal, Principal.hash
    );
    
    private var performanceData = HashMap.HashMap<Principal, [Types.PerformancePoint]>(
        0, Principal.equal, Principal.hash
    );
    
    // === INTER-CANISTER CALLS ===
    // Note: In a real implementation, you'd import and call other canisters
    // For this example, we'll simulate the data
    
    // === UPGRADE HOOKS ===
    system func preupgrade() {
        dashboardMetricsEntries := dashboardMetrics.entries() |> Array.fromIter(_);
        recentActivitiesEntries := recentActivities.entries() |> Array.fromIter(_);
        performanceDataEntries := performanceData.entries() |> Array.fromIter(_);
    };
    
    system func postupgrade() {
        dashboardMetrics := HashMap.fromIter<Principal, Types.DashboardMetrics>(
            dashboardMetricsEntries.vals(), dashboardMetricsEntries.size(), 
            Principal.equal, Principal.hash
        );
        recentActivities := HashMap.fromIter<Principal, [Types.RecentActivity]>(
            recentActivitiesEntries.vals(), recentActivitiesEntries.size(), 
            Principal.equal, Principal.hash
        );
        performanceData := HashMap.fromIter<Principal, [Types.PerformancePoint]>(
            performanceDataEntries.vals(), performanceDataEntries.size(), 
            Principal.equal, Principal.hash
        );
    };
    
    // === DASHBOARD METRICS ===
    
    public shared(msg) func get_dashboard_metrics() : async Types.ApiResult<Types.DashboardMetrics> {
        switch (dashboardMetrics.get(msg.caller)) {
            case (?metrics) {
                // Check if metrics need refresh (older than 1 hour)
                let oneHour = 3600_000_000_000; // 1 hour in nanoseconds
                let now = Time.now();
                
                if (now - metrics.last_calculated > oneHour) {
                    await refresh_dashboard_metrics(msg.caller)
                } else {
                    #ok(metrics)
                };
            };
            case null {
                await refresh_dashboard_metrics(msg.caller)
            };
        };
    };
    
    private func refresh_dashboard_metrics(investor: Principal) : async Types.ApiResult<Types.DashboardMetrics> {
        // In a real implementation, this would call Portfolio and other canisters
        // For now, we'll create sample data
        
        let now = Time.now();
        let riskDistribution : Types.RiskDistribution = {
            low_risk = 15000;    // $15k in low risk
            medium_risk = 25000; // $25k in medium risk  
            high_risk = 8000;    // $8k in high risk
            very_high_risk = 2000; // $2k in very high risk
        };
        
        let recentActivity : [Types.RecentActivity] = [
            {
                activity_type = #investment_made;
                description = "Invested in Tech Corp Invoice #INV-2024-001";
                amount = ?5000;
                timestamp = now - 86400_000_000_000; // 1 day ago
                status = "completed";
            },
            {
                activity_type = #return_received;
                description = "Return payment from Manufacturing Ltd";
                amount = ?1200;
                timestamp = now - 172800_000_000_000; // 2 days ago
                status = "completed";
            },
            {
                activity_type = #kyc_updated;
                description = "KYC documents approved";
                amount = null;
                timestamp = now - 259200_000_000_000; // 3 days ago
                status = "approved";
            }
        ];
        
        let performanceChart : [Types.PerformancePoint] = [
            { date = now - 2592000_000_000_000; portfolio_value = 45000; return_percentage = 8.5; },  // 30 days ago
            { date = now - 2160000_000_000_000; portfolio_value = 47000; return_percentage = 9.1; },  // 25 days ago
            { date = now - 1728000_000_000_000; portfolio_value = 48500; return_percentage = 9.8; },  // 20 days ago
            { date = now - 1296000_000_000_000; portfolio_value = 49200; return_percentage = 10.2; }, // 15 days ago
            { date = now - 864000_000_000_000; portfolio_value = 50000; return_percentage = 10.8; },  // 10 days ago
            { date = now - 432000_000_000_000; portfolio_value = 50800; return_percentage = 11.2; },  // 5 days ago
            { date = now; portfolio_value = 51500; return_percentage = 11.5; },                      // today
        ];
        
        let metrics : Types.DashboardMetrics = {
            investor = investor;
            total_portfolio_value = 51500;
            active_investments_count = 12;
            total_returns = 6500;
            avg_monthly_return = 11.5;
            risk_distribution = riskDistribution;
            recent_activity = recentActivity;
            performance_chart_data = performanceChart;
            last_calculated = now;
        };
        
        dashboardMetrics.put(investor, metrics);
        recentActivities.put(investor, recentActivity);
        performanceData.put(investor, performanceChart);
        
        #ok(metrics)
    };
    
    public shared(msg) func force_refresh_metrics() : async Types.ApiResult<Types.DashboardMetrics> {
        await refresh_dashboard_metrics(msg.caller)
    };
    
    // === ACTIVITY TRACKING ===
    
    public shared(msg) func add_activity(
        activityType: Types.ActivityType,
        description: Text,
        amount: ?Nat,
        status: Text
    ) : async Types.ApiResult<Text> {
        let activity : Types.RecentActivity = {
            activity_type = activityType;
            description = description;
            amount = amount;
            timestamp = Time.now();
            status = status;
        };
        
        let currentActivities = switch (recentActivities.get(msg.caller)) {
            case (?activities) activities;
            case null [];
        };
        
        // Keep only the last 10 activities
        let newActivities = Array.append([activity], 
            if (currentActivities.size() >= 10) {
                Array.subArray(currentActivities, 0, 9)
            } else {
                currentActivities
            }
        );
        
        recentActivities.put(msg.caller, newActivities);
        
        #ok("Activity added successfully")
    };
    
    public query(msg) func get_recent_activities(limit: ?Nat) : async Types.ApiResult<[Types.RecentActivity]> {
        switch (recentActivities.get(msg.caller)) {
            case (?activities) {
                let maxLimit = switch (limit) {
                    case (?l) Int.min(l, activities.size());
                    case null activities.size();
                };
                #ok(Array.subArray(activities, 0, maxLimit))
            };
            case null #ok([]);
        };
    };
    
    // === PERFORMANCE ANALYTICS ===
    
    public query(msg) func get_performance_data(
        days: ?Nat
    ) : async Types.ApiResult<[Types.PerformancePoint]> {
        switch (performanceData.get(msg.caller)) {
            case (?data) {
                let daysLimit = switch (days) {
                    case (?d) d;
                    case null 30; // Default to 30 days
                };
                
                let now = Time.now();
                let cutoffTime = now - (Int.abs(daysLimit) * 86400_000_000_000); // days in nanoseconds
                
                let filteredData = Array.filter<Types.PerformancePoint>(data, func(point) {
                    point.date >= cutoffTime
                });
                
                #ok(filteredData)
            };
            case null #ok([]);
        };
    };
    
    public shared(msg) func record_performance_point(
        portfolioValue: Nat,
        returnPercentage: Float
    ) : async Types.ApiResult<Text> {
        let point : Types.PerformancePoint = {
            date = Time.now();
            portfolio_value = portfolioValue;
            return_percentage = returnPercentage;
        };
        
        let currentData = switch (performanceData.get(msg.caller)) {
            case (?data) data;
            case null [];
        };
        
        // Keep only the last 90 days of data
        let maxPoints = 90;
        let newData = Array.append([point], 
            if (currentData.size() >= maxPoints) {
                Array.subArray(currentData, 0, maxPoints - 1)
            } else {
                currentData
            }
        );
        
        performanceData.put(msg.caller, newData);
        
        #ok("Performance point recorded")
    };
    
    // === COMPARATIVE ANALYTICS ===
    
    public query(msg) func get_portfolio_comparison() : async Types.ApiResult<{
        my_performance: Float;
        platform_average: Float;
        percentile_rank: Float;
        top_performer_return: Float;
    }> {
        // In a real implementation, this would aggregate data from all users
        // For demo purposes, we'll return simulated data
        
        switch (dashboardMetrics.get(msg.caller)) {
            case (?metrics) {
                #ok({
                    my_performance = metrics.avg_monthly_return;
                    platform_average = 9.2;
                    percentile_rank = 78.5;
                    top_performer_return = 15.8;
                })
            };
            case null {
                #ok({
                    my_performance = 0.0;
                    platform_average = 9.2;
                    percentile_rank = 0.0;
                    top_performer_return = 15.8;
                })
            };
        };
    };
    
    public query func get_market_insights() : async {
        trending_sectors: [Text];
        risk_appetite_trend: Text;
        average_investment_size: Nat;
        success_rate: Float;
    } {
        {
            trending_sectors = ["Technology", "Healthcare", "Manufacturing", "Logistics"];
            risk_appetite_trend = "increasing"; // or "decreasing", "stable"
            average_investment_size = 7500;
            success_rate = 94.2;
        }
    };
    
    // === REPORTING ===
    
    public query(msg) func generate_monthly_report(
        month: Nat,
        year: Nat
    ) : async Types.ApiResult<{
        total_invested: Nat;
        total_returns: Nat;
        net_profit: Int;
        investment_count: Nat;
        avg_roi: Float;
        best_investment: ?Text;
        risk_breakdown: Types.RiskDistribution;
    }> {
        // In a real implementation, this would query historical data
        // For demo purposes, return simulated monthly report
        
        let report = {
            total_invested = 12000;
            total_returns = 13500;
            net_profit = 1500;
            investment_count = 8;
            avg_roi = 12.5;
            best_investment = ?"Tech Corp Invoice #INV-2024-001";
            risk_breakdown = {
                low_risk = 4000;
                medium_risk = 6000;
                high_risk = 2000;
                very_high_risk = 0;
            };
        };
        
        #ok(report)
    };
    
    public query(msg) func get_tax_summary(year: Nat) : async Types.ApiResult<{
        total_investment_income: Nat;
        total_fees_paid: Nat;
        net_taxable_income: Int;
        transaction_count: Nat;
    }> {
        // In a real implementation, this would aggregate transaction data
        let summary = {
            total_investment_income = 6500;
            total_fees_paid = 150;
            net_taxable_income = 6350;
            transaction_count = 24;
        };
        
        #ok(summary)
    };
    
    // === REAL-TIME UPDATES ===
    
    public shared(msg) func subscribe_to_updates() : async Types.ApiResult<Text> {
        // In a real implementation, this would set up WebSocket or similar
        // For now, just acknowledge the subscription
        #ok("Subscribed to real-time dashboard updates")
    };
    
    public shared(msg) func unsubscribe_from_updates() : async Types.ApiResult<Text> {
        #ok("Unsubscribed from real-time dashboard updates")
    };
    
    // === UTILITY FUNCTIONS ===
    
    public query func get_platform_health() : async {
        total_users: Nat;
        active_investments: Nat;
        platform_volume_24h: Nat;
        system_uptime: Float;
    } {
        {
            total_users = 1247;
            active_investments = 356;
            platform_volume_24h = 125000;
            system_uptime = 99.97;
        }
    };
    
    public query func health_check() : async {status: Text; timestamp: Int} {
        {
            status = "healthy";
            timestamp = Time.now();
        }
    };
}