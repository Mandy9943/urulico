import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

// Metadatos para SEO
export const metadata = {
  metadataBase: new URL("https://urulico.com"),
  title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
  description:
    "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
  keywords: [
    "Uruguay",
    "anuncios",
    "servicios",
    "publicidad",
    "plataforma digital",
    "clasificados Uruguay",
    "servicios profesionales",
    "anuncios gratis",
  ],

  alternates: {
    canonical: "https://urulico.com",
    languages: {
      "es-UY": "https://urulico.com",
    },
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

  // Configuración de íconos
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/logo-196.png",
    apple: [{ url: "/logo-180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "apple-touch-icon-precomposed", url: "/logo-180.png" }],
  },

  // Configuración de manifest para PWA
  manifest: "/manifest.json",

  // Open Graph mejorado con imágenes
  openGraph: {
    title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
    description:
      "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
    url: "https://urulico.com/",
    siteName: "Urulico",
    locale: "es_UY",
    type: "website",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "Logo de Urulico",
      },
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Vista previa de Urulico",
      },
    ],
  },

  // Twitter Cards mejorado
  twitter: {
    card: "summary_large_image",
    title: "Urulico - Plataforma de anuncios y servicios en Uruguay",
    description:
      "La plataforma líder en Uruguay para anuncios y servicios. Publica y encuentra lo que necesitas de manera rápida y sencilla.",
    images: ["/preview.png"],
    creator: "@urulico",
  },

  // Configuración de la aplicación web
  applicationName: "Urulico",
  appleWebApp: {
    capable: true,
    title: "Urulico",
    statusBarStyle: "default",
    startupImage: ["/logo-512.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Urulico",
              url: "https://urulico.com",
              logo: "https://urulico.com/logo-512.png",
              sameAs: ["https://twitter.com/urulico"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${syne.variable} min-h-screen bg-black antialiased`}
      >
        {children}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="BoJdAT2tVXWTBQhUBARptQ"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
