import Blob "mo:base/blob";



module {
	public type User = {
		name: Text;
		email: Text;
		bio: Text;
		avatar: Blob;
		count_completed:Nat

	};

	public type ProjectStatus = {
		#Open;
		#InProgress;
		#Completed;
		#PaymentRequested;
		#Paid;


	}

	public type Project = {
		 id: Nat;
		 title: Text;
		 description;
		 payment_offer: Float;
		 posted_by: Principal;
		 accepted_by:?Principal;
		 status: ProjectStatus

		 };

	public type PaymentRequest = {
		project_id: Nat;
		requester: Principal;
		approved: Bool;
	}

		
	};
