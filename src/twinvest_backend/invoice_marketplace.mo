// invoice_marketplace.mo - Handles invoice listings and marketplace logic
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

actor InvoiceMarketplace {
    
    // === STABLE STORAGE ===
    private stable var invoicesEntries : [(Text, Types.Invoice)] = [];
    private stable var riskAssessmentsEntries : [(Text, Types.RiskAssessment)] = [];
    
    // === STATE VARIABLES ===
    private var invoices = HashMap.HashMap<Text, Types.Invoice>(
        0, Text.equal, Text.hash
    );
    
    private var riskAssessments = HashMap.HashMap<Text, Types.RiskAssessment>(
        0, Text.equal, Text.hash
    );
    
    // === UPGRADE HOOKS ===
    system func preupgrade() {
        invoicesEntries := invoices.entries() |> Array.fromIter(_);
        riskAssessmentsEntries := riskAssessments.entries() |> Array.fromIter(_);
    };
    
    system func postupgrade() {
        invoices := HashMap.fromIter<Text, Types.Invoice>(
            invoicesEntries.vals(), invoicesEntries.size(), 
            Text.equal, Text.hash
        );
        riskAssessments := HashMap.fromIter<Text, Types.RiskAssessment>(
            riskAssessmentsEntries.vals(), riskAssessmentsEntries.size(), 
            Text.equal, Text.hash
        );
    };
    
    // === INVOICE MANAGEMENT ===
    
    public shared(msg) func create_invoice(
        invoiceNumber: Text,
        amount: Nat,
        dueDate: Time.Time,
        description: Text,
        debtorInfo: Types.DebtorInfo,
        financingRequest: Types.FinancingRequest
    ) : async Types.ApiResult<Types.Invoice> {
        let now = Time.now();
        let invoiceId = Types.generateId("inv", now);
        
        let invoice : Types.Invoice = {
            id = invoiceId;
            borrower = msg.caller;
            invoice_number = invoiceNumber;
            amount = amount;
            due_date = dueDate;
            created_at = now;
            description = description;
            debtor_info = debtorInfo;
            financing_request = {
                financingRequest with
                current_funding = 0;
                investors_count = 0;
            };
            status = #draft;
            risk_assessment = null;
        };
        
        invoices.put(invoiceId, invoice);
        #ok(invoice)
    };
    
    public shared(msg) func submit_for_approval(invoiceId: Text) : async Types.ApiResult<Text> {
        switch (invoices.get(invoiceId)) {
            case (?invoice) {
                if (invoice.borrower != msg.caller) {
                    return #err(#unauthorized);
                };
                
                if (invoice.status != #draft) {
                    return #err(#invalid_input("Invoice is not in draft status"));
                };
                
                let updatedInvoice = {
                    invoice with
                    status = #pending_approval;
                };
                
                invoices.put(invoiceId, updatedInvoice);
                #ok("Invoice submitted for approval")
            };
            case null #err(#not_found("Invoice not found"));
        };
    };
    
    public query func get_available_invoices(
        pagination: ?Types.PaginationParams
    ) : async Types.ApiResult<Types.PaginatedResponse<Types.Invoice>> {
        let availableInvoices = Buffer.Buffer<Types.Invoice>(0);
        
        for (invoice in invoices.vals()) {
            switch (invoice.status) {
                case (#available_for_funding or #partially_funded) {
                    availableInvoices.add(invoice);
                };
                case _ {};
            };
        };
        
        let totalCount = availableInvoices.size();
        let (page, limit) = switch (pagination) {
            case (?params) (params.page, params.limit);
            case null (0, 20);
        };
        
        let startIndex = page * limit;
        let endIndex = Int.min(startIndex + limit, totalCount);
        
        let paginatedData = Buffer.Buffer<Types.Invoice>(0);
        var i = startIndex;
        while (i < endIndex) {
            paginatedData.add(availableInvoices.get(i));
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
    
    public query func get_invoice(invoiceId: Text) : async Types.ApiResult<Types.Invoice> {
        switch (invoices.get(invoiceId)) {
            case (?invoice) #ok(invoice);
            case null #err(#not_found("Invoice not found"));
        };
    };
    
    public query(msg) func get_my_invoices() : async Types.ApiResult<[Types.Invoice]> {
        let myInvoices = Buffer.Buffer<Types.Invoice>(0);
        
        for (invoice in invoices.vals()) {
            if (invoice.borrower == msg.caller) {
                myInvoices.add(invoice);
            };
        };
        
        #ok(Buffer.toArray(myInvoices))
    };
    
    // === INVESTMENT PROCESSING ===
    
    public shared(msg) func invest_in_invoice(
        invoiceId: Text,
        amount: Nat
    ) : async Types.ApiResult<Text> {
        switch (invoices.get(invoiceId)) {
            case (?invoice) {
                // Validate investment
                if (invoice.status != #available_for_funding and invoice.status != #partially_funded) {
                    return #err(#invalid_input("Invoice is not available for funding"));
                };
                
                if (amount < invoice.financing_request.min_investment) {
                    return #err(#invalid_input("Investment amount below minimum"));
                };
                
                switch (invoice.financing_request.max_investment) {
                    case (?maxAmount) {
                        if (amount > maxAmount) {
                            return #err(#invalid_input("Investment amount exceeds maximum"));
                        };
                    };
                    case null {};
                };
                
                let newFunding = invoice.financing_request.current_funding + amount;
                if (newFunding > invoice.financing_request.requested_amount) {
                    return #err(#invalid_input("Investment would exceed funding target"));
                };
                
                // Update invoice funding
                let updatedFinancingRequest = {
                    invoice.financing_request with
                    current_funding = newFunding;
                    investors_count = invoice.financing_request.investors_count + 1;
                };
                
                let newStatus = if (newFunding >= invoice.financing_request.requested_amount) {
                    #fully_funded
                } else {
                    #partially_funded
                };
                
                let updatedInvoice = {
                    invoice with
                    financing_request = updatedFinancingRequest;
                    status = newStatus;
                };
                
                invoices.put(invoiceId, updatedInvoice);
                #ok("Investment processed successfully")
            };
            case null #err(#not_found("Invoice not found"));
        };
    };
    
    // === RISK ASSESSMENT ===
    
    public shared(msg) func create_risk_assessment(
        invoiceId: Text,
        overallScore: Float,
        paymentProbability: Float,
        riskFactors: [Text],
        marketConditions: Text
    ) : async Types.ApiResult<Types.RiskAssessment> {
        // TODO: Add role-based access control for risk assessors
        
        let now = Time.now();
        let assessment : Types.RiskAssessment = {
            overall_score = overallScore;
            payment_probability = paymentProbability;
            debtor_risk_factors = riskFactors;
            market_conditions = marketConditions;
            assessed_by = Principal.toText(msg.caller);
            assessed_at = now;
        };
        
        riskAssessments.put(invoiceId, assessment);
        
        // Update invoice with risk assessment
        switch (invoices.get(invoiceId)) {
            case (?invoice) {
                let updatedInvoice = {
                    invoice with
                    risk_assessment = ?assessment;
                };
                invoices.put(invoiceId, updatedInvoice);
            };
            case null {};
        };
        
        #ok(assessment)
    };
    
    public query func get_risk_assessment(invoiceId: Text) : async Types.ApiResult<Types.RiskAssessment> {
        switch (riskAssessments.get(invoiceId)) {
            case (?assessment) #ok(assessment);
            case null #err(#not_found("Risk assessment not found"));
        };
    };
    
    // === FILTERING & SEARCH ===
    
    public query func filter_invoices_by_risk(
        riskLevel: Types.RiskRating,
        pagination: ?Types.PaginationParams
    ) : async Types.ApiResult<Types.PaginatedResponse<Types.Invoice>> {
        let filteredInvoices = Buffer.Buffer<Types.Invoice>(0);
        
        for (invoice in invoices.vals()) {
            if (invoice.status == #available_for_funding or invoice.status == #partially_funded) {
                switch (invoice.risk_assessment) {
                    case (?assessment) {
                        let invoiceRisk = if (assessment.overall_score >= 80.0) #low
                                         else if (assessment.overall_score >= 60.0) #medium
                                         else if (assessment.overall_score >= 40.0) #high
                                         else #very_high;
                        
                        if (invoiceRisk == riskLevel) {
                            filteredInvoices.add(invoice);
                        };
                    };
                    case null {
                        // If no risk assessment, consider it high risk
                        if (riskLevel == #high) {
                            filteredInvoices.add(invoice);
                        };
                    };
                };
            };
        };
        
        let totalCount = filteredInvoices.size();
        let (page, limit) = switch (pagination) {
            case (?params) (params.page, params.limit);
            case null (0, 20);
        };
        
        let startIndex = page * limit;
        let endIndex = Int.min(startIndex + limit, totalCount);
        
        let paginatedData = Buffer.Buffer<Types.Invoice>(0);
        var i = startIndex;
        while (i < endIndex) {
            paginatedData.add(filteredInvoices.get(i));
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
    
    public query func filter_invoices_by_amount_range(
        minAmount: Nat,
        maxAmount: Nat,
        pagination: ?Types.PaginationParams
    ) : async Types.ApiResult<Types.PaginatedResponse<Types.Invoice>> {
        let filteredInvoices = Buffer.Buffer<Types.Invoice>(0);
        
        for (invoice in invoices.vals()) {
            if ((invoice.status == #available_for_funding or invoice.status == #partially_funded) and
                invoice.amount >= minAmount and invoice.amount <= maxAmount) {
                filteredInvoices.add(invoice);
            };
        };
        
        let totalCount = filteredInvoices.size();
        let (page, limit) = switch (pagination) {
            case (?params) (params.page, params.limit);
            case null (0, 20);
        };
        
        let startIndex = page * limit;
        let endIndex = Int.min(startIndex + limit, totalCount);
        
        let paginatedData = Buffer.Buffer<Types.Invoice>(0);
        var i = startIndex;
        while (i < endIndex) {
            paginatedData.add(filteredInvoices.get(i));
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
    
    // === ADMIN FUNCTIONS ===
    
    public shared(msg) func approve_invoice(invoiceId: Text) : async Types.ApiResult<Text> {
        // TODO: Add admin role check
        
        switch (invoices.get(invoiceId)) {
            case (?invoice) {
                if (invoice.status != #pending_approval) {
                    return #err(#invalid_input("Invoice is not pending approval"));
                };
                
                let updatedInvoice = {
                    invoice with
                    status = #available_for_funding;
                };
                
                invoices.put(invoiceId, updatedInvoice);
                #ok("Invoice approved and listed for funding")
            };
            case null #err(#not_found("Invoice not found"));
        };
    };
    
    public shared(msg) func reject_invoice(invoiceId: Text, reason: Text) : async Types.ApiResult<Text> {
        // TODO: Add admin role check
        
        switch (invoices.get(invoiceId)) {
            case (?invoice) {
                if (invoice.status != #pending_approval) {
                    return #err(#invalid_input("Invoice is not pending approval"));
                };
                
                let updatedInvoice = {
                    invoice with
                    status = #draft; // Send back to draft for revision
                };
                
                invoices.put(invoiceId, updatedInvoice);
                #ok("Invoice rejected: " # reason)
            };
            case null #err(#not_found("Invoice not found"));
        };
    };
    
    // === MARKETPLACE ANALYTICS ===
    
    public query func get_marketplace_stats() : async {
        total_invoices: Nat;
        available_for_funding: Nat;
        total_funding_requested: Nat;
        total_funding_received: Nat;
        average_funding_time: ?Float;
    } {
        var totalInvoices = 0;
        var availableCount = 0;
        var totalRequested : Nat = 0;
        var totalReceived : Nat = 0;
        
        for (invoice in invoices.vals()) {
            totalInvoices += 1;
            totalRequested += invoice.financing_request.requested_amount;
            totalReceived += invoice.financing_request.current_funding;
            
            switch (invoice.status) {
                case (#available_for_funding or #partially_funded) {
                    availableCount += 1;
                };
                case _ {};
            };
        };
        
        {
            total_invoices = totalInvoices;
            available_for_funding = availableCount;
            total_funding_requested = totalRequested;
            total_funding_received = totalReceived;
            average_funding_time = null; // TODO: Calculate based on historical data
        }
    };
    
    public query func health_check() : async {status: Text; timestamp: Int} {
        {
            status = "healthy";
            timestamp = Time.now();
        }
    };
}