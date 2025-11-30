import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Météoland",
  description: "Best Meteo app",
};
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${interSans.variable} ${interTight.variable} m-2 tablet:mx-8 tablet:my-7.5`} >
        <Header />
        <main className="tablet:mb-10 lg:mb-23">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
