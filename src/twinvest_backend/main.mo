import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Types "lib/types";

actor{
  // Internal counter for unique project IDs
  stable var projectCounter: Nat;

  // Users mapped by Principal
  stable var users = HashMap.HashMap<Principal, Types.User>(10, Principal.equal, Principal.hash);

  // Projects mapped by ID
  stable var projects = HashMap.HashMap<Nat, Types.Project>(10, Nat.equal, Nat.hash);


    //helper function for project ids
  function nextProjectId(): Nat {

    let id = projectCounter;
    projectCounter += 1;
    return id;
  }  


  public func registerUser(name: Text, email: Text, avatar: Blob, bio: Text): async Text {
    let caller = Principal.fromActor(this);

    if (users.get(caller) != null){
      return "User already exists"
    };

    let newUser = Types.User = {
        name;
        email;
        bio;
        avatar;
        count_completed = 0;

    };

    users.put(caller,newUser);
    return " User has been registered";

  };

  public func registerProject(id: Nat,title: Text, description: Text, status: projectStatus, payment_offer: Float): async Text { 

      let caller = principal.fromActor(this);
      if(users.get(caller) == null){
        return "Register first!"
      };

      let id = nextProjectId();

      let newProject = Types.Project = {
         id;
         title;
         description;
         payment_offer;
         posted_by = caller;
         accepted_by = null;
         status;

         

         };
         projects.push(id, newProject);
         return "Project has been posted";

  }


  public func acceptProject(projectId: Nat): async Text {

    let caller = principal.fromActor(this);

    if (users.getCaller == null){
    return " Register First!"
    };

    switch(projects.get(projectId)){
      case null {
        return "Project does not exist";
      };
      case (?proj) {
        switch(proj.status){
          case(#Open){
            let updatedProject = {
              proj with
              status = #InProgress;
              accepted_by = ?caller;

            };
            projects.put(projectId,updatedProject);

          };
          case_ {
          return "Project is not open for acceptance";
          };
        };
      };

    };

  };


    public func requestPayment (projectId:Nat): async Text {
    

    let caller = principal.fromActor(this);

    switch(projects.get(projectId){
          case null {
            return("Project not found");
          };
          case(?proj) {
            if(?caller !=proj.accepted_by){
                return("You did not accept this project");

            };
          };
        switch(proj.status){
        case(#InProgress){
            let updated = {
            proj with
            status = #PaymentRequested;
            };
            projects.put(projectId,updated);
            return "Payment requested";

        };
        case_ {
                return "Invalid status for payment";

        };

        };

    };


    
};

      public func approvePayment(projectId: Nat): async Text {
    let caller = Principal.fromActor(this);

    switch (projects.get(projectId)) {
      case null return "Project not found.";
      case (?proj) {
        if (proj.posted_by != caller) {
          return "You are not the project owner.";
        };

        switch (proj.status) {
          case (#PaymentRequested) {
            let updated = {
              proj with
              status = #Paid;
            };
            projects.put(projectId, updated);

            // increment completed counter for worker
            switch (proj.accepted_by) {
              case null {};
              case (?worker) {
                switch (users.get(worker)) {
                  case null {};
                  case (?u) {
                    users.put(worker, {
                      u with
                      count_completed = u.count_completed + 1;
                    });
                  };
                };
              };{
            };

            return "Payment approved.";
          };
          case _ return "Project not in payment request state.";
        };
      };
    };



  public query func getOpenProjects(): async [Types.Project] {
    var results: [Types.Project] = [];

    for ((_, proj) in projects.entries()) {
      if (proj.status == #Open) {
        results := Array.append<Types.Project>(results, [proj]);
      };
    };

    return results;
  };
}


  


