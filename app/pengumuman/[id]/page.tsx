"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faUser,
  faTools,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faShare,
  faCopy,
  faBullhorn,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AnnouncementDetailData, googleSheetsService } from "@/lib/googleSheets";
import Link from "next/link";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const [announcement, setAnnouncement] = useState<AnnouncementDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const announcementId = params.id as string;

  useEffect(() => {
    fetchAnnouncementDetail();
  }, [announcementId]);

  const fetchAnnouncementDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const foundAnnouncement = await googleSheetsService.getAnnouncementDetailById(announcementId);

      if (foundAnnouncement) {
        setAnnouncement(foundAnnouncement);
      } else {
        setError(`Pengumuman dengan ID ${announcementId} tidak ditemukan.`);
      }
    } catch (err) {
      console.error("Error fetching announcement detail:", err);
      setError("Gagal memuat pengumuman. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (datetimeStr: string): string => {
    try {
      // Handle DD/MM/YYYY HH:mm format
      if (datetimeStr.includes("/") && datetimeStr.includes(":")) {
        const [datePart, timePart] = datetimeStr.split(" ");
        if (datePart && timePart) {
          const [day, month, year] = datePart.split("/");
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const formattedDate = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return `${formattedDate} ${timePart}`;
        }
      }
      
      // Try to parse as regular date
      const date = new Date(datetimeStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return datetimeStr;
    } catch {
      return datetimeStr;
    }
  };

  const copyToClipboard = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareAnnouncement = async () => {
    if (navigator.share && announcement) {
      try {
        await navigator.share({
          title: announcement.title,
          text: `📰 ${announcement.title} - ${announcement.description}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          console.warn("Web Share API not allowed, falling back to clipboard:", err);
        } else {
          console.error("Error sharing:", err);
        }
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-4xl mb-4 text-green-600"
          />
          <p className="text-gray-600 text-lg">Memuat pengumuman...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Pengumuman tidak ditemukan"}
          </h1>
          <p className="text-gray-600 mb-6">
            Pengumuman yang Anda cari mungkin sudah tidak tersedia atau ID tidak valid.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition inline-block"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Beranda
            </Link>
            <button
              onClick={fetchAnnouncementDetail}
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if announcement is inactive
  if (!announcement.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pengumuman Tidak Berlaku
          </h1>
          <p className="text-gray-600 mb-6">
            Pengumuman ini sudah tidak berlaku dan tidak dapat diakses.
          </p>
          <Link
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition inline-block"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Kembali ke Beranda</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareAnnouncement}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                Bagikan
              </button>
              
              {copySuccess && (
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  Link disalin!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Announcement Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faBullhorn} className="text-3xl mr-4" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    📰 {announcement.title}
                  </h1>
                  <p className="text-green-100 mt-2">
                    ID: {announcement.id}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex justify-end">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  announcement.isActive 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                }`}>
                  <FontAwesomeIcon 
                    icon={announcement.isActive ? faCheckCircle : faTimesCircle} 
                    className="mr-1" 
                  />
                  {announcement.isActive ? "🟢 Aktif" : "🔴 Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Announcement Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 mr-2" />
              📖 Detail Pengumuman
            </h2>
            
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">📖 Deskripsi:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {announcement.description}
                </p>
              </div>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faUser} className="text-green-600 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-800">👤 Pengisi Acara / Pemateri:</h4>
                      <p className="text-gray-700">{announcement.speaker}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faTools} className="text-green-600 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-800">🛠️ Petugas yang bertugas:</h4>
                      <p className="text-gray-700">{announcement.staff}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-800">📅 Waktu:</h4>
                      <p className="text-gray-700">{formatDateTime(announcement.datetime)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-800">📍 Tempat:</h4>
                      <p className="text-gray-700">{announcement.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faUsers} className="text-green-600 text-xl mr-3 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-800">👥 Peserta:</h4>
                      <p className="text-gray-700">{announcement.participants}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              📋 Ringkasan Pengumuman
            </h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="space-y-3 text-gray-800">
                <p><strong>📰 Judul:</strong> {announcement.title}</p>
                <p><strong>📖 Deskripsi:</strong> {announcement.description}</p>
                <p><strong>👤 Pemateri:</strong> {announcement.speaker}</p>
                <p><strong>🛠️ Petugas:</strong> {announcement.staff}</p>
                <p><strong>📅 Waktu:</strong> {formatDateTime(announcement.datetime)}</p>
                <p><strong>📍 Tempat:</strong> {announcement.location}</p>
                <p><strong>👥 Peserta:</strong> {announcement.participants}</p>
                <p className="flex items-center">
                  <strong className="mr-2">🟢 Status:</strong>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    announcement.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    {announcement.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Aksi
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={shareAnnouncement}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                Bagikan Pengumuman
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faCopy} className="mr-2" />
                Salin Link
              </button>
              
              <Link
                href="/#contact"
                className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Tanya Admin
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}