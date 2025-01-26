"use client";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";

// Load the font
const customFont = localFont({
  src: "../../public/fonts/Flavors-Regular.ttf",
  variable: "--font-custom",
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${customFont.variable}`}>
      <body className={`${customFont.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
