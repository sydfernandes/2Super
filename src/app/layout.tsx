import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/global/cookie-consent";
import { ThemeProvider } from "@/components/global/theme-provider";
import { Toaster } from "sonner";
import { PostHogScript } from "@/services";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Super Lista",
  description: "Tu gestor de listas de compras",
  other: {
    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <PostHogScript />
      </head>
      <body className={`min-h-screen font-sans antialiased ${inter.variable} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
          {children}
          <CookieConsent />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
} 