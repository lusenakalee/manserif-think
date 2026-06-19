'use client'

import { useEffect, useRef, useState } from 'react'
import {
    PopoverGroup,
} from '@headlessui/react'
import { LogIn, Package } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "gsap";


// ---------------------------------------------------------------------------
// Register plugins once at module scope
// ---------------------------------------------------------------------------
gsap.registerPlugin(useGSAP, SplitText);


const navigation = {
    pages: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/portfolio' },
        { name: 'Works', href: '/products' },
    ],
}


export default function SiteNav() {

    const [scrolled, setScrolled] = useState(false)

    const { isSignedIn } = useUser();
    const { openCart } = useCartActions();
    const totalItems = useTotalItems();

    const containerRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);



    // Scroll detection
    useEffect(() => {

        const handleScroll = () => {
            setScrolled(window.scrollY > 24)
        }

        window.addEventListener(
            'scroll',
            handleScroll,
            { passive: true }
        )

        return () =>
            window.removeEventListener(
                'scroll',
                handleScroll
            )

    }, [])



    // Desktop SplitText
    useGSAP(
        () => {

            if (window.innerWidth < 1024) return;


            SplitText.create(
                "[data-split-nav] [data-split]",
                {
                    type: "lines",
                    linesClass: "split-line",
                    mask: "lines",
                    autoSplit: true,
                }
            );


            gsap.set(
                "[data-split-nav] .split-line",
                {
                    y: "125%"
                }
            );


            gsap.to(
                "[data-split-nav] .split-line",
                {
                    y: "0%",
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 5,
                }
            )

        },
        {
            scope: containerRef
        }
    )




    // Mobile SplitText
    useGSAP(
        () => {

            if (window.innerWidth >= 1024) return;


            SplitText.create(
                "[data-mobile-split]",
                {
                    type: "lines",
                    linesClass: "split-line",
                    mask: "lines",
                    autoSplit: true,
                }
            )


            gsap.set(
                "[data-mobile-split] .split-line",
                {
                    y: "125%"
                }
            )


            gsap.to(
                "[data-mobile-split] .split-line",
                {
                    y: "0%",
                    duration: 1,
                    stagger: 0.08,
                    ease: "power3.out",
                    delay: 0.5
                }
            )


        },
        {
            scope: mobileMenuRef
        }
    )



    return (

        <div
            ref={containerRef}
            className=" lg:bg-transparent"
        >
            {/* ================= MOBILE ONLY ================= */}

            <div
                ref={mobileMenuRef}
                className="flex items-center justify-between  px-5 py-5 lg:hidden z-10 absolute text-white w-full"
            >


                {/* LEFT LOGO AREA */}

                <div className="flex items-center gap-3 ">


                    <a href="/">
                        <img
                            src="/images/manserif-man.svg"
                            alt=""
                            className="h-12 w-auto"
                        />
                    </a>




                </div>

                {/* RIGHT MENU */}

                <div
                    data-mobile-split
                    className="flex flex-col items-end gap-4 "
                >
                    {navigation.pages.map(
                        (page) => (
                            <a
                                key={page.name}
                                href={page.href}
                                className="text-lg font-medium "
                            >
                                {page.name}
                            </a>
                        )
                    )}
                    {
                        isSignedIn ? (
                            <UserButton
                                afterSwitchSessionUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9"
                                    }
                                }}
                            >
                                <UserButton.MenuItems>
                                    <UserButton.Link
                                        label="Shop"
                                        labelIcon={
                                            <Package className="h-4 w-4" />
                                        }
                                        href="/products"
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <SignInButton mode="modal">
                                <button className="text-lg font-medium ">
                                    Sign in
                                </button>
                            </SignInButton>
                        )
                    }
                </div>
            </div>
            {/* ================= DESKTOP ================= */}
            <header
                className={[
                    'relative ',
                    'lg:top-0 lg:z-50',
                    'lg:transition-all lg:duration-500 lg:ease-in-out',

                    scrolled
                        ? 'lg:bg-white/75 lg:backdrop-blur-md lg:shadow-[0_1px_24px_rgba(0,0,0,0.08)]'
                        : 'lg:bg-transparent lg:shadow-none',

                ].join(' ')}
            >
                <nav
                    aria-label="Top"
                    className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                >
                    <div
                        className={[
                            'transition-colors duration-500',
                            scrolled
                                ? 'border-gray-200'
                                : 'border-gray-200 lg:border-white/20',
                        ].join(' ')}
                    >
                        <div className="flex h-16 items-center">
                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0 bg-black">
                                <a href="/">
                                    <span className="sr-only">
                                       Manserif
                                    </span>


                                    <img
                                        alt=""
                                        src="/images/manserif-man.svg"
                                        className={[
                                            'h-8 w-auto transition-all duration-500',

                                            !scrolled
                                                ? 'lg:brightness-0 lg:invert'
                                                : '',

                                        ].join(' ')}
                                    />
                                    <div className="flex flex-col">
                                        <p
                                            data-mobile-split
                                            className="text-sm font-semibold leading-none"
                                        >
                                            manserif.
                                        </p>
                                        <p
                                            data-mobile-split
                                            className="mt-1 max-w-[160px] text-xs leading-tight "
                                        >
                                            Think
                                        </p>
                                    </div>


                                </a>
                            </div>
                            {/* Desktop nav */}

                            <PopoverGroup
                                className="
                                hidden 
                                w-full 
                                justify-center 
                                items-center 
                                lg:flex 
                                lg:self-stretch
                                "
                            >
                                <div
                                    data-split-nav
                                    className="
                                    flex 
                                    h-full 
                                    space-x-8
                                    "
                                >
                                    {
                                        navigation.pages.map(
                                            (page) => (
                                                <a

                                                    key={page.name}

                                                    href={page.href}

                                                    data-split

                                                    className={[
                                                        'flex items-center text-sm font-medium transition-colors duration-500',

                                                        scrolled
                                                            ? 'text-gray-700 hover:text-gray-900'
                                                            : 'text-gray-700 hover:text-gray-800 lg:text-white/90 lg:hover:text-white',

                                                    ].join(' ')}

                                                >

                                                    {page.name}

                                                </a>
                                            )
                                        )
                                    }


                                </div>


                            </PopoverGroup>







                            {/* Right side actions */}

                            <div className="ml-auto flex items-center">



                                <div
                                    className="
                                    hidden
                                    lg:flex
                                    lg:flex-1
                                    lg:items-center
                                    lg:justify-end
                                    lg:space-x-6
                                    "
                                >



                                    <span
                                        aria-hidden="true"

                                        className={[
                                            'h-6 w-px transition-colors duration-500',

                                            scrolled
                                                ? 'bg-gray-200'
                                                : 'bg-gray-200 lg:bg-white/30',

                                        ].join(' ')}

                                    />




                                    {
                                        isSignedIn ? (

                                            <UserButton
                                                afterSwitchSessionUrl="/"

                                                appearance={{
                                                    elements: {
                                                        avatarBox: "h-9 w-9"
                                                    }
                                                }}
                                            >
                                                <UserButton.MenuItems>
                                                    <UserButton.Link

                                                        label="Shop"

                                                        labelIcon={
                                                            <Package className="h-4 w-4" />
                                                        }

                                                        href="/products"

                                                    />


                                                </UserButton.MenuItems>


                                            </UserButton>


                                        ) : (


                                            <SignInButton mode="modal">

                                                <a

                                                    href="#"

                                                    className={[
                                                        'text-sm font-medium transition-colors duration-500',

                                                        scrolled
                                                            ? 'text-gray-700 hover:text-gray-900'
                                                            : 'text-gray-700 hover:text-gray-800 lg:text-white/90 lg:hover:text-white',

                                                    ].join(' ')}

                                                >


                                                    <LogIn />


                                                </a>


                                            </SignInButton>


                                        )
                                    }



                                </div>


                            </div>




                        </div>


                    </div>


                </nav>


            </header>


        </div>

    )

}