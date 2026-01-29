import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Types "./types";

module InvestmentLogic {

  public func addInvestmentLogic(
    caller_principal: Principal,
    projectId : Nat,
    amount : Nat,
    current_investments: [Types.Investment]
  ) : async Types.ApiResult<Types.Investment> {
    // id is just the current length (simple)
    let id : Nat = current_investments.size();
    // build the investment record (assumes Types.Investment shape matches)
    let inv : Types.Investment = {
      id = Nat.toText(id);
      projectId = projectId;
      investor = caller_principal;
      amount_invested = amount;
      investment_date = Time.now();
      expected_return = 0; // Placeholder
      maturity_date = Time.now(); // Placeholder
      status = #active; // Placeholder
      risk_rating = #low; // Placeholder
      invoice_id = ""; // Placeholder
    };

    // create a new investments array and overwrite state (moc 0.28.0 friendly)
    let newInvs = Array.append(current_investments, [inv]);

    // In a real scenario, you would return newInvs and update state in the main actor
    return #ok(inv);
  };
}