import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'www.btcnews.co.za - South Africa\'s Premier Bitcoin Dashboard',
  description: 'Real-time Bitcoin prices, market analysis, and comprehensive guides for South African Bitcoin investors. Track BTC/ZAR, market trends, and learn how to buy Bitcoin safely.',
  keywords: 'Bitcoin South Africa, BTC ZAR, Bitcoin price, buy Bitcoin SA, VALR, LUNO, Binance, Bitcoin exchange, cryptocurrency South Africa, Bitcoin news, Bitcoin analytics',
  authors: [{ name: 'BTCNews South Africa' }],
  creator: 'www.btcnews.co.za',
  publisher: 'BTCNews South Africa',
  robots: 'index, follow',
  openGraph: {
    title: 'www.btcnews.co.za - South Africa\'s Premier Bitcoin Dashboard',
    description: 'Real-time Bitcoin prices, market analysis, and comprehensive guides for South African Bitcoin investors.',
    url: 'https://www.btcnews.co.za',
    siteName: 'BTCNews South Africa',
    images: [
      {
        url: '/bitcoin-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitcoin South Africa Dashboard',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'www.btcnews.co.za - South Africa\'s Premier Bitcoin Dashboard',
    description: 'Real-time Bitcoin prices, market analysis, and comprehensive guides for South African Bitcoin investors.',
    images: ['/bitcoin-og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        
        {/* Structured Data for Bitcoin */}
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "BTCNews South Africa",
              "url": "https://www.btcnews.co.za",
              "description": "South Africa's premier Bitcoin dashboard and analytics platform",
              "areaServed": "South Africa",
              "serviceType": "Bitcoin Analytics and Education",
              "offers": {
                "@type": "Offer",
                "description": "Free Bitcoin price tracking and educational resources"
              }
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
