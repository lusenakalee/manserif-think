'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    PopoverGroup,
} from '@headlessui/react'
import { LogIn, Package } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "gsap";

// ---------------------------------------------------------------------------
// Register plugins once at module scope — idempotent & SSR-safe because this
// module is only ever evaluated on the client via "use client".
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
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { isSignedIn, isLoaded } = useUser();
    const { openCart } = useCartActions();
    const totalItems = useTotalItems();
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Scroll detection ────────────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, []);

    // ── GSAP SplitText — desktop only, 5 s delay ────────────────────────────
    //
    // Scope is tied to containerRef so:
    //   • selectors resolve only within the nav container
    //   • everything is auto-reverted on unmount — no manual cleanup needed
    //
    useGSAP(
        () => {
            // Skip on mobile — the mobile menu has its own motion via Headless UI
            if (window.innerWidth < 1024) return;

            // Split each desktop nav link into masked lines
            SplitText.create("[data-split-nav] [data-split]", {
                type: "lines",
                linesClass: "split-line",
                mask: "lines",   // clips overflow so the un-revealed line is invisible
                autoSplit: true, // re-splits on resize
            });

            // Start every split-line hidden below its mask
            gsap.set("[data-split-nav] .split-line", { y: "125%" });

            // Reveal links one by one after 5 s (matches the hero intro sequence)
            gsap.to("[data-split-nav] .split-line", {
                y: "0%",
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                delay: 5,
            });
        },
        { scope: containerRef },
    );

    // ── JSX ─────────────────────────────────────────────────────────────────
    return (
        <div className="bg-white lg:bg-transparent" ref={containerRef}>

            {/* ── Mobile menu ─────────────────────────────────────────────────
                ⚠️  DO NOT TOUCH — user instruction: leave mobile menu unchanged
            ───────────────────────────────────────────────────────────────── */}
            <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />
                <div className="fixed inset-0 z-40 flex">
                    <DialogPanel
                        transition
                        className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <div className="flex px-4 pt-5 pb-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>

                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                            {navigation.pages.map((page) => (
                                <div key={page.name} className="flow-root">
                                    <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                                        {page.name}
                                    </a>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                            <div className="flow-root">
                                {isSignedIn ? (
                                    <UserButton
                                        afterSwitchSessionUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-9 w-9",
                                            },
                                        }}
                                    >
                                        <UserButton.MenuItems>
                                            <UserButton.Link
                                                label="Shop"
                                                labelIcon={<Package className="h-4 w-4" />}
                                                href="/products"
                                            />
                                        </UserButton.MenuItems>
                                        <UserButton.MenuItems>
                                            {/* <UserButton.Link
                                                label="My Orders"
                                                labelIcon={<Package className="h-4 w-4" />}
                                                href="/orders"
                                            /> */}
                                        </UserButton.MenuItems>
                                    </UserButton>
                                ) : (
                                    <SignInButton mode="modal">
                                        <button className="-m-2 block p-2 font-medium text-gray-900">
                                            Sign in
                                        </button>
                                    </SignInButton>
                                )}
                            </div>
                            {/* {isSignedIn && (
                                <div className="flow-root">
                                    <a href="/orders" className=" block p-2 font-medium text-gray-900">
                                        My Orders
                                    </a>
                                </div>
                            )} */}
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6">
                            <a href="/" className="-m-2 flex items-center p-2">
                                <img
                                    alt=""
                                    src="/images/manserif-man.svg"
                                    className="block h-auto w-5 shrink-0"
                                />
                            </a>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* ── Desktop header ────────────────────────────────────────────── */}
            <header className={[
                'relative bg-white',
                'lg: lg:top-0 lg:z-50',
                'lg:transition-all lg:duration-500 lg:ease-in-out',
                scrolled
                    ? 'lg:bg-white/75 lg:backdrop-blur-md lg:shadow-[0_1px_24px_rgba(0,0,0,0.08)]'
                    : 'lg:bg-transparent lg:shadow-none',
            ].join(' ')}>

                <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className={[
                        'transition-colors duration-500',
                        scrolled ? 'border-gray-200' : 'border-gray-200 lg:border-white/20',
                    ].join(' ')}>
                        <div className="flex h-16 items-center">

                            {/* Hamburger — mobile only */}
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon aria-hidden="true" className="size-6" />
                            </button>

                            {/* Logo */}
                            <div className="ml-4 flex lg:ml-0">
                                <a href="#">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        alt=""
                                        src="/images/manserif-man.svg"
                                        className={[
                                            'h-8 w-auto transition-all duration-500',
                                            !scrolled ? 'lg:brightness-0 lg:invert' : '',
                                        ].join(' ')}
                                    />
                                </a>
                            </div>

                            {/* ── Desktop nav links ──────────────────────────────────────
                                data-split-nav  → scopes GSAP selector to this wrapper
                                data-split      → marks each <a> for SplitText to process
                            ─────────────────────────────────────────────────────────── */}
                            <PopoverGroup className="hidden w-full flex justify-center items-center lg:flex lg:self-stretch">
                                <div data-split-nav className="flex h-full space-x-8">
                                    {navigation.pages.map((page) => (
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
                                    ))}
                                </div>
                            </PopoverGroup>

                            {/* Right-side actions */}
                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    <span
                                        aria-hidden="true"
                                        className={[
                                            'h-6 w-px transition-colors duration-500',
                                            scrolled ? 'bg-gray-200' : 'bg-gray-200 lg:bg-white/30',
                                        ].join(' ')}
                                    />

                                    {isSignedIn ? (
                                        <UserButton
                                            afterSwitchSessionUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-9 w-9",
                                                },
                                            }}
                                        >
                                            <UserButton.MenuItems>
                                                <UserButton.Link
                                                    label="Shop"
                                                    labelIcon={<Package className="h-4 w-4" />}
                                                    href="/products"
                                                />
                                            </UserButton.MenuItems>
                                            <UserButton.MenuItems>
                                                {/* <UserButton.Link
                                                    label="My Orders"
                                                    labelIcon={<Package className="h-4 w-4" />}
                                                    href="/orders"
                                                /> */}
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
                                    )}

                                    {/* <span aria-hidden="true" className="h-6 w-px bg-gray-200" /> */}
                                    {/* {isSignedIn && (
                                        <a href="/orders" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            My Orders
                                        </a>
                                    )} */}
                                </div>

                                {/* Cart */}
                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={openCart}
                                >
                                    <ShoppingBagIcon className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500" />
                                    {totalItems > 0 && (
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                            {totalItems > 99 ? "99+" : totalItems}
                                        </span>
                                    )}
                                    <span className="sr-only">
                                        Open cart ({totalItems} items)
                                    </span>
                                </Button> */}
                            </div>

                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}