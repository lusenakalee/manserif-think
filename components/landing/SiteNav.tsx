'use client'

import { Fragment, useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import Link from "next/link";
import { Package, ShoppingBag, User, ShoppingCart } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = {

    pages: [
                { name: 'Home', href: '/' },

        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Store', href: '/products' },
    ],
}

export default function SiteNav() {
    const [open, setOpen] = useState(false)
    const { isSignedIn, isLoaded } = useUser();
    const { openCart } = useCartActions();
    const totalItems = useTotalItems();


    return (
        <div className="bg-white">
            {/* Mobile menu */}
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
                                            <UserButton.Link
                                                label="My Orders"
                                                labelIcon={<Package className="h-4 w-4" />}
                                                href="/orders"
                                            />
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
                            {isSignedIn && (
                                <div className="flow-root">
                                    <a href="/orders" className="-m-2 block p-2 font-medium text-gray-900">
                                        My Orders
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6">
                            <a href="#" className="-m-2 flex items-center p-2">
                                <img
                                    alt=""
                                    src="/images/manserif-man.svg"
                                    className="block h-auto w-5 shrink-0"
                                />
                                <span className="ml-3 block text-base font-medium text-gray-900">CAD</span>
                                <span className="sr-only">, change currency</span>
                            </a>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <header className="relative bg-white">


                <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center">
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
                                        className="h-8 w-auto"
                                    />
                                </a>
                            </div>

                            {/* Flyout menus */}
                            <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                                <div className="flex h-full space-x-8">

                                    {navigation.pages.map((page) => (
                                        <a
                                            key={page.name}
                                            href={page.href}
                                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            {page.name}
                                        </a>
                                    ))}
                                </div>
                            </PopoverGroup>

                            <div className="ml-auto flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
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
                                                <UserButton.Link
                                                    label="My Orders"
                                                    labelIcon={<Package className="h-4 w-4" />}
                                                    href="/orders"
                                                />
                                            </UserButton.MenuItems>
                                        </UserButton>
                                    ) : (
                                        <SignInButton mode="modal">
                                            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                                Sign in
                                            </a>
                                        </SignInButton>
                                    )}

                                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                                    {isSignedIn && (

                                        <a href="/orders" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                                            My Orders
                                        </a>
                                    )}
                                </div>


                                {/* Search */}
                                <div className="flex lg:ml-6">
                                    <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Search</span>
                                        <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                                    </a>
                                </div>

                                {/* Cart */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={openCart}
                                >
                                    <ShoppingBagIcon className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                                    />
                                    {totalItems > 0 && (
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                            {totalItems > 99 ? "99+" : totalItems}
                                        </span>
                                    )}
                                    <span className="sr-only">
                                        Open cart ({totalItems} items)
                                    </span>
                                </Button>

                               
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}
