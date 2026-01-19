import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

// Load Inter font for non-Apple devices
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default:
      "Md Ali Khan - AI/ML Engineer | Automation Specialist | Professional Portfolio",
    template: "%s | Md Ali Khan Portfolio",
  },
  description:
    "Professional portfolio of Md Ali Khan – AI/ML Engineer & Automation Specialist. Specializing in Multi-Agent Systems, Computer Vision, and intelligent automation pipelines. Open to opportunities.",
  keywords: [
    "Md Ali Khan",
    "AI Engineer",
    "Machine Learning",
    "Automation Specialist",
    "Next.js",
    "React",
    "Python",
    "TensorFlow",
    "Deep Learning",
    "Portfolio",
    "Automation",
    "Agentic AI",
  ],

  authors: [
    {
      name: "Md Ali Khan",
      url: "https://portfolio.mdalikhan.com",
    },
  ],
  creator: "Md Ali Khan",
  publisher: "Md Ali Khan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio.mdalikhan.com",
    title:
      "Md Ali Khan - AI/ML Engineer & Automation Specialist | Professional Portfolio",
    description:
      "Portfolio showcasing AI/ML solutions, Multi-Agent Systems, and intelligent automation by Md Ali Khan.",
    siteName: "Md Ali Khan Portfolio",
    images: [
      {
        url: "https://portfolio.mdalikhan.com/alipic1.png",
        width: 1200,
        height: 630,
        alt: "Md Ali Khan - Professional Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Ali Khan - AI/ML Engineer & Automation Specialist",
    description:
      "Portfolio showcasing AI/ML solutions and intelligent automation. Bridging the gap between Deep Learning and automation.",

    creator: "@_allie_11",
    site: "@_allie_11",
    images: [
      {
        url: "https://portfolio.mdalikhan.com/alipic1.png",
        alt: "Md Ali Khan Professional Portfolio",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://portfolio.mdalikhan.com",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col relative">
            <div className="absolute top-4 right-4  z-9999">
              <ThemeToggle />
            </div>

            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
