"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCalendarAlt,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { GalleryData } from "@/lib/googleSheets";

interface GallerySectionProps {
  galleryItems: GalleryData[];
  loading: boolean;
  showAllGallery: boolean;
  onToggleShowAll: (show: boolean) => void;
}

export default function GallerySection({
  galleryItems,
  loading,
  showAllGallery,
  onToggleShowAll,
}: GallerySectionProps) {
  const displayedItems = showAllGallery
    ? galleryItems
    : galleryItems.slice(0, 6);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center section-title">
          Galeri Kegiatan
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-3xl mb-4 text-green-600"
            />
            <p className="text-gray-600">Memuat galeri...</p>
          </div>
        ) : galleryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                              <div class="text-gray-400 text-center">
                                <div class="text-3xl mb-2">📷</div>
                                <div class="text-sm">Gambar tidak tersedia</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-1"
                        />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faTag} className="mr-1" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay dengan info */}
                  <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <div className="text-white text-center p-4">
                      <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-sm opacity-90">{item.description}</p>
                      <div className="mt-3 text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {galleryItems.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => onToggleShowAll(!showAllGallery)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {showAllGallery
                    ? "Tampilkan Lebih Sedikit"
                    : "Lihat Semua Galeri"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl">📷</div>
            </div>
            <p className="text-gray-500">Galeri akan segera diperbarui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
