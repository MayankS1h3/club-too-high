import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientErrorWrapper from "@/components/ClientErrorWrapper";

export const metadata: Metadata = {
  title: "Club Too High - Ultimate Nightlife Experience in Jaipur",
  description: "Experience the best nightlife in Jaipur at Club Too High. Book tickets for upcoming events, view our gallery, and join the ultimate party destination.",
  keywords: "nightclub, Jaipur, events, nightlife, party, DJ, booking, Club Too High",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="clubtheme">
      <body
        className="antialiased min-h-screen flex flex-col bg-primary text-primary"
      >
        <ClientErrorWrapper>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ClientErrorWrapper>
      </body>
    </html>
  );
}
