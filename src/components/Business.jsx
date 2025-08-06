import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { features } from "../constants";
import styles, { layout } from "../style";
import Button from "./Button";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const FeatureCard = ({ icon, title, content, index }) => (
  <motion.div 
    className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} feature-card cursor-pointer relative overflow-hidden`}
    variants={SlideUpVariants}
    whileHover={{
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Ball-like hover effects */}
    <motion.div 
      className="absolute -right-10 -top-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: 1.5, 
        opacity: 0.8,
        rotate: 180,
        transition: { duration: 0.5 }
      }}
    />
    
    <motion.div 
      className="absolute -left-8 -bottom-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: 1.3, 
        opacity: 0.6,
        rotate: -180,
        transition: { duration: 0.6 }
      }}
    />
    
    <motion.div 
      className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue relative z-10`}
      whileHover={{
        scale: 1.1,
        rotate: 360,
        boxShadow: "0 0 20px rgba(0, 100, 255, 0.5)",
        transition: { duration: 0.5 }
      }}
    >
      <motion.img 
        src={icon} 
        alt="star" 
        className="w-[50%] h-[50%] object-contain" 
        whileHover={{
          scale: 1.2,
          filter: "brightness(1.3)",
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
    
    <div className="flex-1 flex flex-col ml-3 relative z-10">
      <motion.h4 
        className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1"
        whileHover={{
          color: "#00f5ff",
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
      >
        {title}
      </motion.h4>
      <motion.p 
        className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]"
        whileHover={{
          color: "#ffffff",
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
      >
        {content}
      </motion.p>
    </div>
  </motion.div>
);

const Business = () => (
  <motion.section 
    id="about" 
    className={layout.section}
    variants={SlideUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
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
        TRANSFORMING INVOICES, <br className="sm:block hidden" /> INTO DIGITAL ASSETS
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
        Our platform revolutionizes invoice financing by tokenizing invoices such as
        NFT's. This innovative approach enables SMEs to access immediate cashflow while
        offering investors attractive returns.
      </motion.p>

      <motion.div
        variants={SlideUpVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button styles={`mt-10`} />
      </motion.div>
    </motion.div>

    <motion.div 
      className={`${layout.sectionImg} flex-col`}
      variants={ZoomInVariants}
    >
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </motion.div>
  </motion.section>
);

export default Business;