import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Manserif.Think",
  description: "Manserif.Think is a digital sanctuary where art and design converge. Explore a curated collection of projects that reflect a unique blend of creativity and thoughtfulness. From captivating visuals to innovative concepts, each piece invites you to experience the world through a lens of artistic expression. Join us on this journey of inspiration and discovery at Manserif.Think.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
