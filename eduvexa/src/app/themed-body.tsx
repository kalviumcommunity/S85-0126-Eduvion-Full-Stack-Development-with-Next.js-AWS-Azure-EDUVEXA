"use client";
import { useUIContext } from "../context/UIContext";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useUIContext();
  return (
    <body className={theme === "dark" ? `${inter.className} dark` : inter.className}>
      {children}
    </body>
  );
}
