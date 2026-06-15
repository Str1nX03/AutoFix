"use client";

import { motion } from "framer-motion";

export default function Orb() {
  return (
    <div className="relative flex items-center justify-center w-[320px] h-[320px]">
      {/* Pulse Ring */}
      <motion.div
        animate={{
          scale: [1, 1.8],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="
          absolute
          inset-0
          rounded-full
          border
          border-blue-400/30
        "
      />

      {/* Secondary Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.5],
          opacity: [0.4, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
        className="
          absolute
          inset-8
          rounded-full
          border
          border-violet-400/20
        "
      />

      {/* Outer Glow */}
      <div
        className="
          absolute
          inset-10
          rounded-full
          bg-blue-500/20
          blur-[80px]
        "
      />

      {/* Main Orb */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="relative w-[200px] h-[200px]">
          <motion.div
            animate={{
              scale: [1, 1.6],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-blue-400/40"
          />

          <div className="absolute inset-1 rounded-full border border-blue-300/20" />

          <div className="absolute inset-2 rounded-full bg-blue-500/50 blur-lg" />

            <div
              className="
          absolute inset-[8px]
          rounded-full
          bg-gradient-to-br
          from-white
          via-[#edf1ff]
          to-[#8fa3ff]
          shadow-[0_0_80px_rgba(139,92,246,0.9)]
        "
            />
        </div>
      </motion.div>
    </div>
  );
}
