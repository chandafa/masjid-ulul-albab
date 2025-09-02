"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface FooterSectionProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function FooterSection({
  activeTab = "rutin",
  setActiveTab,
}: FooterSectionProps) {
  const handleActivityLink = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    // Scroll to activities section
    const activitiesSection = document.getElementById("activities");
    if (activitiesSection) {
      activitiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faMosque}
                className="mosque-icon text-3xl mr-3"
              />
              <h3 className="text-xl font-bold">
                Masjid <span className="text-green-500">Ulul Albaab</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Pusat kegiatan keislaman yang membina umat menuju masyarakat yang
              berakhlak mulia dan berilmu.
            </p>
            <p className="text-gray-400">
              © 2025 Masjid Ulul Albaab. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#organization"
                  className="text-gray-400 hover:text-white transition"
                >
                  Struktur Organisasi
                </a>
              </li>
              <li>
                <a
                  href="#finance"
                  className="text-gray-400 hover:text-white transition"
                >
                  Laporan Keuangan
                </a>
              </li>
              <li>
                <a
                  href="#activities"
                  className="text-gray-400 hover:text-white transition"
                >
                  Kegiatan
                </a>
              </li>
              <li>
                <a
                  href="#articles"
                  className="text-gray-400 hover:text-white transition"
                >
                  Artikel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Kegiatan</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleActivityLink("rutin")}
                  className="text-gray-400 hover:text-white transition text-left"
                >
                  Rutin
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleActivityLink("khusus")}
                  className="text-gray-400 hover:text-white transition text-left"
                >
                  Khusus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleActivityLink("jadwal")}
                  className="text-gray-400 hover:text-white transition text-left"
                >
                  Jadwal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Berlangganan</h4>
            <p className="text-gray-400 mb-4">
              Dapatkan update kegiatan terbaru melalui email Anda.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Sedang Dalam Perbaikan"
                className="px-4 py-2 rounded-l-lg bg-white focus:outline-none text-black w-full"
                disabled
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg"
                disabled
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>

            <div className="mt-6">
              <h5 className="font-bold mb-2">Donasi</h5>
              <p className="text-gray-400 mb-2">SeaBank</p>
              <p className="font-mono bg-gray-700 p-2 rounded-lg text-sm">
                9013 7458 0025 (a.n. Azhar Muttaqien (Bendahara Periode
                2025/2026))
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>Dibangun dengan ❤ oleh Tim IT Masjid Ulul Albaab</p>
        </div>
      </div>
    </footer>
  );
}
