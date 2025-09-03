import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const announcementId = params.id;
  
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
}: {
  children: React.ReactNode;
}) {
  return children;
}