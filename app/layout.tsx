import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "www.btcnews.co.za - Bitcoin Price Dashboard",
  description: "Real-time Bitcoin price tracking with ZAR conversion and market data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
