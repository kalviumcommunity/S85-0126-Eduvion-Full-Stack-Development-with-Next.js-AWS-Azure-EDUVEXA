import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components";
import { AuthProvider } from "../context/AuthContext";
import { UIProvider } from "../context/UIContext";
import ThemedBody from "./themed-body";
import ToastProvider from "@/components/ui/ToastProvider";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";

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
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <AuthProvider>
            <UIProvider>
              <ThemedBody>
                <LayoutWrapper>{children}</LayoutWrapper>
                <ToastProvider />
              </ThemedBody>
            </UIProvider>
          </AuthProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
