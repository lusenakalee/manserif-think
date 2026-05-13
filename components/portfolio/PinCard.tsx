"use client"

import Image from "next/image"
import type { ReactNode } from "react"

type CardProps = {
  src: string
  alt: string
  children?: ReactNode
  backfaceClassName?: string
}

const PinCard = ({ src, alt, children, backfaceClassName = "" }: CardProps) => {
  return (
    <div
      data-card-shell
      className="relative z-0 aspect-2/3 min-w-0 w-[clamp(220px,32vw,400px)] flex-1 overflow-visible bg-transparent perspective-[1000px]"
    >
      <div
        data-flip-inner
        className="relative h-full w-full rounded-2xl transform-3d will-change-transform"
      >
        <div
          data-card-face="front"
          className="absolute inset-0 overflow-hidden backface-hidden  transform-[translateZ(4px)]"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 32vw, (max-width: 1024px) 34vw, 400px"
            className="object-cover"
          />
        </div>

        <div
          data-card-face="back"
          className={`absolute inset-0 flex flex-col justify-center overflow-hidden border border-white/15 py-10 px-8 backface-hidden transform-[rotateY(180deg)_translateZ(4px)] ${backfaceClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default PinCard