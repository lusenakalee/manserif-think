"use client";

import React, { useEffect, useRef, type ReactElement } from "react";
import gsap from "gsap";

interface MagneticProps {
  // The child must be a single DOM element (or a component that forwards
  // its ref to one) since we attach a ref + mouse listeners directly to it.
  children: ReactElement<any>;
}

export default function Magnetic({ children }: MagneticProps) {
  const magnetic = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = magnetic.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref: magnetic });
}