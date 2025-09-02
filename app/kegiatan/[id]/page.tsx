"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faChalkboardTeacher,
  faTag,
  faInfoCircle,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faImage,
  faShare,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { ActivityData, googleSheetsService } from "@/lib/googleSheets";
import Image from "next/image";
import Link from "next/link";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const activityId = params.id as string;

  useEffect(() => {
    fetchActivityDetail();
  }, [activityId]);

  const fetchActivityDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all activities and find the one with matching ID
      const activities = await googleSheetsService.getActivities();
      const foundActivity = activities.find(
        (activity) => activity.id === activityId
      );

      if (foundActivity) {
        setActivity(foundActivity);
      } else {
        setError("Kegiatan tidak ditemukan.");
      }
    } catch (err) {
      console.error("Error fetching activity detail:", err);
      setError("Gagal memuat detail kegiatan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (schedule: string): string => {
    try {
      // Handle various date formats
      if (schedule.includes("/")) {
        // Already in DD/MM/YYYY format
        return schedule;
      }
      
      // Try to parse and format
      const date = new Date(schedule);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return schedule; // Return as-is if can't parse
    } catch {
      return schedule;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "rutin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "khusus":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "jadwal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "rutin":
        return "Kegiatan Rutin";
      case "khusus":
        return "Kegiatan Khusus";
      case "jadwal":
        return "Jadwal Kegiatan";
      default:
        return category;
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

  const shareActivity = async () => {
    if (navigator.share && activity) {
      try {
        await navigator.share({
          title: activity.title,
          text: activity.description,
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
          <p className="text-gray-600 text-lg">Memuat detail kegiatan...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Kegiatan tidak ditemukan"}
          </h1>
          <p className="text-gray-600 mb-6">
            Kegiatan yang Anda cari mungkin sudah tidak tersedia atau ID tidak valid.
          </p>
          <div className="space-y-3">
            <Link
              href="/#activities"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition inline-block"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Daftar Kegiatan
            </Link>
            <button
              onClick={fetchActivityDetail}
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
            >
              Coba Lagi
            </button>
          </div>
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
              href="/#activities"
              className="flex items-center text-gray-600 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Kembali ke Kegiatan</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareActivity}
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
          {/* Activity Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Hero Image */}
            {activity.imageUrl && (
              <div className="relative h-64 md:h-80 bg-gray-100">
                <Image
                  src={activity.imageUrl}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div class="text-gray-400 text-center">
                            <div class="text-4xl mb-2">📷</div>
                            <div class="text-sm">Gambar tidak tersedia</div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(activity.category)}`}>
                    <FontAwesomeIcon icon={faTag} className="mr-1" />
                    {getCategoryLabel(activity.category)}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    activity.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    <FontAwesomeIcon 
                      icon={activity.isActive ? faCheckCircle : faTimesCircle} 
                      className="mr-1" 
                    />
                    {activity.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                📌 {activity.title}
              </h1>

              {/* Quick Info Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Jadwal</p>
                    <p className="font-medium text-gray-800">
                      📅 {formatDateTime(activity.schedule)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium text-gray-800">
                      📍 {activity.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faUsers} className="text-green-600 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Peserta</p>
                    <p className="font-medium text-gray-800">
                      👥 {activity.participants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600 text-xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pemateri/Instruktur</p>
                    <p className="font-medium text-gray-800">
                      👨‍🏫 {activity.instructor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="text-green-600 mr-2" />
              Deskripsi Kegiatan
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                ℹ️ {activity.description}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Informasi Lengkap
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">ID:</div>
                <div className="flex-1 text-gray-800 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                  {activity.id}
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">Kategori:</div>
                <div className="flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(activity.category)}`}>
                    {getCategoryLabel(activity.category)}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">Status:</div>
                <div className="flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    activity.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    <FontAwesomeIcon 
                      icon={activity.isActive ? faCheckCircle : faTimesCircle} 
                      className="mr-1" 
                    />
                    🟢 {activity.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>

              {activity.imageUrl && (
                <div className="flex items-start">
                  <div className="w-24 text-sm text-gray-600 font-medium">Gambar:</div>
                  <div className="flex-1">
                    <a
                      href={activity.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 transition text-sm flex items-center"
                    >
                      <FontAwesomeIcon icon={faImage} className="mr-1" />
                      🖼️ Lihat gambar asli
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Aksi
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={shareActivity}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                Bagikan Kegiatan
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

          {/* Back to Activities */}
          <div className="text-center mt-8">
            <Link
              href="/#activities"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Daftar Kegiatan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}