"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import gsap from "gsap";
import Magnetic from "./Magnetic";

// Default "pill" look. Passing a `className` prop replaces this entirely
// (matches the original component's behavior) — `overflow-hidden` is always
// kept regardless, since the reveal circle needs to stay clipped either way.
const DEFAULT_BUTTON_CLASSES =
  "relative flex cursor-pointer items-center justify-center rounded-[3em] border border-[rgb(136,136,136)] px-[60px] py-[15px] [&_p]:relative [&_p]:z-[1] [&_p]:transition-colors [&_p]:duration-[400ms] [&_p]:ease-linear hover:[&_p]:text-white";

interface RoundedButtonProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  backgroundColor?: string;
}

export default function RoundedButton2({
  children,
  backgroundColor = "#A1A1AA",
  className,
  ...attributes
}: RoundedButtonProps) {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });
    timeline.current
      .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
      .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit");
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeline.current?.tweenFromTo("enter", "exit");
  };

  const manageMouseLeave = () => {
    timeoutId.current = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <Magnetic>
      <div
        className={`overflow-hidden ${className ?? DEFAULT_BUTTON_CLASSES}`}
        onMouseEnter={manageMouseEnter}
        onMouseLeave={manageMouseLeave}
        {...attributes}
      >
        {children}
        <div
          ref={circle}
          style={{ backgroundColor }}
          className="absolute top-full h-[150%] w-full rounded-full"
        />
      </div>
    </Magnetic>
  );
}