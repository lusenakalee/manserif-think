"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { slide, scale } from "@/lib/animation";

interface NavLinkData {
  title: string;
  href: string;
  index: number;
}

interface NavLinkProps {
  data: NavLinkData;
  isActive: boolean;
  setSelectedIndicator: Dispatch<SetStateAction<string>>;
}

export default function NavLink({ data, isActive, setSelectedIndicator }: NavLinkProps) {
  const { title, href, index } = data;

  return (
    <motion.div
      className="relative flex items-center"
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className="absolute -left-[30px] h-[10px] w-[10px] rounded-full bg-white"
      />
      <Link href={href}>{title}</Link>
    </motion.div>
  );
}