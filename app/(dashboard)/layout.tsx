import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital OB - National Police Service",
  description: "Digital Occurrence Book System for Kenya Police Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={` bg-gradient-to-br from-slate-900 text-white via-blue-900 to-slate-900  min-h-screen`}
    >
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
