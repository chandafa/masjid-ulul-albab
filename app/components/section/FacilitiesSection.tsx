"use client";
// components/sections/FacilitiesSection.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faSignal,
  faMosque,
  faExpand,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function FacilitiesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center section-title">
          Fasilitas Kami
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">
              <FontAwesomeIcon icon={faMosque} />
            </div>
            <h3 className="text-xl font-bold mb-3">Ruang Sholat</h3>
            <p className="text-gray-700 mb-4">
              Kapasitas 500 jamaah dengan alas sajadah yang nyaman dan kipas
              angin.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faExpand} className="mr-2" />
              <span>+-800 m²</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pojok Baca</h3>
            <p className="text-gray-700 mb-4">
              Koleksi lebih dari 200 buku Islami berbagai disiplin ilmu, terbuka
              untuk umum.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              <span>200+ buku</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-4">
              <FontAwesomeIcon icon={faWifi} />
            </div>
            <h3 className="text-xl font-bold mb-3">WiFi Gratis</h3>
            <p className="text-gray-700 mb-4">
              Akses internet gratis untuk jamaah, mendukung kegiatan kajian
              online dan kemudahan ibadah digital.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <FontAwesomeIcon icon={faSignal} className="mr-2" />
              <span>24/7 tersedia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
