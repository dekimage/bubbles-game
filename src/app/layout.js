"use client";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import ReusableLayout from "@/reusable-ui/ReusableLayout";
import { useEffect } from "react";
import MobxStore from "@/mobx";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    // Set up habit resets
    MobxStore.setupHabitResets();
    // Initial fetch of habits
    MobxStore.fetchHabits();
  }, []);

  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
