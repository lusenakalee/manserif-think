import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import  Header  from "@/components/general/header-comps/Header";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { CartSheet } from "@/components/general/CartSheet";
import { SanityLive } from "@/sanity/lib/live";
import SiteNav from "@/components/landing/SiteNav";
import SiteNavbar from "@/components/general/header/SiteNavbar";





export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <div className="absolute w-full z-10">
        <div className=""> <Header /> </div>  
                   {/* <SiteNavbar/> */}
        </div>
        <main className="relative z-0 overflow-x-0 ">{children}</main>
        <CartSheet />
        <Toaster position="bottom-center" />
        <SanityLive />
      </CartStoreProvider>
    </ClerkProvider>
  );
}
