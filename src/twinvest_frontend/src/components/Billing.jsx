import React from 'react';
import { motion } from "framer-motion";
import { apple, bill, google } from "../assets";
import styles, { layout } from "../style";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const Billing = () => (
  <motion.section 
    id="product" 
    className={layout.sectionReverse}
    variants={SlideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
    <motion.div 
      className={layout.sectionImgReverse}
      variants={ZoomInVariants}
    >
      <motion.img 
        src={bill} 
        alt="billing" 
        className="w-[100%] h-[100%] relative z-[5] cursor-pointer" 
        whileHover={{
          scale: 1.05,
          rotate: [0, -1, 1, 0],
          filter: "brightness(1.1)",
          transition: { 
            duration: 0.6,
            rotate: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
          }
        }}
        whileTap={{ scale: 0.98 }}
      />
      
      {/* gradient start - Ball-like hover animations */}
      <motion.div 
        className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient cursor-pointer" 
        whileHover={{
          scale: 1.3,
          rotate: 180,
          opacity: 0.9,
          transition: { duration: 0.8 }
        }}
      />
      <motion.div 
        className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient cursor-pointer" 
        whileHover={{
          scale: 1.4,
          opacity: 0.8,
          rotate: -180,
          transition: { duration: 0.7 }
        }}
      />
      {/* gradient end */}
    </motion.div>
    
    <motion.div 
      className={layout.sectionInfo}
      variants={SlideUpVariants}
    >
      <motion.h2 
        className={styles.heading2}
        variants={SlideUpVariants}
        whileHover={{
          scale: 1.02,
          color: "#00f5ff",
          textShadow: "0 0 20px rgba(0, 245, 255, 0.6)",
          transition: { duration: 0.4 }
        }}
      >
        UNLOCK FINANCIAL OPPORTUNITIES<br className="sm:block hidden" /> FOR SMES
      </motion.h2>
      
      <motion.p 
        className={`${styles.paragraph} max-w-[470px] mt-5`}
        variants={SlideUpVariants}
        whileHover={{
          scale: 1.01,
          color: "#ffffff",
          transition: { duration: 0.3 }
        }}
      >
        Our platform bridges the gap between SMEs and investors. Experience seamless invoice financing with innovative NFT technology.
      </motion.p>
      
      {/* Features Section */}
      <motion.div 
        className="flex flex-col mt-8 space-y-6"
        variants={SlideUpVariants}
      >
        {/* Feature 1 */}
        <motion.div 
          className="flex items-start space-x-4 cursor-pointer"
          variants={SlideUpVariants}
          whileHover={{
            scale: 1.03,
            x: 10,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-8 h-8 bg-blue-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            whileHover={{
              scale: 1.2,
              rotate: 360,
              boxShadow: "0 0 20px rgba(0, 100, 255, 0.6)",
              transition: { duration: 0.5 }
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <motion.h3 
              className="font-poppins font-semibold text-[18px] leading-[27px] text-white mb-2"
              whileHover={{
                color: "#00f5ff",
                transition: { duration: 0.3 }
              }}
            >
              Secure Access for SMEs and Investors
            </motion.h3>
            <motion.p 
              className={`${styles.paragraph} text-[14px] leading-[21px]`}
              whileHover={{
                color: "#ffffff",
                transition: { duration: 0.3 }
              }}
            >
              Secure Access for SMEs and Investors
            </motion.p>
          </div>
        </motion.div>
        
        {/* Feature 2 */}
        <motion.div 
          className="flex items-start space-x-4 cursor-pointer"
          variants={SlideUpVariants}
          whileHover={{
            scale: 1.03,
            x: 10,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-8 h-8 bg-blue-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            whileHover={{
              scale: 1.2,
              rotate: 360,
              boxShadow: "0 0 20px rgba(0, 100, 255, 0.6)",
              transition: { duration: 0.5 }
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <motion.h3 
              className="font-poppins font-semibold text-[18px] leading-[27px] text-white mb-2"
              whileHover={{
                color: "#00f5ff",
                transition: { duration: 0.3 }
              }}
            >
              Transform Invoices into NFTs
            </motion.h3>
            <motion.p 
              className={`${styles.paragraph} text-[14px] leading-[21px]`}
              whileHover={{
                color: "#ffffff",
                transition: { duration: 0.3 }
              }}
            >
              Effortlessly Mint NFTs representing your unpaid invoices in seconds.
            </motion.p>
          </div>
        </motion.div>
        
        {/* Feature 3 */}
        <motion.div 
          className="flex items-start space-x-4 cursor-pointer"
          variants={SlideUpVariants}
          whileHover={{
            scale: 1.03,
            x: 10,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="w-8 h-8 bg-blue-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            whileHover={{
              scale: 1.2,
              rotate: 360,
              boxShadow: "0 0 20px rgba(0, 100, 255, 0.6)",
              transition: { duration: 0.5 }
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <motion.h3 
              className="font-poppins font-semibold text-[18px] leading-[27px] text-white mb-2"
              whileHover={{
                color: "#00f5ff",
                transition: { duration: 0.3 }
              }}
            >
              Automated Payments with Escrow Smart Contracts
            </motion.h3>
            <motion.p 
              className={`${styles.paragraph} text-[14px] leading-[21px]`}
              whileHover={{
                color: "#ffffff",
                transition: { duration: 0.3 }
              }}
            >
              Enjoy secure transactions with automated escrow payouts.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex flex-row flex-wrap sm:mt-10 mt-6"
        variants={SlideUpVariants}
      >
        <motion.img 
          src={apple} 
          alt="apple_store" 
          className="w-[128.86px] h-[42.05px] object-contain mr-5 cursor-pointer" 
          whileHover={{
            scale: 1.1,
            filter: "brightness(1.2)",
            y: -5,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        />
        <motion.img 
          src={google} 
          alt="google_play" 
          className="w-[144.17px] h-[43.08px] object-contain cursor-pointer" 
          whileHover={{
            scale: 1.1,
            filter: "brightness(1.2)",
            y: -5,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        />
      </motion.div>
    </motion.div>
  </motion.section>
);

export default Billing;