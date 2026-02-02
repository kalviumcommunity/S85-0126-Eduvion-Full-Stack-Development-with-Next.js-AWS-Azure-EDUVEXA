import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { UIProvider } from "../context/UIContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import AppLayoutWithSidebar from "@/components/layout/AppLayoutWithSidebar";

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
          <ThemeProvider>
            <AuthProvider>
              <UIProvider>
                <ToastProvider>
                  <AppLayoutWithSidebar>
                    {children}
                  </AppLayoutWithSidebar>
                </ToastProvider>
              </UIProvider>
            </AuthProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
