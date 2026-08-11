import { Variants } from "framer-motion";

export const slideUp: Variants = {
  initial: {
    y: "100%",
  },
  open: (i: number = 0) => ({
    y: "0%",
    transition: {
      duration: 0.5,
      delay: 0.01 * i,
    },
  }),
  closed: {
    y: "100%",
    transition: {
      duration: 0.5,
    },
  },
};

export const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};



export const menuSlide: Variants = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
};

export const slide: Variants = {
  initial: { x: 80 },
  enter: (i: number) => ({
    x: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
  exit: (i: number) => ({
    x: 80,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
  }),
};

export const scale: Variants = {
  open: { scale: 1, transition: { duration: 0.3 } },
  closed: { scale: 0, transition: { duration: 0.4 } },
};