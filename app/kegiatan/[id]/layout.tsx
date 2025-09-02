import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: activityId } = await params;
  
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return children;
}