"use client"

import { useRef } from "react"
import SplitText from "gsap/src/SplitText"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

type TextProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

const Text = ({
  children,
  className = "",
  delay = 0,
}: TextProps) => {
  const textRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const text = textRef.current
      if (!text) return

      const split = SplitText.create(text, {
        type: "words",
        mask: "words",
      })

      gsap.set(split.words, { opacity: 0, yPercent: 110 })

      gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.05,
        ease: "power2.inOut",
        duration: 1,
        delay,
      })

    },
    { dependencies: [children, delay] }
  )

  return (
    <div ref={textRef} className={`text-4xl ${className}`}>
      {children}
    </div>
  )
}

export default Text