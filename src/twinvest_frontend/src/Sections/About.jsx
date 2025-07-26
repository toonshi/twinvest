import React from "react";
import { motion } from "framer-motion";
import business from "../assets/business.jpg";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const About = () => {
  return (
    <div
      className="lg:w-[80%] w-[90%] m-auto py-[60px] flex lg:flex-row flex-col justify-between items-start gap-[50px]"
      id="about"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={SlideUpVariants}
        className="lg:w-[60%] w-full flex flex-col justify-center items-start gap-6"
      >
        <motion.h1
          variants={SlideUpVariants}
          className="text-black text-2xl font-medium"
        >
          EMPOWER
        </motion.h1>
        <motion.h1
          variants={SlideUpVariants}
          className="text-black uppercase text-[40px] font-bold"
        >
          TRANSFORMING INVOICES INTO DIGITAL ASSETS
        </motion.h1>
        <div className="w-[120px] h-[6px] bg-yellow-500"></div>
        <p className="text-3xl italic text-black-50 mt-[60px]">
          Our platform revolutionizes invoice financing by tokenizing invoices
          as NFTS. This innovative approach enables SMEs to access immediate
          cash flow while offering investors attractive returns.
        </p>

        <div className="flex gap-70 mt-4">
          {/* How It Works */}
          <div className="flex flex-col items-start gap-2 max-w-[250px]">
            <span className="text-5xl">📈</span>
            <h3 className="font-bold text-2xl">How It Works</h3>
            <p className="text-2xl text-black">
              SMEs upload invoices, and investors purchase NFTs for discounted
              returns.
            </p>
          </div>
               <div className="flex flex-col items-start gap-2 max-w-[250px]">
            <span className="text-5xl">💡</span>
            <h3 className="font-bold text-2xl">Key Benefits</h3>
            <p className="text-2xl text-black">
              Unlocks liquidity for SMEs and offers profitable opportunities for investors.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mt-12">
          <button className="border border-black px-6 py-2 font-medium hover:bg-black hover:text-white transition">
            Learn More
          </button>
          <button className="text-black font-semibold flex items-center gap-2 hover:underline">
            Sign Up →
          </button>
        </div>
        
      </motion.div>
      <div className="w-[90%] flex flex-col justify-end items-end">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <motion.img
          initial="hidden"
          whileInView="visible"
          variants={ZoomInVariants}
          src={business}
          alt="business image"
          className="lg:h-[650px] h-[650px] lg:mb-[-100px] rounded-lg object-cover w-full"
        ></motion.img>
        </div>
      </div>
    </div>
  );
};

export default About;
