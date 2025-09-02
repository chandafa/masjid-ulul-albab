import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const activityId = params.id;
  
  return {
    title: `Detail Kegiatan - Masjid Ulul Albaab`,
    description: `Detail kegiatan dengan ID ${activityId} di Masjid Ulul Albaab`,
    openGraph: {
      title: `Detail Kegiatan - Masjid Ulul Albaab`,
      description: `Detail kegiatan dengan ID ${activityId} di Masjid Ulul Albaab`,
      type: "website",
    },
  };
}

export default function ActivityDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}