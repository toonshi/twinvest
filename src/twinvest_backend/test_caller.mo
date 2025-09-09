import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

actor {
  public shared ({ caller }) func getCallerPrincipal() : async Result.Result<Principal, Text> {
    Debug.print("Caller from signature: " # Principal.toText(caller));
    Debug.print("Caller from msg.caller: " # Principal.toText(msg.caller));
    return #ok(caller);
  };

  public shared func getMsgCallerPrincipal() : async Result.Result<Principal, Text> {
    Debug.print("Caller from msg.caller: " # Principal.toText(msg.caller));
    return #ok(msg.caller);
  };
}