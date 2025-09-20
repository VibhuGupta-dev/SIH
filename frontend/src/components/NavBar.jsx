import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingButton from "./FloatingButton";

const logoVariants = {
  hidden: { opacity: 0, y: -20, rotateX: -30 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  hover: {
    rotateY: [0, 10, -10, 0],
    transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: {
    scale: 1.05,
    rotateX: 5,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 w-full bg-teal-900/20 backdrop-blur-lg border-b border-teal-700/30 px-6 py-4 flex justify-between items-center z-20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-teal-300 opacity-20 rounded-full"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 8}s infinite`,
            }}
          />
        ))}
      </div>

      <motion.h1
        className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        HelloMind
      </motion.h1>

      <div className="flex gap-4">
        <motion.div variants={linkVariants} initial="hidden" animate="visible" whileHover="hover">
          <Link to="/">
            <FloatingButton variant="ghost">Home</FloatingButton>
          </Link>
        </motion.div>
        <motion.div variants={linkVariants} initial="hidden" animate="visible" whileHover="hover">
          <Link to="/signin">
            <FloatingButton variant="primary">Sign In</FloatingButton>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20vh) rotate(180deg); opacity: 0.2; }
          100% { transform: translateY(-40vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </motion.nav>
  );
}