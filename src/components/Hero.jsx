import { motion } from "framer-motion";
import styles from "../style";
import { discount, robot } from "../assets";
import GetStarted from "./GetStarted";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      {/* Left Content with SlideUp Animation */}
      <motion.div 
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
        variants={SlideUpVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Discount Banner with Hover */}
        <motion.div 
          className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2 cursor-pointer"
          variants={SlideUpVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <img src={discount} alt="discount" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{" "}
            <span className="text-white">1 Month</span> Account
          </p>
        </motion.div>

        <div className="flex flex-row justify-between items-center w-full">
          {/* Main Heading with Hover */}
          <motion.h1 
            className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] cursor-default"
            variants={SlideUpVariants}
            whileHover={{
              scale: 1.02,
              textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
              transition: { duration: 0.3 }
            }}
          >
            EMPOWERING SME's WITH <br className="sm:block hidden" />{" "}
            <span className="text-gradient">DECENTRALISED</span>{" "}
          </motion.h1>
          
          {/* Desktop GetStarted */}
          <motion.div 
            className="ss:flex hidden md:mr-4 mr-0"
            variants={ZoomInVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <GetStarted />
          </motion.div>
        </div>

        {/* Secondary Heading with Hover */}
        <motion.h1 
          className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full cursor-default"
          variants={SlideUpVariants}
          whileHover={{
            scale: 1.02,
            color: "#00f5ff",
            transition: { duration: 0.4 }
          }}
        >
          INVOICE FINANCING.
        </motion.h1>

        {/* Description with Hover */}
        <motion.p 
          className={`${styles.paragraph} max-w-[470px] mt-5 cursor-default`}
          variants={SlideUpVariants}
          whileHover={{
            scale: 1.02,
            color: "#ffffff",
            transition: { duration: 0.3 }
          }}
        >
          Unlock the potential of your business with our innovative platform that connects SME's to Investors.
          Experience fast, secure financing through tokenized invoices, designed to enhance cash flow and foster economic
          growth.
        </motion.p>
      </motion.div>

      {/* Right Image with Enhanced Hover */}
      <motion.div 
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
        variants={ZoomInVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img 
          src={robot} 
          alt="billing" 
          className="w-[100%] h-[100%] relative z-[5] cursor-pointer" 
          whileHover={{
            scale: 1.1,
            rotate: [0, -2, 2, 0],
            filter: "brightness(1.2)",
            transition: { 
              duration: 0.6,
              rotate: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
            }
          }}
          whileTap={{ scale: 0.95 }}
        />

        {/* Interactive Gradient Effects - Ball-like Hover Animations */}
        <motion.div 
          className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient cursor-pointer"
          whileHover={{
            scale: 1.5,
            opacity: 0.8,
            transition: { duration: 0.5 }
          }}
        />
        <motion.div 
          className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40 cursor-pointer"
          whileHover={{
            scale: 1.2,
            rotate: 180,
            transition: { duration: 1 }
          }}
        />
        <motion.div 
          className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient cursor-pointer"
          whileHover={{
            scale: 1.3,
            opacity: 0.9,
            transition: { duration: 0.5 }
          }}
        />
      </motion.div>

      {/* Mobile GetStarted with Hover */}
      <motion.div 
        className={`ss:hidden ${styles.flexCenter}`}
        variants={ZoomInVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <GetStarted />
      </motion.div>
    </section>
  );
};

export default Hero;