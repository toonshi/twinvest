import React from 'react';
import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";
import { motion } from "framer-motion";
import { SlideUpVariants } from "./animation";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        TRANSFORMING INVOICES <br className="sm:block hidden" /> FINANCING FOR
        SMES
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Our platform simplifies the invoice financing process for SMEs. By
        connecting them with investors, we provide immediate cash flow while
        offering a unique investment opportunity.
      </p>

      {/* Steps Section with animation */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 mt-8 mb-8"
        variants={SlideUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Step 1 */}
        <motion.div
          className="flex-1 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          variants={SlideUpVariants}
        >
          <div className="w-12 h-12 bg-blue-gradient rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-white mb-2">
            STEP 1: SME REGISTRATION AND INVOICE UPLOAD
          </h3>
          <p className={`${styles.paragraph} text-[14px] leading-[20px]`}>
            SMEs sign up and upload their unpaid invoice details.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="flex-1 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          variants={SlideUpVariants}
        >
          <div className="w-12 h-12 bg-blue-gradient rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-white mb-2">
            STEP 2: NFT MINTING AND MARKETPLACE BROWSING
          </h3>
          <p className={`${styles.paragraph} text-[14px] leading-[20px]`}>
            A smart contract mints an NFT tied to the invoice. Investors browse the marketplace.
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          className="flex-1 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          variants={SlideUpVariants}
        >
          <div className="w-12 h-12 bg-blue-gradient rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-white mb-2">
            STEP 3: INVESTOR PURCHASE AND ESCROW
          </h3>
          <p className={`${styles.paragraph} text-[14px] leading-[20px]`}>
            Investors browse the marketplace and buy NFTs at a discount.
          </p>
        </motion.div>
      </motion.div>

      <Button styles={`mt-10`} />
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
