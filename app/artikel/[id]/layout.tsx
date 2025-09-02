import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id: articleId } = await params;

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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return children;
}
