import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components";
import { AuthProvider } from "../context/AuthContext";
import { UIProvider } from "../context/UIContext";
import ThemedBody from "./themed-body";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EDUVEXA - Work Tracker",
  description: "Professional work tracking and team management system",
};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <UIProvider>
          <ThemedBody>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemedBody>
        </UIProvider>
      </AuthProvider>
    </html>
  );
}
