import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    metadataBase: new URL(siteUrl),
    title: "Clodisnei Cavalcante Peres | Autor de O Que Restou de Mim",
    description: content.presentationIntro,
    authors: [{ name: "Clodisnei Cavalcante Peres", url: "/" }],
    creator: "Clodisnei Cavalcante Peres",
    keywords: ["O Que Restou de Mim", "Clodisnei Cavalcante Peres", "recomeço", "autoconhecimento", "superação", "hipnose", "PNL", "neurociência"],
    alternates: { canonical: "/" },
    verification: { google: "zLU-LDRVThPgoeXh7lOS7t8pKhEcAUo7ySPwOLlZHiU" },
    openGraph: {
      title: "Clodisnei Cavalcante Peres | Autor",
      description: content.presentationIntro,
      type: "website", locale: "pt_BR",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "O Que Restou de Mim, de Clodisnei Cavalcante Peres" }],
    },
    twitter: { card: "summary_large_image", title: "Clodisnei Cavalcante Peres | Autor", description: content.presentationIntro, images: ["/og.png"] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
