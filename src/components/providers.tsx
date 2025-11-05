"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "@/lib/i18n"; // Initialize i18n

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
    </SessionProvider>
  );
}
