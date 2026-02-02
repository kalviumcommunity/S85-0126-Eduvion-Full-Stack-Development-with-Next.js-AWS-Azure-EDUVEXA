"use client";
import { useUIContext } from "../context/UIContext";

export default function ThemedBody({ children }: { children: React.ReactNode }) {
  const { theme } = useUIContext();
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {children}
    </div>
  );
}
