import type { Metadata } from "next";
import { Inter, Lexend, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "Advocate Pro - Legal Practice Management",
  description:
    "Premium legal practice management platform for law firms and advocates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
