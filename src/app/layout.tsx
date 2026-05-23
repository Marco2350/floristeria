import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { LoadingScreen } from "@/components/loading-screen";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Lirios · Floristería artesanal",
  description:
    "Arreglos florales únicos, ramos a medida y regalos cuidadosamente elegidos. Personaliza tu ramo flor por flor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LoadingScreen />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
