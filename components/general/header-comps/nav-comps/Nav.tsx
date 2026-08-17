"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "@/lib/animation";
import NavLink from "./NavLink";
import Curve from "./Curve";
import NavFooter from "./NavFooter";

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Pieces", href: "/pieces" },
  { title: "Exhibitions", href: "/exhibitions" },
  { title: "Portfolio", href: "/portfolio" },
];

export default function Nav() {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="fixed right-0 top-0 z-[3] h-screen w-full overflow-hidden bg-[rgb(41,41,41)] text-white sm:w-[70vw] md:w-[50vw] lg:w-[500px]"
    >
      <div className="box-border flex h-full flex-col justify-between p-8 sm:p-12 md:p-16 ">
        <div
          onMouseLeave={() => setSelectedIndicator(pathname)}
          className="mt-8 flex flex-col gap-3 text-3xl sm:mt-16 sm:text-4xl md:mt-20 md:text-5xl lg:mt-[80px] lg:text-[56px] [&_a]:font-light [&_a]:text-white [&_a]:no-underline"
        >
          <div className="mb-6 border-b border-[rgb(153,153,153)] text-[11px] uppercase text-[rgb(153,153,153)] sm:mb-8 lg:mb-10">
            <p>Navigation</p>
          </div>
          {navItems.map((data, index) => (
            <NavLink
              key={index}
              data={{ ...data, index }}
              isActive={selectedIndicator === data.href}
              setSelectedIndicator={setSelectedIndicator}
            />
          ))}
        </div>
        <NavFooter />
      </div>
      <Curve />
    </motion.div>
  );
}