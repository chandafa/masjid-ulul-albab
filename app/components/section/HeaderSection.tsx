// components/sections/HeaderSection.
"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function HeaderSection() {
  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/icon-512.png"
            alt="Logo Masjid Ulul Albaab"
            width={40}
            height={40}
            className="mr-3"
            priority={true}
            style={{
              width: "auto",
              height: "30px",
            }}
          />
          <h1 className="text-xl font-bold text-gray-800">
            Masjid <span className="text-green-600">Ulul Albaab</span>
          </h1>
        </div>

        <button id="mobile-menu-button" className="md:hidden text-gray-700">
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <a
                href="#home"
                className="text-gray-800 hover:text-green-600 transition active-nav"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-gray-800 hover:text-green-600 transition"
              >
                Tentang
              </a>
            </li>
            <li>
              <a
                href="#organization"
                className="text-gray-800 hover:text-green-600 transition"
              >
                Struktur
              </a>
            </li>
            <li>
              <a
                href="#finance"
                className="text-gray-800 hover:text-green-600 transition"
              >
                Keuangan
              </a>
            </li>
            <li>
              <a
                href="#activities"
                className="text-gray-800 hover:text-green-600 transition"
              >
                Kegiatan
              </a>
            </li>
            <li>
              <a
                href="#articles"
                className="text-gray-800 hover:text-green-600 transition"
              >
                Artikel
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className="hidden md:hidden bg-white py-3 px-4 shadow-lg"
      >
        <ul className="space-y-3">
          <li>
            <a
              href="#home"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Tentang
            </a>
          </li>
          <li>
            <a
              href="#organization"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Struktur
            </a>
          </li>
          <li>
            <a
              href="#finance"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Keuangan
            </a>
          </li>
          <li>
            <a
              href="#activities"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Kegiatan
            </a>
          </li>
          <li>
            <a
              href="#articles"
              className="block text-gray-800 hover:text-green-600 transition"
            >
              Artikel
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
