"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface OrganizationSectionProps {
  showOrgChart: boolean;
  setShowOrgChart: (show: boolean) => void;
  downloadOrgChart: () => void;
}

export default function OrganizationSection({
  showOrgChart,
  setShowOrgChart,
  downloadOrgChart,
}: OrganizationSectionProps) {
  return (
    <section id="organization" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center section-title">
          Struktur Organisasi
        </h2>

        {/* Card dengan gambar struktur organisasi */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setShowOrgChart(true)}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-green-700 text-center">
                  Bagan Struktur Organisasi DKM Ulul Albaab
                </h3>
                <div className="relative">
                  <Image
                    src="/struktur-organisasi.jpg"
                    alt="Struktur Organisasi DKM Ulul Albaab"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                    style={{
                      objectFit: "contain",
                      maxHeight: "400px",
                    }}
                  />
                  <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium text-gray-800">
                        Klik untuk melihat detail
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faExpand} className="mr-2" />
                    Klik untuk memperbesar
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadOrgChart();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition flex items-center cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="mr-1 text-xs"
                    />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal untuk menampilkan gambar full */}
        {showOrgChart && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Struktur Organisasi DKM Ulul Albaab
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowOrgChart(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ✕ Tutup
                  </button>
                </div>
              </div>
              <div className="p-6">
                <Image
                  src="/struktur-organisasi.jpg"
                  alt="Struktur Organisasi DKM Ulul Albaab"
                  width={1200}
                  height={900}
                  className="w-full h-auto"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Existing content - Tugas dan Fungsi */}
        <div className="mt-12 bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-green-700">
            Tugas dan Fungsi
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">Dewan Kemakmuran Masjid DKM</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>
                  DKM UAB UNPAS berfungsi sebagai Lembaga Dakwah Kampus (LDK)
                </li>
                <li>Mengelola kegiatan masjid sehari-hari dan sebagai</li>
                <li>Fasilitator umat di lingkungan Kampus IV UNPAS.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Departemen DKM UAB</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>
                  <strong>Syiar Media:</strong> Menyebarkan dakwah Islam melalui
                  media cetak dan media sosial.
                </li>
                <li>
                  <strong>Pelayanan Umat:</strong> Mengelola masjid dan
                  memfasilitasi kebutuhan ibadah jamaah.
                </li>
                <li>
                  <strong>Kaderisasi:</strong> Mengembangkan SDM pengurus
                  melalui pelatihan fisik dan spiritual, serta merekrut dan
                  membina anggota DKM.
                </li>
                <li>
                  <strong>Kemuslimahan:</strong> Membina dan mengkoordinasi
                  kegiatan pengurus Akhwat DKM Ulul Albaab.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
