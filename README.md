# Twinvest Frontend Testing Guide

This guide provides instructions for testing the Twinvest frontend application, focusing on the integration with the backend functionalities.

## Prerequisites

Before you begin, ensure you have:
- `dfx` (Internet Computer SDK) installed and configured.
- `npm` (Node Package Manager) installed.
- The Twinvest project cloned to your local machine.

## Setup and Deployment

1.  **Stop any running `dfx` instances and clean up old deployments:**
    ```bash
    dfx stop
    rm -rf .dfx
    ```
2.  **Start `dfx` in the background:**
    ```bash
    dfx start --background
    ```
3.  **Deploy the canisters in dependency order:**
    ```bash
    dfx deploy role_registry
    dfx deploy twinvest_backend
    dfx deploy twinvest_frontend
    ```
    *(Note: You might see warnings during deployment, but as long as there are no errors, it should be fine.)*

## Frontend Testing Steps

Follow these steps to test the frontend functionalities:

1.  **Start the frontend development server:**
    Navigate to the project root directory (`/home/toonshi/projects/twinvest/`) and run:
    ```bash
    npm start
    ```
    This will typically open the application in your browser at `http://localhost:3000/`.

2.  **Test User Registration (Sign Up Page):**
    *   Open your browser and navigate to the `/signup` page (e.g., `http://localhost:3000/signup`).
    *   **Select a Role:** Choose a role (e.g., "Investor") from the available options.
    *   **Fill in the Registration Form:**
        *   Enter a "First Name" and "Last Name".
        *   Provide an "Email" address (e.g., `test@example.com`).
        *   Set a "Password" and "Confirm Password".
        *   Check the "I agree to the Terms of Service and Privacy Policy" checkbox.
    *   **Click "Create Account"**.
    *   **Verification:**
        *   Observe a toast notification indicating successful account creation.
        *   Confirm that the application navigates to the corresponding dashboard (e.g., `/dashboard/investor`).

3.  **Test Investment Management (Investor Dashboard):**
    *   Ensure you are logged in as an "Investor" and are on the Investor Dashboard (e.g., `http://localhost:3000/dashboard/investor`).
    *   **Add an Investment:**
        *   Navigate to the "Marketplace" tab.
        *   Locate the "Add New Investment" form.
        *   Enter an "Investor Name" (e.g., "Jane Doe").
        *   Enter an "Amount" (e.g., `2500`).
        *   Click the "Add Investment" button.
        *   **Verification:**
            *   Observe a toast notification confirming "Investment Added!".
    *   **View Investments:**
        *   Navigate to the "My Investment Portfolio" tab.
        *   **Verification:**
            *   Confirm that the newly added investment (and any previous ones) are displayed in the list with their details.

## Backend Testing (Optional - for quick verification)

You can also test the backend functions directly using `dfx canister call` from your terminal.

1.  **Get your principal ID:**
    ```bash
    dfx identity get-principal
    ```
    *(Copy this ID, you'll need it for some calls.)*

2.  **Register a User (example for Investor role, no email):**
    ```bash
    dfx canister call twinvest_backend registerUser '(variant { investor }, null)'
    ```
    *(Note: For `opt text` fields like email, `dfx canister call` might be particular. `null` works for no value. For a value, it's `variant { some = "your@email.com" }` but this has shown issues with `moc 0.28.0`.)*

3.  **Get User Profile (using your principal ID):**
    ```bash
    dfx canister call twinvest_backend getUserProfile '(principal "YOUR_PRINCIPAL_ID")'
    ```

4.  **Add an Investment (example):**
    ```bash
    dfx canister call twinvest_backend addInvestment '(1, 1000)'
    ```
    *(Here, `1` is `projectId` and `1000` is `amount`.)*

5.  **Get All Investments:**
    ```bash
    dfx canister call twinvest_backend getInvestments
    ```

6.  **Sanity Check (to see user and investment counts):**
    ```bash
    dfx canister call twinvest_backend sanityCheck
    ```

---