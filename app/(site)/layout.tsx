import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/general/Header";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { CartSheet } from "@/components/general/CartSheet";
import { SanityLive } from "@/sanity/lib/live";
import SiteNav from "@/components/landing/SiteNav";





export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <div className="relative z-10">
          {/* <Header /> */}
          <SiteNav/>
        </div>
        <main className="relative z-0 ">{children}</main>
        <CartSheet />
        <Toaster position="bottom-center" />
        <SanityLive />
      </CartStoreProvider>
    </ClerkProvider>
  );
}
