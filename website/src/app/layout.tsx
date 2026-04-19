import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: {
    default: "OmniSign - Real-Time Sign Language Translation",
    template: "%s | OmniSign"
  },
  description: "Breaking the silence barrier with real-time, bidirectional sign language translation that connects deaf and hearing people seamlessly. Experience the future of inclusive communication.",
  keywords: [
    "sign language translation",
    "real-time translation",
    "accessibility",
    "deaf community",
    "inclusive communication",
    "gesture recognition",
    "AI translation",
    "bidirectional translation",
    "communication technology",
    "accessibility innovation"
  ],
  authors: [{ name: "OmniSign Team" }],
  creator: "OmniSign",
  publisher: "OmniSign",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://omnisign.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://omnisign.io',
    title: 'OmniSign - Real-Time Sign Language Translation',
    description: 'Breaking the silence barrier with real-time, bidirectional sign language translation that connects deaf and hearing people seamlessly.',
    siteName: 'OmniSign',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OmniSign - Real-Time Sign Language Translation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniSign - Real-Time Sign Language Translation',
    description: 'Breaking the silence barrier with real-time, bidirectional sign language translation that connects deaf and hearing people seamlessly.',
    images: ['/og-image.jpg'],
    creator: '@omnisign',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
