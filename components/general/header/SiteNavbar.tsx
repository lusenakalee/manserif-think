'use client'

import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { LogIn, Package } from "lucide-react";



gsap.registerPlugin(SplitText)


interface NavLink {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'About' },
  { href: '/products', label: 'Work' },
  // { href: '/contact', label: 'Contact' },
]

const SiteNavbar = () => {

  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const pathname = usePathname()

  const refs = {
    nav: useRef<HTMLElement>(null),
    menu: useRef<HTMLDivElement>(null),
    topLine: useRef<HTMLSpanElement>(null),
    bottomLine: useRef<HTMLSpanElement>(null),
    links: useRef<(HTMLAnchorElement | null)[]>([]),
    linkRows: useRef<(HTMLDivElement | null)[]>([]),
    indicator: useRef<HTMLDivElement>(null),
    linksContainer: useRef<HTMLDivElement>(null),
    contactInfo: useRef<HTMLDivElement>(null),
    timeline: useRef<gsap.core.Timeline | null>(null),
    splits: useRef<SplitText[]>([]),
    allLines: useRef<HTMLElement[]>([]),
    indicatorRotation: useRef<number>(0),
  }

  const activeIndex = navLinks.findIndex(link => link.href === pathname)

  useEffect(() => {
    const splits: SplitText[] = []
    const lines: HTMLElement[] = []

    const splitElements: HTMLElement[] = [
      ...refs.links.current.filter((el): el is HTMLAnchorElement => Boolean(el)),
      ...Array.from(refs.contactInfo.current?.querySelectorAll('p') ?? []),
    ]

    splitElements.forEach(el => {
      const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
      splits.push(split)
      split.lines.forEach(line => {
        gsap.set(line, { y: '100%' })
        lines.push(line as HTMLElement)
      })
    })

    refs.splits.current = splits
    refs.allLines.current = lines

    return () => {
      refs.timeline.current?.kill()
      splits.forEach(split => split.revert())
    }
  }, [])

  // Wait 5 seconds before the navbar appears
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Animate the navbar in once it becomes visible
  useEffect(() => {
    if (!isVisible || !refs.nav.current) return
    gsap.fromTo(
      refs.nav.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [isVisible])

  // Track scroll position to toggle translucency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640

  const animateToLink = (index: number) => {
    const indicator = refs.indicator.current
    const container = refs.linksContainer.current

    if (!indicator || !container) return

    // Hide indicator on mobile (layout is stacked, no room for it)
    if (isMobile()) {
      gsap.set(indicator, { opacity: 0 })
      refs.linkRows.current.forEach((row, i) => {
        const anchor = row?.querySelector('a')
        if (anchor) gsap.set(anchor, { x: '0px' })
      })
      return
    }

    if (index >= 0 && refs.linkRows.current[index]) {
      const containerRect = container.getBoundingClientRect()
      const rowRect = refs.linkRows.current[index]!.getBoundingClientRect()
      const targetY = rowRect.top - containerRect.top + (rowRect.height / 2) - (indicator.offsetHeight / 2)

      refs.indicatorRotation.current += 180

      gsap.to(indicator, {
        x: 0, y: targetY,
        rotation: refs.indicatorRotation.current,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        overwrite: true,
      })
    } else {
      gsap.to(indicator, {
        x: '-2vw',
        opacity: 0,
        duration: .3,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    refs.linkRows.current.forEach((row, i) => {
      if (!row) return
      const anchor = row.querySelector('a')
      if (!anchor) return
      gsap.to(anchor, {
        x: i === index ? '2.5vw' : '0vw',
        duration: .4,
        ease: 'back.out(1.4)',
        overwrite: true,
      })
    })
  }

  useEffect(() => {
    refs.timeline.current?.kill()
    const tl = gsap.timeline()
    refs.timeline.current = tl

    const mobile = isMobile()

    if (isOpen) {
      gsap.set(refs.indicator.current, {
        x: "-2vw", opacity: 0
      })
      refs.linkRows.current.forEach(row => {
        const anchor = row?.querySelector('a')
        if (anchor) gsap.set(anchor, { x: '0vw' })
      })

      tl.to(refs.nav.current, { width: mobile ? '95vw' : '90vw', duration: .5, ease: 'power3.inOut' })
        .to(refs.topLine.current, { rotation: 45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.bottomLine.current, { rotation: -45, y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.menu.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0.3)
        .to(refs.allLines.current, { y: '0%', duration: 0.5, stagger: 0.03, ease: 'power3.out' }, 0.5)
        .call(() => animateToLink(activeIndex))
    } else {
      tl.to(refs.topLine.current, { rotation: 0, y: mobile ? '-4px' : '-0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.bottomLine.current, { rotation: 0, y: mobile ? '4px' : '0.3vw', duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(refs.menu.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0)
        .to(refs.nav.current, { width: '95vw', duration: 0.5, ease: 'power3.inOut' }, 0.3)
        .set(refs.allLines.current, { y: '100%' }, 0.5)
    }


  }, [isOpen, activeIndex])


  return (
    <>
      {/* ── Navbar bar ── */}
      <nav
        ref={refs.nav}
        style={{ opacity: isVisible ? undefined : 0, pointerEvents: isVisible ? undefined : 'none' }}
        className={`fixed top-[5%] left-1/2 -translate-x-1/2 w-[95vw] border border-white/10 rounded-md flex items-center justify-between px-4 sm:px-[2vw] py-3 sm:py-[1.5vw] z-50 transition-colors duration-300 ${isScrolled ? 'bg-zinc-800/60 backdrop-blur-md' : 'bg-zinc-800'
          }`}
      >
        {/* Logo */}
        <p className='text-white text-sm sm:text-[1.3vw] font-medium leading-tight'>
          Manserif<br />.Think
        </p>

        {/* Menu toggle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='flex px-4 sm:px-[2vw] items-center justify-center gap-4 sm:gap-[2vw] cursor-pointer'
        >
          <p className='text-white text-sm sm:text-[1.3vw] font-medium'>
            {isOpen ? 'Close' : 'Menu'}
          </p>

          {/* Hamburger lines */}
          <div className='relative w-6 h-4 sm:w-[2vw] sm:h-[1vw]'>
            <span
              ref={refs.topLine}
              className='absolute w-6 sm:w-[2vw] h-0.5 bg-white'
              style={{ top: '25%' }}
            />
            <span
              ref={refs.bottomLine}
              className='absolute w-6 sm:w-[2vw] h-0.5 bg-white'
              style={{ top: '75%' }}
            />
          </div>
        </div>

        {/* Auth */}
        {isSignedIn ? (
          <UserButton
            afterSwitchSessionUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 sm:h-9 sm:w-9"
              }
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Shop"
                labelIcon={<Package className="h-4 w-4" />}
                href="/products"
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <SignInButton mode="modal">
            <button className="text-sm sm:text-lg font-medium text-white">
              Sign in
            </button>
          </SignInButton>
        )}
      </nav>

      {/* ── Dropdown menu ── */}
      <div
        ref={refs.menu}
        className='fixed top-[calc(56px+5%)] sm:top-[calc(6vw+5%)] left-1/2 -translate-x-1/2 w-[95vw] sm:w-[90vw] bg-zinc-800 border border-white/10 rounded-md z-40 overflow-clip'
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        {/* 
          Mobile: stacked column layout
          Desktop: original side-by-side row 
        */}
        <div className='p-4 sm:p-[2.5vw] h-fit flex flex-col sm:flex-row gap-6 sm:gap-0'>

          {/* Nav links */}
          <div
            ref={refs.linksContainer}
            className='w-full sm:w-[25%] flex flex-col gap-2 sm:gap-[.5vw] border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-[2vw] relative'
            onMouseLeave={() => animateToLink(activeIndex)}
          >
            {/* Indicator diamond — hidden on mobile via opacity/pointer-events */}
            <div
              ref={refs.indicator}
              className='absolute left-0 top-0 w-4 h-4 sm:w-[1.4vw] sm:h-[1.4vw] bg-orange-500 opacity-0 pointer-events-none z-10 hidden sm:block'
              style={{ transform: 'translateX(-2vw)' }}
            />

            {navLinks.map((link, index) => (
              <div
                key={link.href}
                ref={el => { refs.linkRows.current[index] = el }}
                className='flex w-fit flex-row items-center'
                onMouseEnter={() => animateToLink(index)}
              >
                <Link
                  ref={el => { refs.links.current[index] = el }}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-4xl sm:text-[2.8vw] font-medium transition-colors ${pathname === link.href ? 'text-orange-500' : 'text-white hover:text-orange-500'}`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div
            ref={refs.contactInfo}
            className='w-full sm:w-[25%] flex flex-col gap-4 sm:gap-[1.5vw] sm:px-[2vw] text-white/70 text-sm sm:text-[1.1vw]'
          >
            <div>
              <p className='text-white/40 uppercase text-xs sm:text-[0.85vw] mb-1 sm:mb-[0.3vw]'>Contact</p>
              <p>warren@manserifthink.com</p>
            </div>

            <div>
              <p className='text-white/40 uppercase text-xs sm:text-[0.85vw] mb-1 sm:mb-[0.3vw]'>Social</p>
              <p>Instagram: @manserif.think</p>
            </div>
          </div>

          {/* Featured exhibit */}
          <div className='w-full sm:w-[50%] flex gap-[1vw] sm:pl-[2vw]'>
            <div className='flex-1 flex flex-col gap-2 sm:gap-[1vw]'>
              <a
                href="/exhibits/le-divin-a-travers-mes-yeux-the-divine-through-my-eyes"
                className='text-orange-500 hover:text-orange-300 transition-colors'
              >
                <p className='text-white/40 uppercase text-xs sm:text-[0.85vw] mb-1'>Featured Exhibit</p>
                <div className={`flex-1 rounded-md overflow-hidden border-2 border-orange-500 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-32 sm:max-h-40' : 'max-h-40 sm:max-h-none'
                  }`}>
                  <img
                    src="/images/eyes.webp"
                    alt="Feature project"
                    className='w-full h-full object-cover'
                  />
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default SiteNavbar