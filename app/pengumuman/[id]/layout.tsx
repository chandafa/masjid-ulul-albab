import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: announcementId } = await params;
  
  return {
    title: `Pengumuman - Masjid Ulul Albaab`,
    description: `Detail pengumuman dengan ID ${announcementId} di Masjid Ulul Albaab`,
    openGraph: {
      title: `Pengumuman - Masjid Ulul Albaab`,
      description: `Detail pengumuman dengan ID ${announcementId} di Masjid Ulul Albaab`,
      type: "website",
    },
  };
}

export default function AnnouncementDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return children;
}