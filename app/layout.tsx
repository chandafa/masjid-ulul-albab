import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://ulul-albaab-website.vercel.app/"
      : "http://localhost:3000"
  ),
  title: "Masjid Ulul Albaab",
  description:
    "Website resmi Masjid Ulul Albaab - Pusat kegiatan keislaman yang membina umat menuju masyarakat yang berakhlak mulia dan berilmu",
  keywords:
    "masjid, ulul albaab, DKM, islam, bandung, kajian, TPA, majelis taklim",
  authors: [{ name: "DKM Masjid Ulul Albaab" }],
  creator: "DKM Masjid Ulul Albaab",
  publisher: "DKM Masjid Ulul Albaab",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ulul Albaab",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Masjid Ulul Albaab",
    description:
      "Website resmi Masjid Ulul Albaab - Pusat kegiatan keislaman yang membina umat menuju masyarakat yang berakhlak mulia dan berilmu",
    siteName: "Masjid Ulul Albaab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Masjid Ulul Albaab - DKM Website",
    description:
      "Website resmi Masjid Ulul Albaab - Pusat kegiatan keislaman yang membina umat menuju masyarakat yang berakhlak mulia dan berilmu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ulul Albaab" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('✅ SW registered:', registration.scope);
                    })
                    .catch((error) => {
                      console.log('❌ SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
