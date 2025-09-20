import React from "react";
import Navbar from "../components/NavBar";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-teal-50 via-blue-50 to-gray-100 text-gray-800">
      <Navbar />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <style>{`
          .wave-layer {
            position: absolute;
            bottom: 0;
            width: 200%;
            height: 150px;
            background: rgba(20, 184, 166, 0.2);
            animation: waveMove 10s linear infinite;
            border-radius: 100% 100% 0 0;
          }
          .wave-layer:nth-child(2) {
            animation-delay: -3s;
            opacity: 0.6;
            height: 120px;
          }
          .wave-layer:nth-child(3) {
            animation-delay: -1.5s;
            opacity: 0.4;
            height: 90px;
          }
          @keyframes waveMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>

        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>

        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-300 opacity-30"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float 12s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-32 flex-grow">
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-xl"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            animate={{ rotateY: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
          >
            HelloMind
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-4xl font-semibold"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Your <span className="text-teal-500">mental wellness</span> journey begins
          </motion.h2>

          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Discover personalized mental health support with AI-driven insights and tools for emotional well-being.
          </motion.p>

          <div className="flex gap-4 mt-4">
            <FloatingButton onClick={() => navigate("/signin")}>
              Get Started <ArrowRight size={20} />
            </FloatingButton>
            <FloatingButton variant="secondary" onClick={() => navigate("/signup")}>
              Learn More
            </FloatingButton>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
            alt="Mindfulness Illustration"
            className="w-64 md:w-80 lg:w-96"
            loading="lazy"
          />
        </motion.div>
      </section>

      <footer className="mt-auto py-6 bg-teal-900/20 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} HelloMind. All rights reserved.
      </footer>
    </div>
  );
}