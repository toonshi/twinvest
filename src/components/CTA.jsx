import styles from "../style";

const CTA = () => (
  <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>TRANSFORM YOUR 
        CASHFLOW TODAY</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Unlock the potential of your unpaid invoices with our innovative DeFI solution.
        Sign up now to access early cash-flow and empower your business.
      </p>
    </div>
    
    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <button 
        className="py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => {
          // Add your sign up logic here
          console.log("Sign up clicked!");
        }}
      >
        Sign Up
      </button>
    </div>
  </section>
);

export default CTA;