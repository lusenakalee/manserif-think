"use client";

import Link from "next/link";
import { Package, ShoppingBag, User , ShoppingCart } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";

export function Header() {
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Manserif.Think
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Wait until Clerk is loaded to avoid flicker */}
           <Button asChild>
                  <Link href="/products" className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm font-medium">Shop</span>
                  </Link>
                </Button>
          {isLoaded && (
            <>
              {/* My Orders */}
              {isSignedIn && (
                <Button asChild>
                  <Link href="/orders" className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">My Orders</span>
                  </Link>
                </Button>
              )}

              

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
                <span className="sr-only">
                  Open cart ({totalItems} items)
                </span>
              </Button>

              {/* User Section */}
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
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign in</span>
                  </Button>
                </SignInButton>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}