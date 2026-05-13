"use client"

import { useRef } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import PinCard from "./PinCard"
import Text from "./Text"
import Link from "next/link"


const COPY = {
  titleLight:
    "text-xl! font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl!",
  bodyLight:
    "mt-auto text-sm! font-serif font-normal text-zinc-200 drop-shadow-sm sm:text-xl!",
  titleStone:
    "text-xl! font-semibold tracking-tight text-stone-100 drop-shadow-md sm:text-3xl!",
  bodyStone:
    "mt-auto text-sm! font-serif font-normal text-stone-200 drop-shadow-sm sm:text-xl!",
} as const

const PinSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const row = rowRef.current
      if (!section || !row) return

      const cards = row.querySelectorAll<HTMLElement>("[data-card-shell]")
      const flippers = row.querySelectorAll<HTMLElement>("[data-flip-inner]")


      const radius = 16
      const stripRadii = [
        `${radius}px 0 0 ${radius}px`,
        "0",
        `0 ${radius}px ${radius}px 0`,
      ]

      cards.forEach((card, i) => {
        const faces = card.querySelectorAll("[data-card-face]")
        gsap.set(faces, { borderRadius: stripRadii[i] })
      })

      flippers.forEach((f) => {
        gsap.set(f, { rotationY: 0, transformStyle: "preserve-3d" })
      })


      const flipParams = [
        {
          rotateZ: -6,
          moveY: 20,
          moveX: 70
        },
        {
          rotateZ: 0,
          moveY: -18,
          moveX: 0
        },
        {
          rotateZ: 6,
          moveY: 20,
          moveX: -70
        }
      ]

      const flipTl = gsap.timeline({ paused: true })


      flippers.forEach((flipper, i) => {
        flipTl.to(
          flipper,
          {
            rotationY: 180,
            rotationZ: flipParams[i].rotateZ,
            y: flipParams[i].moveY,
            x: flipParams[i].moveX,
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
            duration: 0.8,
            ease: "power2.inOut",
            force3D: true,
          },
          0
        )
      })

      flippers.forEach((flipper) => {
        const front = flipper.querySelector("[data-card-face='front']")
        const back = flipper.querySelector("[data-card-face='back']")
        gsap.set(back, { visibility: "hidden" })

        flipTl.set(front, { visibility: "hidden" }, 0.4)
        flipTl.set(back, { visibility: "visible" }, 0.4)
      })



      let flipped = false

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress > 0.5 && !flipped) {
              flipped = true
              flipTl.play()
            } else if (self.progress <= 0.5 && flipped) {
              flipped = false
              flipTl.reverse()
            }
          },
        },
      })


      tl.to(row, { scale: 0.76, duration: 1, ease: "none" }, 0)


      tl.to(row, { gap: "5rem", duration: 1, ease: "none" }, 1)

      cards.forEach((card) => {
        const faces = card.querySelectorAll("[data-card-face]")
        tl.to(
          faces,
          { borderRadius: `${radius}px`, duration: 1, ease: "none" },
          1
        )
      })


      tl.to({}, { duration: 2 }, 2)
    },
    { scope: sectionRef }
  )

  return (
    <div
      ref={sectionRef}
      className="relative z-20 flex min-h-screen w-full items-center justify-center overflow-visible px-4  sm:px-8 md:px-12 lg:px-20 "
    >
      <div
        ref={rowRef}
        className="flex  flex-nowrap  items-center justify-center gap-0 overflow-visible will-change-transform"
      >
        <PinCard
          src="/images/bg1.svg"
          alt="Scroll-driven motion"
          backfaceClassName="bg-zinc-800 "
        >
          <Text className="mt-auto mb-6 text-5xl! opacity-50"> (01) </Text>
          <Link href="/home">
          <Text className={COPY.titleLight}>
            Scroll-told motion with a deliberate finish
          </Text>
          </Link>
          <Text className={COPY.bodyLight}>
            Pin sections, choreograph reveals, and let the page breathe as
            people move through it.
          </Text>
        </PinCard>

        <PinCard
          src="/images/bg2.svg"
          alt="Crisp imagery and texture"
          backfaceClassName="bg-green-800"
        >
          <Text className="mt-auto mb-6 text-5xl! opacity-50"> (02) </Text>
          <Text className={COPY.titleLight}>
            Textures that breathe when everything slows down
          </Text>
          <Text className={COPY.bodyLight}>
            Rich backgrounds and contrast keep the layout from feeling flat when
            things sit still.
          </Text>
        </PinCard>

        <PinCard
          src="/images/bg3.svg"
          alt="Room to experiment"
          backfaceClassName="bg-zinc-950"
        >
          <Text className="mt-auto mb-6 text-5xl! opacity-50"> (03) </Text>
          <Text className={COPY.titleStone}>
            Room to experiment and space to play
          </Text>
          <Text className={COPY.bodyStone}>
            Treat the viewport like a stage—swap panels, tune timing, and see
            what sticks.
          </Text>
        </PinCard>
      </div>
    </div>
  )
}

export default PinSection