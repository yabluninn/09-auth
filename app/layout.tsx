import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NoteHub",
  description:
    "NoteHub — простий та ефективний застосунок для створення та керування нотатками.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub — простий та ефективний застосунок для створення та керування нотатками.",
    url: SITE_URL,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    siteName: "NoteHub",
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className}`}>
        <TanStackProvider>
          <Header />
          <AuthProvider>
            <main>{children}</main>
            {modal}
          </AuthProvider>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
