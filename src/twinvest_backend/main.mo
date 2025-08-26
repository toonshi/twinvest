import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor twinvest_backend {

  // Temporary in-memory store for investments
  stable var investments : [Investment] = [];

  // Record type for an investment
  public type Investment = {
    id : Nat;
    investor : Text;
    amount : Nat;
  };

  // Add a new investment
  public func addInvestment(investor : Text, amount : Nat) : async Investment {
    let id = investments.size(); // use the length of the array as ID
    let investment : Investment = {
      id = id;
      investor = investor;
      amount = amount;
    };
    investments := Array.append(investments, [investment]);
    return investment;
  };

  // Get all investments
  public query func getInvestments() : async [Investment] {
    return investments;
  };

}