"use client";

import { motion, type Variants } from "framer-motion";

export default function Curve() {
  // This only ever mounts client-side (rendered inside Nav, which itself
  // only appears after the menu button is clicked), so window is safe to
  // read here — the typeof guard just keeps it SSR/type-safe.
  const innerHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  const initialPath = `M100 0 L100 ${innerHeight} Q-100 ${innerHeight / 2} 100 0`;
  const targetPath = `M100 0 L100 ${innerHeight} Q100 ${innerHeight / 2} 100 0`;

  const curve: Variants = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <svg className="absolute -left-[99px] top-0 hidden h-full w-[100px] fill-[rgb(41,41,41)] stroke-none sm:block">
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
}