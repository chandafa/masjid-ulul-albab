"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCalendarAlt,
  faUser,
  faTag,
  faEye,
  faNewspaper,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { ArticleData } from "@/lib/googleSheets";
import Link from "next/link";
import Image from "next/image";

interface ArticlesSectionProps {
  articles: ArticleData[];
  loading: boolean;
  showAllArticles: boolean;
  onToggleShowAll: (show: boolean) => void;
}

export default function ArticlesSection({
  articles,
  loading,
  showAllArticles,
  onToggleShowAll,
}: ArticlesSectionProps) {
  const displayedArticles = showAllArticles
    ? articles
    : articles.slice(0, 6);

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
      
      return dateStr; // Return as-is if can't parse
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

  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <section id="articles" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center section-title">
          Artikel & Berita
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-3xl mb-4 text-green-600"
            />
            <p className="text-gray-600">Memuat artikel...</p>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {article.imageUrl ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `
                              <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                                <div class="text-gray-400 text-center">
                                  <div class="text-3xl mb-2">📰</div>
                                  <div class="text-sm">Artikel</div>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <FontAwesomeIcon icon={faNewspaper} className="text-3xl mb-2" />
                          <div className="text-sm">Artikel</div>
                        </div>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
                        <FontAwesomeIcon icon={faTag} className="mr-1" />
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-green-600 transition-colors leading-tight">
                      📰 {article.title}
                    </h3>
                    
                    {/* Article Meta */}
                    <div className="flex flex-col space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                        <span>✍️ {article.author}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-green-600" />
                        <span>📅 {formatDate(article.date)}</span>
                      </div>
                    </div>

                    {/* Article Preview */}
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      📖 {truncateContent(article.content)}
                    </p>

                    {/* Read More Button */}
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/artikel/${article.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Baca Selengkapnya
                      </Link>
                      
                      <div className="text-xs text-gray-500">
                        ID: {article.id}
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay dengan preview */}
                  <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <div className="text-white text-center p-6">
                      <FontAwesomeIcon icon={faNewspaper} className="text-3xl mb-3" />
                      <h4 className="font-bold text-lg mb-2">📰 {article.title}</h4>
                      <p className="text-sm opacity-90 mb-3">✍️ {article.author}</p>
                      <p className="text-xs opacity-75">📅 {formatDate(article.date)}</p>
                      <div className="mt-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                          🏷️ {article.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Show More/Less Button */}
            {articles.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => onToggleShowAll(!showAllArticles)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {showAllArticles
                    ? "Tampilkan Lebih Sedikit"
                    : `Lihat Semua Artikel (${articles.length})`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FontAwesomeIcon icon={faNewspaper} className="text-6xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              Belum Ada Artikel
            </h3>
            <p className="text-gray-500">
              Artikel dan berita akan segera diperbarui.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}