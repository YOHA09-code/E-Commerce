import type { Metadata } from "next";
import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-noto-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EthioShop - Ethiopian E-Commerce Platform",
  description:
    "Ethiopia's premier e-commerce platform, connecting customers with local vendors and international products. Shop in Amharic and English with local payment methods.",
  keywords: [
    "e-commerce",
    "Ethiopia",
    "shopping",
    "online store",
    "Amharic",
    "ETB",
    "Chapa",
  ],
  authors: [{ name: "EthioShop Team" }],
  creator: "EthioShop",
  publisher: "EthioShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "EthioShop - Ethiopian E-Commerce Platform",
    description:
      "Ethiopia's premier e-commerce platform, connecting customers with local vendors and international products.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "EthioShop",
    locale: "en_ET",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EthioShop - Ethiopian E-Commerce Platform",
    description:
      "Ethiopia's premier e-commerce platform, connecting customers with local vendors and international products.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EthioShop",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoEthiopic.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
