'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Core from 'smooothy'


interface SlideText {
  top: string
  bottom: string
}

interface Slide {
  id: number
  image: string
  size: 'tall' | 'wide'
  leftText: SlideText
  rightText: SlideText
}

interface SlideSize {
  h: string
  w: string
}

const slides: Slide[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', size: 'tall', leftText: { top: 'LA', bottom: '001' }, rightText: { top: 'MODERN VILLA', bottom: 'LOS ANGELES' } },
  { id: 2, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', size: 'wide', leftText: { top: 'NY', bottom: '002' }, rightText: { top: 'PENTHOUSE', bottom: 'NEW YORK' } },
  { id: 3, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', size: 'tall', leftText: { top: 'MI', bottom: '003' }, rightText: { top: 'BEACH HOUSE', bottom: 'MIAMI' } },
  { id: 4, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', size: 'wide', leftText: { top: 'SF', bottom: '004' }, rightText: { top: 'TOWNHOUSE', bottom: 'SAN FRANCISCO' } },
  { id: 5, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', size: 'tall', leftText: { top: 'AS', bottom: '005' }, rightText: { top: 'SKI CHALET', bottom: 'ASPEN' } },
  { id: 6, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', size: 'wide', leftText: { top: 'CH', bottom: '006' }, rightText: { top: 'LOFT SUITE', bottom: 'CHICAGO' } },
  { id: 7, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', size: 'tall', leftText: { top: 'AU', bottom: '007' }, rightText: { top: 'GARDEN ESTATE', bottom: 'AUSTIN' } },
  { id: 8, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', size: 'wide', leftText: { top: 'SC', bottom: '008' }, rightText: { top: 'COASTAL MANOR', bottom: 'SCOTTSDALE' } },
]

const introSlides: Slide[] = slides.slice(0, 5)

const Slider: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<InstanceType<typeof Core> | null>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const leftTextRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const introCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const currentSlideRef = useRef<number>(0)

  const updateText = (slide: Slide): void => {
    if (!leftTextRef.current || !rightTextRef.current) return

    gsap.to([leftTextRef.current, rightTextRef.current], {
      opacity: 0.4,
      duration: 0.15,
      onComplete: () => {
        const leftTop = leftTextRef.current?.querySelector('.top')
        const leftBottom = leftTextRef.current?.querySelector('.bottom')
        const rightTop = rightTextRef.current?.querySelector('.top')
        const rightBottom = rightTextRef.current?.querySelector('.bottom')

        if (leftTop) leftTop.textContent = slide.leftText.top
        if (leftBottom) leftBottom.textContent = slide.leftText.bottom
        if (rightTop) rightTop.textContent = slide.rightText.top
        if (rightBottom) rightBottom.textContent = slide.rightText.bottom

        gsap.to([leftTextRef.current, rightTextRef.current], { opacity: 1, duration: 0.15 })
      },
    })
  }

  const applyParallax = (): void => {
    const center = window.innerHeight / 2
    let closest = 0
    let minDist = Infinity

    slidesRef.current.forEach((container, i) => {
      if (!container || !imagesRef.current[i]) return

      const rect = container.getBoundingClientRect()
      const slideCenter = rect.top + rect.height / 2
      const dist = Math.abs(slideCenter - center)
      const offset = (slideCenter - center) / window.innerHeight

      gsap.set(imagesRef.current[i], {
        scale: 1.3,
        y: -offset * 100,
      })

      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })

    if (currentSlideRef.current !== closest) {
      currentSlideRef.current = closest
      updateText(slides[closest])
    }
  }

  const playIntroAnimation = (
    wrapper: HTMLDivElement,
    slider: InstanceType<typeof Core>
  ): gsap.core.Timeline => {
    const introCards = introCardsRef.current.filter((el): el is HTMLDivElement => el !== null)
    const intro = introRef.current
    if (!intro) return gsap.timeline()

    const vw = window.innerWidth
    const vh = window.innerHeight
    const cardSize = 28
    const gap = 12
    const centerX = vw / 2
    const centerY = vh / 2

    introCards.forEach((card, i) => {
      const offsetX = (i - 2) * (cardSize + gap)
      gsap.set(card, {
        position: 'fixed',
        left: centerX - cardSize / 2,
        top: centerY - cardSize / 2,
        width: cardSize,
        height: cardSize,
        x: offsetX,
        y: 0,
        zIndex: 60,
        scale: 0,
        opacity: 0,
        force3D: true,
      })
    })

    const tl = gsap.timeline({ delay: 0.4 })

    tl.to(introCards, {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: 'back.out(1.4)',
    })

    tl.to({}, { duration: 0.35 })

    const rotation = { angle: 0 }

    tl.to(rotation, {
      angle: 90,
      duration: 1.3,
      ease: 'power4.inOut',
      onUpdate: () => {
        const rad = (rotation.angle * Math.PI) / 180

        introCards.forEach((card, i) => {
          const offset = (i - 2) * (cardSize + gap)
          gsap.set(card, {
            x: Math.round(offset * Math.cos(rad)),
            y: Math.round(offset * Math.sin(rad)),
          })
        })
      },
    })

    tl.call(() => {
      const sliderSlides = slidesRef.current.filter((el): el is HTMLDivElement => el !== null).slice(0, 5)

      const targets = sliderSlides.map((el) => {
        const container = el.querySelector('div')
        const inner = container?.querySelector('div')
        return (inner || container || el).getBoundingClientRect()
      })

      const lastIdx = introCards.length - 1

      introCards.forEach((card, i) => {
        const curX = Number(gsap.getProperty(card, 'left')) + Number(gsap.getProperty(card, 'x'))
        const curY = Number(gsap.getProperty(card, 'top')) + Number(gsap.getProperty(card, 'y'))
        const curW = Number(gsap.getProperty(card, 'width'))
        const curH = Number(gsap.getProperty(card, 'height'))

        const target: DOMRect = targets[i] ?? {
          left: centerX,
          top: centerY,
          width: cardSize,
          height: cardSize,
          right: 0,
          bottom: 0,
          x: centerX,
          y: centerY,
          toJSON: () => ({}),
        }

        gsap.set(card, {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height,
          transformOrigin: '0 0',
          x: curX - target.left,
          y: curY - target.top,
          scaleX: curW / target.width,
          scaleY: curH / target.height,
        })

        gsap.to(card, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          delay: i * 0.03,
          force3D: true,
          onComplete:
            i === lastIdx
              ? () => {
                  gsap.set(intro, { display: 'none' })
                  gsap.set(wrapper, { opacity: 1 })
                  slider.paused = false
                  gsap.to([leftTextRef.current, rightTextRef.current], {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                  })
                }
              : undefined,
        })

        const img = card.querySelector('img')
        if (img) {
          const targetY = imagesRef.current[i]
            ? Number(gsap.getProperty(imagesRef.current[i]!, 'y'))
            : 0
          gsap.to(img, {
            scale: 1.3,
            y: targetY,
            duration: 1.1,
            ease: 'power3.inOut',
            delay: i * 0.03,
          })
        }
      })
    })

    return tl
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const preventSelect = (e: Event): void => e.preventDefault()
    wrapper.addEventListener('selectstart', preventSelect)
    wrapper.style.userSelect = 'none'
    ;(wrapper.style as CSSStyleDeclaration & { webkitUserSelect: string }).webkitUserSelect = 'none'
    wrapper.style.touchAction = 'pan-y'

    gsap.set(wrapper, { opacity: 0 })
    gsap.set([leftTextRef.current, rightTextRef.current], { opacity: 0 })

    const slider = new Core(wrapper, {
      vertical: true,
      infinite: true,
      variableWidth: true,
      snap: true,
      snapStrength: 0.1,
      scrollInput: true,
      lerpFactor: 0.3,
      dragSensitivity: 0.004,
      speedDecay: 1,
      scrollSensitivity: 1,
      virtualScroll: {
        mouseMultiplier: 0.35,
        touchMultiplier: 1.8,
        firefoxMultiplier: 25,
        useKeyboard: true,
        passive: true,
      },
    })

    sliderRef.current = slider
    slider.paused = true

    const update = (): void => {
      slider.update()
      applyParallax()
    }
    gsap.ticker.add(update)

    const introTl = playIntroAnimation(wrapper, slider)

    return () => {
      introTl.kill()
      wrapper.removeEventListener('selectstart', preventSelect)
      gsap.ticker.remove(update)
      slider.destroy()
    }
  }, [])

  const getSize = (size: Slide['size']): SlideSize => {
    return size === 'tall'
      ? { h: '40vh', w: '15vw' }
      : { h: '15vw', w: '25vw' }
  }

  return (
    <section className='w-full bg-[#ededed] h-screen relative overflow-clip'>
      <div ref={introRef} className='fixed inset-0 z-50 bg-[#ededed]'>
        {introSlides.map((slide, i) => (
          <div
            key={`intro-${slide.id}`}
            ref={(el) => { introCardsRef.current[i] = el }}
            className='overflow-clip'
          >
            <img src={slide.image} className='size-full scale-130 object-cover grayscale' alt='' />
          </div>
        ))}
      </div>

      <div
        ref={leftTextRef}
        className='fixed left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-start text-[1.1vw] font-mono uppercase tracking-wider text-gray-500'
      >
        <span className='top'>{slides[0].leftText.top}</span>
        <span className='bottom'>{slides[0].leftText.bottom}</span>
      </div>

      <div
        ref={rightTextRef}
        className='fixed right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-start text-[1.1vw] font-mono uppercase tracking-wider text-gray-500'
      >
        <span className='top'>{slides[0].rightText.top}</span>
        <span className='bottom'>{slides[0].rightText.bottom}</span>
      </div>

      <div ref={wrapperRef} className='flex flex-col h-screen overflow-clip cursor-grab active:cursor-grabbing'>
        {slides.map((slide, i) => {
          const { h, w } = getSize(slide.size)
          return (
            <div
              key={slide.id}
              ref={(el) => { slidesRef.current[i] = el }}
              className='w-full shrink-0 relative flex items-center justify-center'
            >
              <div className='relative overflow-clip' style={{ width: w, height: h }}>
                <img
                  ref={(el) => { imagesRef.current[i] = el }}
                  src={slide.image}
                  alt=''
                  className='size-full object-cover grayscale'
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Slider