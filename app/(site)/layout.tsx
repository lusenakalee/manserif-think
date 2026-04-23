import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/general/Header";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { CartSheet } from "@/components/general/CartSheet";

export const metadata: Metadata = {
  title: "Manserif.Think",
  description:
    "Manserif.Think is a digital sanctuary where art and design converge. Explore a curated collection of projects that reflect a unique blend of creativity and thoughtfulness. From captivating visuals to innovative concepts, each piece invites you to experience the world through a lens of artistic expression. Join us on this journey of inspiration and discovery at Manserif.Think.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <html lang="en">
          <body className="">
            <Header />
            {children}
                    <CartSheet />
          </body>
          <Toaster position="bottom-center" />

        </html>
      </CartStoreProvider>
    </ClerkProvider>
  );
}
