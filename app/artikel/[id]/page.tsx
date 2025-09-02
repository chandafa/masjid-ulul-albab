"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarAlt,
  faUser,
  faTag,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faImage,
  faShare,
  faCopy,
  faNewspaper,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ArticleData, googleSheetsService } from "@/lib/googleSheets";
import Image from "next/image";
import Link from "next/link";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const articleId = params.id as string;

  useEffect(() => {
    fetchArticleDetail();
  }, [articleId]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const foundArticle = await googleSheetsService.getArticleById(articleId);

      if (foundArticle) {
        if (!foundArticle.isActive) {
          setError("Artikel tidak tersedia.");
        } else {
          setArticle(foundArticle);
        }
      } else {
        setError(`Artikel dengan ID ${articleId} tidak ditemukan.`);
      }
    } catch (err) {
      console.error("Error fetching article detail:", err);
      setError("Gagal memuat artikel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      // Handle DD/MM/YYYY format
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
      
      // Fallback for other formats
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
      
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      syiar: "bg-green-100 text-green-800 border-green-200",
      kajian: "bg-blue-100 text-blue-800 border-blue-200",
      kegiatan: "bg-purple-100 text-purple-800 border-purple-200",
      pengumuman: "bg-yellow-100 text-yellow-800 border-yellow-200",
      berita: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
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

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: `📰 ${article.title} - oleh ${article.author}`,
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
          <p className="text-gray-600 text-lg">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Artikel tidak ditemukan"}
          </h1>
          <p className="text-gray-600 mb-6">
            Artikel yang Anda cari mungkin sudah tidak tersedia atau ID tidak valid.
          </p>
          <div className="space-y-3">
            <Link
              href="/#articles"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition inline-block"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Daftar Artikel
            </Link>
            <button
              onClick={fetchArticleDetail}
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
              href="/#articles"
              className="flex items-center text-gray-600 hover:text-green-600 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Kembali ke Artikel</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareArticle}
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
          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Hero Image */}
            {article.imageUrl && (
              <div className="relative h-64 md:h-80 bg-gray-100">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div class="text-gray-400 text-center">
                            <div class="text-4xl mb-2">📰</div>
                            <div class="text-sm">Gambar artikel tidak tersedia</div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                    <FontAwesomeIcon icon={faTag} className="mr-1" />
                    🏷️ {article.category}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    article.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    <FontAwesomeIcon 
                      icon={article.isActive ? faCheckCircle : faTimesCircle} 
                      className="mr-1" 
                    />
                    {article.isActive ? "🟢 Aktif" : "🔴 Tidak Aktif"}
                  </span>
                </div>
              </div>
            )}

            {/* Article Meta */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                📰 {article.title}
              </h1>

              {/* Author and Date Info */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 md:mb-0">
                  <FontAwesomeIcon icon={faUser} className="text-green-600 mr-2" />
                  <span className="text-gray-700">
                    ✍️ <strong>Penulis:</strong> {article.author}
                  </span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 mr-2" />
                  <span className="text-gray-700">
                    📅 <strong>Tanggal:</strong> {formatDate(article.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faNewspaper} className="text-green-600 mr-2" />
              📖 Isi Artikel
            </h2>
            
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </div>

          {/* Article Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Informasi Artikel
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">ID:</div>
                <div className="flex-1 text-gray-800 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                  {article.id}
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">Kategori:</div>
                <div className="flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                    🏷️ {article.category}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-24 text-sm text-gray-600 font-medium">Status:</div>
                <div className="flex-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    article.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    <FontAwesomeIcon 
                      icon={article.isActive ? faCheckCircle : faTimesCircle} 
                      className="mr-1" 
                    />
                    {article.isActive ? "🟢 Aktif" : "🔴 Tidak Aktif"}
                  </span>
                </div>
              </div>

              {article.imageUrl && (
                <div className="flex items-start">
                  <div className="w-24 text-sm text-gray-600 font-medium">Gambar:</div>
                  <div className="flex-1">
                    <a
                      href={article.imageUrl}
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
                onClick={shareArticle}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                Bagikan Artikel
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

          {/* Back to Articles */}
          <div className="text-center mt-8">
            <Link
              href="/#articles"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}