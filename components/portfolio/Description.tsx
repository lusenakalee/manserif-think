"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { slideUp, opacity } from "@/lib/animation";
import Rounded from "../general/RoundedButton";

const Description: React.FC = () => {
  const phrase =
    "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge.";

  const description = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(description);

  return (
    <div
      ref={description}
      className="px-[200px] mt-[200px] flex justify-center"
    >
      <div className="max-w-[1400px] flex gap-[50px] relative">
        {/* First paragraph */}
        <p className="text-[36px] leading-[1.3] flex flex-wrap gap-2">
          {phrase.split(" ").map((word, index) => (
            <span
              key={index}
              className="relative overflow-hidden inline-flex mr-[3px]"
            >
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        {/* Second paragraph */}
        <motion.p
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="text-[18px] w-[80%] font-light"
        >
          The combination of my passion for design, code & interaction positions
          me in a unique place in the web design world.
        </motion.p>

        {/* Button */}
        <div data-scroll data-scroll-speed={0.1}>
          <Rounded className="absolute top-[80%] left-[calc(100%-200px)] w-[180px] h-[180px] bg-[#1C1D20] text-white rounded-full flex items-center justify-center cursor-pointer">
            <p className="text-[16px] font-light relative z-[1] m-0">
              About me
            </p>
          </Rounded>
        </div>
      </div>
    </div>
  );
};

export default Description;