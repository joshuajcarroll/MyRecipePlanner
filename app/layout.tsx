// my-recipe-planner-v2/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast"; // Import Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Recipe & Meal Planner",
  description: "Plan your meals and organize your recipes efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster /> {/* Add Toaster component here */}
        </body>
      </html>
    </ClerkProvider>
  );
}