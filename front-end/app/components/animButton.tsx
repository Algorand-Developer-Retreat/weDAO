import { motion } from "framer-motion";
import React from "react";
import { getEnvColor } from "../utils";
import ClientOnly from "./clientOnly";

interface AnimButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const baseColor = "#" + getEnvColor("primary", "#00f5c0");
const hoverColor = "#" + getEnvColor("secondary", "#fc0589");

const AnimButton: React.FC<AnimButtonProps> = ({
  onClick,
  children,
  disabled,
}) => {
  return (
    <ClientOnly>
      <motion.button
        whileHover={{
          scale: 1.05,
          backgroundColor: hoverColor,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        initial={{
          backgroundColor: baseColor,
        }}
        animate={{
          backgroundColor: baseColor,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`text-background text-2xl md:text-3xl font-bold rounded-full px-6 py-2 shadow-xl cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        {children}
      </motion.button>
    </ClientOnly>
  );
};

export default AnimButton;
