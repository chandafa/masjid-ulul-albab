import type { Metadata } from "next";

// Pakai tipe resmi dari Next.js
type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articleId = params.id;

  return {
    title: `Artikel - Masjid Ulul Albaab`,
    description: `Artikel dengan ID ${articleId} di Masjid Ulul Albaab`,
    openGraph: {
      title: `Artikel - Masjid Ulul Albaab`,
      description: `Artikel dengan ID ${articleId} di Masjid Ulul Albaab`,
      type: "article",
    },
  };
}

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
