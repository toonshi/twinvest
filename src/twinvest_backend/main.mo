import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

actor Twinvest {

  // USER TYPES MODEL
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

  // PROJECT TYPES
  public type ProjectStatus = {
    #Open;
    #InProgress;
    #Completed;
    #Funded;
  };

  public type Project = {
    id: Nat;
    clientId: Text;
    title: Text;
    details: Text;
    status: ProjectStatus;
    createdAt: Time.Time;
  };

  public type ProjectBid = {
    freelancerId: Text;
    projectId: Nat;
    message: Text;
    createdAt: Time.Time;
  };

  public type ProjectInvestment = {
    investorId: Text;
    projectId: Nat;
    amount: Nat;
    investedAt: Time.Time;
  };

  // HASH FUNCTIONS
  private func textHash(t: Text): Nat32 {
    Text.hash(t)
  };
  private func natHash(n: Nat): Nat32 {
    Nat32.fromNat(n)
  };

  // STORAGE
  private var users = HashMap.HashMap<Text, User>(100, Text.equal, textHash);
  private var projects = HashMap.HashMap<Nat, Project>(100, Nat.equal, natHash);
  private var projectBids = HashMap.HashMap<Nat, [ProjectBid]>(100, Nat.equal, natHash);
  private var projectInvestments = HashMap.HashMap<Nat, [ProjectInvestment]>(100, Nat.equal, natHash);

  private var nextProjectId: Nat = 1;

  // REGISTER USER
  public func register(id: Text, username: Text, role: Role, btcAddress: Text): async Text {
    if (users.get(id) != null) {
      return "User already exists.";
    };
    let user: User = {
      id = id;
      username = username;
      role = role;
      btcAddress = btcAddress;
      joined = Time.now();
    };
    users.put(id, user);
    return "Registered successfully.";
  };

  // LOGIN SIMULATION
  public query func login(id: Text): async ?User {
    users.get(id)
  };

  // CREATE PROJECT (CLIENT)
  public func createProject(clientId: Text, title: Text, details: Text): async Text {
    let project: Project = {
      id = nextProjectId;
      clientId = clientId;
      title = title;
      details = details;
      status = #Open;
      createdAt = Time.now();
    };
    projects.put(nextProjectId, project);
    nextProjectId += 1;
    return "Project created.";
  };

  // GET CLIENT'S PROJECTS
  public query func getClientProjects(clientId: Text): async [Project] {
    let allProjects = projects.vals();
    let filtered = Iter.filter<Project>(allProjects, func(p: Project): Bool {
      p.clientId == clientId
    });
    Iter.toArray(filtered)
  };

  // FREELANCER BIDS ON PROJECT
  public func bidOnProject(projectId: Nat, freelancerId: Text, message: Text): async Text {
    let bid: ProjectBid = {
      freelancerId = freelancerId;
      projectId = projectId;
      message = message;
      createdAt = Time.now();
    };
    let existingBids = switch (projectBids.get(projectId)) {
      case null { [] };
      case (?bids) { bids };
    };
    projectBids.put(projectId, Array.append<ProjectBid>(existingBids, [bid]));
    return "Bid submitted.";
  };

  // INVESTOR INVESTS IN PROJECT
  public func investInProject(projectId: Nat, investorId: Text, amount: Nat): async Text {
    let investment: ProjectInvestment = {
      investorId = investorId;
      projectId = projectId;
      amount = amount;
      investedAt = Time.now();
    };
    let existingInvestments = switch (projectInvestments.get(projectId)) {
      case null { [] };
      case (?inv) { inv };
    };
    projectInvestments.put(projectId, Array.append<ProjectInvestment>(existingInvestments, [investment]));

    // Update project status
    switch (projects.get(projectId)) {
      case null { return "Project not found." };
      case (?p) {
        let updated: Project = {
          id = p.id;
          clientId = p.clientId;
          title = p.title;
          details = p.details;
          status = #Funded;
          createdAt = p.createdAt;
        };
        projects.put(projectId, updated);
      };
    };

    return "Investment recorded.";
  };

  // GET INVESTOR INVESTMENTS
  public query func getInvestments(investorId: Text): async [ProjectInvestment] {
    var result: [ProjectInvestment] = [];
    for (investments in projectInvestments.vals()) {
      for (investment in investments.vals()) {
        if (investment.investorId == investorId) {
          result := Array.append<ProjectInvestment>(result, [investment]);
        };
      };
    };
    result
  };
};