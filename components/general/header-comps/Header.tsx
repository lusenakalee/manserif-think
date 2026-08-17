"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "./nav-comps/Nav";
import Rounded from "@/components/general/RoundedButton2";
import Magnetic from "@/components/general/Magnetic";
import Link from "next/link";

// Shared custom easing curve, used throughout (replaces the SCSS cubic-bezier)
const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

const NAV_LINKS = [
  { label: "Pieces", href: "/pieces" },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "Portfolio", href: "/portfolio" },
];


export default function Header() {
  const header = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, { scale: 1, duration: 0.25, ease: "power1.out" });
        },
        onEnterBack: () => {
          gsap.to(button.current, { scale: 0, duration: 0.25, ease: "power1.out" });
          setIsActive(false);
        },
      },
    });
  }, []);

  return (
    <>
      <div
        ref={header}
        className="absolute top-0 z-[1] box-border flex w-full items-center justify-between p-4 sm:p-6 md:p-[35px] font-light text-white"
      >
        {/* Logo */}
        <div className="group/logo flex cursor-pointer">
          <p
            className={`m-0 transition-all duration-500 ${EASE} group-hover/logo:rotate-[360deg]`}
          >
            ©
          </p>
          <div
            className={`relative ml-[5px] flex overflow-hidden whitespace-nowrap transition-all duration-500 ${EASE} group-hover/logo:pr-[30px]`}
          >
            <Link href="/" className="flex">
            <p
              className={`relative m-0 transition-transform duration-500 ${EASE} group-hover/logo:-translate-x-full`}
            >
             Manserif
            </p>
            <p
              className={`relative m-0 pl-[0.3em] transition-transform duration-500 ${EASE} group-hover/logo:-translate-x-[65px]`}
            >
              .Think
            </p>
            </Link>
            <p
              className={`absolute left-[120px] m-0 pl-[0.3em] transition-transform duration-500 ${EASE} group-hover/logo:-translate-x-[65px]`}
            >
              
            </p>
          </div>
        </div>

        {/* Nav links — hidden on mobile, the burger menu handles navigation there */}
        <div className="hidden md:flex md:items-center">
          {NAV_LINKS.map(({ label, href }) => (
  <Magnetic key={label}>
    <div className="group/el relative z-[1] flex flex-col p-[15px]">
      <Link href={href} className="cursor-pointer">
        {label}
      </Link>

      <div
        className={`absolute left-1/2 top-[45px] h-[5px] w-[5px] -translate-x-1/2 scale-0 rounded-full bg-white transition-transform duration-200 ${EASE} group-hover/el:scale-100`}
      />
    </div>
  </Magnetic>
))}
        </div>
      </div>

      {/* Menu toggle button */}
      <div ref={button} className="fixed right-0 z-[4] scale-0">
        <Rounded
          onClick={() => setIsActive(!isActive)}
          className="relative m-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1C1D20] cursor-pointer sm:m-5 sm:h-20 sm:w-20"
        >
          <div
            className={`relative z-[1] w-full before:relative before:block before:top-[5px] before:h-px before:w-[40%] before:mx-auto before:bg-white before:transition-transform before:duration-300 before:content-[''] after:relative after:block after:-top-[5px] after:h-px after:w-[40%] after:mx-auto after:bg-white after:transition-transform after:duration-300 after:content-[''] ${
              isActive
                ? "before:top-0 before:-rotate-45 after:-top-px after:rotate-45"
                : ""
            }`}
          />
        </Rounded>
      </div>

      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </>
  );
}