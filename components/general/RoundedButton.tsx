"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Magnetic from "./Magnetic";

type RoundedButtonProps = {
  children: React.ReactNode;
  backgroundColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  backgroundColor = "#455CE9",
  ...attributes
}) => {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (!circle.current) return;

    timeline.current = gsap.timeline({ paused: true });

    timeline.current
      .to(
        circle.current,
        {
          top: "-25%",
          width: "150%",
          duration: 0.4,
          ease: "power3.in",
        },
        "enter"
      )
      .to(
        circle.current,
        {
          top: "-150%",
          width: "125%",
          duration: 0.25,
        },
        "exit"
      );
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current?.tweenFromTo("enter", "exit");
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <Magnetic>
      <div
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        className="relative overflow-hidden flex items-center justify-center px-6 py-3 rounded-full cursor-pointer"
        {...attributes}
      >
        {children}

        <div
          ref={circle}
          style={{ backgroundColor }}
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-[150%] rounded-full pointer-events-none"
        />
      </div>
    </Magnetic>
  );
};

export default RoundedButton;