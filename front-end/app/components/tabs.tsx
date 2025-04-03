"use client";

import { motion } from "framer-motion";
import React, { ReactNode, useState } from "react";

export interface TabOptionInterface {
  label: string;
  icon?: ReactNode;
  enabled: boolean;
}
interface TabsPropsInterface {
  options: TabOptionInterface[];
  onClickHandler?: (value: string) => void;
  classes?: string;
}

export const Tabs: React.FC<TabsPropsInterface> = ({
  options,
  onClickHandler,
}) => {
  const [activeTab, setActiveTab] = useState<TabOptionInterface>({
    label: options[0].label,
    enabled: options[0].enabled,
  });

  return (
    <div
      className={`flex z-10 w-full justify-center md:justify-start mb-2  gap-5`}
    >
      {options.map((option, index) => (
        <motion.button
          key={index}
          className={`py-2 px-6 cursor-pointer text-background text-xl md:text-2xl  flex items-center
            ${
              activeTab.label === option.label
                ? "bg-secondary font-display rounded-full font-bold"
                : `bg-primary/50 rounded-full text-black hover:text-background ${
                    option.enabled ? "cursor-pointer" : "cursor-not-allowed"
                  }`
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (option.enabled) {
              setActiveTab(option);
              if (onClickHandler) {
                onClickHandler(option.label);
              }
            }
          }}
          disabled={!option.enabled}
        >
          <h2>{option.label}</h2>
        </motion.button>
      ))}
    </div>
  );
};
