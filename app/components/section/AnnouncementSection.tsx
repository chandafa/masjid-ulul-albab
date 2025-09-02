"use client";
// components/sections/AnnouncementSection.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AnnouncementData } from "@/lib/googleSheets";

interface AnnouncementSectionProps {
  announcements: AnnouncementData[];
  loading: boolean;
}

export default function AnnouncementSection({
  announcements,
  loading,
}: AnnouncementSectionProps) {
  return (
    <section className="bg-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-2xl mr-4 text-gray-400"
            />
            <p className="text-gray-600">Memuat pengumuman...</p>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`flex items-center justify-between bg-white p-4 rounded-lg shadow ${
                  announcement.category === "urgent"
                    ? "border-l-4 border-red-500"
                    : announcement.category === "event"
                    ? "border-l-4 border-green-500"
                    : "border-l-4 border-blue-500"
                }`}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faBullhorn}
                    className={`text-2xl mr-4 ${
                      announcement.category === "urgent"
                        ? "text-red-500"
                        : announcement.category === "event"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{announcement.title}</h3>
                    <p className="text-gray-600">{announcement.content}</p>
                  </div>
                </div>
                {announcement.buttonText && announcement.buttonLink && (
                  <a
                    href={announcement.buttonLink}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    {announcement.buttonText}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600">Tidak ada pengumuman saat ini</p>
          </div>
        )}
      </div>
    </section>
  );
}
