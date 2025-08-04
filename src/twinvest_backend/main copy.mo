import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter"; // for converting iter to array
import Nat32 "mo:base/Nat32";

actor Twinvest {

  // Define hash functions
  func textHash(t: Text): Nat32 = Text.hash(t);
  func natHash(n: Nat): Nat32 = Nat32.fromNat(n);

  // USER TYPES
  public type Role = {
    #freelancer;
    #client;
    #investor;
  };

  public type User = {
    id: Text;
    username: Text;
    role: Role;
    btcAddress: Text;
    joined: Time.Time;
  };

  // INVOICE TYPES
  public type InvoiceStatus = {
    #Open;
    #Financed;
    #Paid;
  };

  public type Invoice = {
    id: Nat;
    freelancerId: Text;
    clientId: Text;
    description: Text;
    amount: Nat;
    dueDate: Time.Time;
    status: InvoiceStatus;
    financedBy: ?Text;
    createdAt: Time.Time;
  };

  public type Bid = {
    investorId: Text;
    invoiceId: Nat;
    offeredAmount: Nat;
    createdAt: Time.Time;
  };

  // STORAGE
  var users = HashMap.HashMap<Text, User>(100, Text.equal, textHash);
  var invoices = HashMap.HashMap<Nat, Invoice>(100, Nat.equal, natHash);
  var bids = HashMap.HashMap<Nat, Bid>(100, Nat.equal, natHash);
  var nextInvoiceId: Nat = 1;

  // REGISTER USER
  public func register(id: Text, username: Text, role: Role, btcAddress: Text): async Text {
    if (users.get(id) != null) {
      return "User already exists.";
    };
    let user: User = {
      id;
      username;
      role;
      btcAddress;
      joined = Time.now();
    };
    users.put(id, user);
    return "Registered successfully.";
  };

  public query func getUser(id: Text): async ?User {
    users.get(id)
  };

  // CREATE INVOICE
  public func createInvoice(freelancerId: Text, clientId: Text, description: Text, amount: Nat, dueDate: Time.Time): async Text {
    let invoice: Invoice = {
      id = nextInvoiceId;
      freelancerId;
      clientId;
      description;
      amount;
      dueDate;
      status = #Open;
      financedBy = null;
      createdAt = Time.now();
    };
    invoices.put(nextInvoiceId, invoice);
    nextInvoiceId += 1;
    return "Invoice created.";
  };

  public query func getInvoices(): async [Invoice] {
    Iter.toArray(invoices.vals())
  };

  // INVESTOR BIDS TO FINANCE
  public func financeInvoice(invoiceId: Nat, investorId: Text, offerAmount: Nat): async Text {
    switch (invoices.get(invoiceId)) {
      case null return "Invoice not found.";
      case (?inv) {
        if (inv.status != #Open) {
          return "Invoice is not open.";
        };
        let bid: Bid = {
          investorId;
          invoiceId;
          offeredAmount = offerAmount;
          createdAt = Time.now();
        };
        bids.put(invoiceId, bid);

        // Update invoice
        let updated = {
          inv with
          status = #Financed;
          financedBy = ?investorId;
        };
        invoices.put(invoiceId, updated);
        return "Invoice financed.";
      };
    }
  };

  // CLIENT MARKS AS PAID
  public func markInvoicePaid(invoiceId: Nat): async Text {
    switch (invoices.get(invoiceId)) {
      case null return "Invoice not found.";
      case (?inv) {
        let updated = {
          inv with status = #Paid;
        };
        invoices.put(invoiceId, updated);
        return "Invoice marked as paid.";
      };
    };
  };
};
