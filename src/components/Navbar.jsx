import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";
import { SlideUpVariants, ZoomInVariants } from "./animation.js";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <motion.nav
      className="w-full flex py-6 justify-between items-center navbar"
      variants={SlideUpVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src={logo}
        alt="twinvest"
        className="w-[204px] h-[45px] cursor-pointer"
        variants={ZoomInVariants}
        whileHover={{
          scale: 1.1,
          filter: "brightness(1.2)",
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.95 }}
      />

      {/* Desktop Navigation */}
      <motion.ul
        className="list-none sm:flex hidden justify-end items-center flex-1"
        variants={SlideUpVariants}
      >
        {navLinks.map((nav, index) => (
          <motion.li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
            variants={SlideUpVariants}
            whileHover={{
              scale: 1.1,
              color: "#ffffff",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.6)",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={nav.path || `#${nav.id}`}>{nav.title}</Link>
          </motion.li>
        ))}
      </motion.ul>

      {/* Mobile Menu Button */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <motion.img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
          variants={ZoomInVariants}
          whileHover={{
            scale: 1.2,
            rotate: 180,
            filter: "brightness(1.3)",
            transition: { duration: 0.4 },
          }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Mobile Sidebar */}
        <motion.div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={
            toggle
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.3, ease: "easeOut" },
                }
              : {
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                  transition: { duration: 0.2 },
                }
          }
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <motion.li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => {
                  setActive(nav.title);
                  setToggle(false); // Close menu on selection
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={
                  toggle
                    ? {
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: index * 0.1,
                          duration: 0.3,
                        },
                      }
                    : { opacity: 0, x: 20 }
                }
                whileHover={{
                  scale: 1.1,
                  color: "#ffffff",
                  x: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={nav.path || `#${nav.id}`}>{nav.title}</Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
