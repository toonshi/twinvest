import React from "react";
// import heroimg from "../assets/heroimg.png.png";
import backgroundImage from "../assets/homeimg.png.jpg";
import { motion } from "framer-motion";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const Hero = () => {
  return (
    <div
      id="hero"
      className="w-full m-auto lg:h-[700px] h-fit pt-[60px] lg:px-[150px] px-[20px] flex flex-col lg:flex-row items-center justify-between gap-[50px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Text Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={SlideUpVariants}
        className="lg:w-[60%] w-full flex flex-col justify-center items-start gap-6"
      >
        <motion.h1
          variants={SlideUpVariants}
          className="text-white text-2xl font-medium"
        >
          Twinvest
        </motion.h1>
        <motion.h1
          variants={SlideUpVariants}
          className="text-white uppercase text-[40px] font-bold"
        >
          EMPOWERING SMES WITH DECENTRALIZED INVOICE FINANCING
        </motion.h1>
        <div className="w-[120px] h-[6px] bg-[#b87c4c]"></div>
        <p className="text-white text-[25px]">
          Unlock the potential of your business with our innovative platform
          that connects SMEs to Investors. Experience fast, secure financing
          through tokenized invoices, designed to enhance cash flow and foster
          economic growth across Africa.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={ZoomInVariants}
          className="flex gap-5"
        >
          <motion.button
            variants={ZoomInVariants}
            className="bg-[#b87c4c] hover:bg-white hover:text-black px-10 py-3 rounded-lg text-black font-bold"
          >
            Get Started
          </motion.button>
          <motion.button
            variants={ZoomInVariants}
            className="border-white hover:border-white hover:text-[#b87c4c] border-2 px-10 py-3 rounded-lg text-white font-bold"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Image Section */}
      {/* <div className="lg:w-[40%] w-full flex justify-center items-center">
        <motion.img
          initial="hidden"
          whileInView="visible"
          variants={ZoomInVariants}
          src={heroimg}
          alt="hero"
          className="h-[500px] lg:h-[600px] object-contain"
        />
      </div> */}
    </div>
  );
};

export default Hero;
