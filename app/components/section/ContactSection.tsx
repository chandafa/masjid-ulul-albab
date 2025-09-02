"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faSpinner,
  faPaperPlane,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { RefObject, useEffect, useState } from "react";

interface ContactSectionProps {
  contactLoading: boolean;
  contactMessage: { type: "success" | "error"; text: string } | null;
  namaRef: RefObject<HTMLInputElement | null>;
  emailRef: RefObject<HTMLInputElement | null>;
  subjekRef: RefObject<HTMLInputElement | null>;
  pesanRef: RefObject<HTMLTextAreaElement | null>;
  onSubmit: (e: React.FormEvent) => void;
  onClearMessage: () => void;
}

export default function ContactSection({
  contactLoading,
  contactMessage,
  namaRef,
  emailRef,
  subjekRef,
  pesanRef,
  onSubmit,
  onClearMessage,
}: ContactSectionProps) {
  const [clientDate, setClientDate] = useState<string>("");

  useEffect(() => {
    setClientDate(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
        " pukul " +
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
    );
  }, []);
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center section-title">
          Hubungi Kami
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Informasi Kontak
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-green-600 text-xl mr-4 mt-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <h4 className="font-bold">Alamat</h4>
                  <p className="text-gray-700">
                    Jl. Dr. Setiabudhi No. 193 Bandung.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-green-600 text-xl mr-4 mt-1">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <h4 className="font-bold">Telepon</h4>
                  <p className="text-gray-700">(0812)24764338</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-green-600 text-xl mr-4 mt-1">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-gray-700">sekretariat.albaab@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-green-600 text-xl mr-4 mt-1">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <h4 className="font-bold">Jam Operasional</h4>
                  <p className="text-gray-700">Setiap hari 07.00 - 21.00 WIB</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold mb-3">Media Sosial</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/ululalbaab_unpas/"
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://wa.me/6281224764338?text=Assalamu'alaikum, saya ingin bertanya tentang Masjid Ulul Albaab"
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a
                  href="https://www.youtube.com/@UlulAlbaabChannel"
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Kirim Pesan
            </h3>

            {/* Success/Error Message */}
            {contactMessage && (
              <div
                className={`mb-4 p-4 rounded-lg border flex items-start justify-between ${
                  contactMessage.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex items-start">
                  <FontAwesomeIcon
                    icon={
                      contactMessage.type === "success"
                        ? faCheckCircle
                        : faExclamationTriangle
                    }
                    className={`mr-2 mt-0.5 ${
                      contactMessage.type === "error"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  />
                  <p className="text-sm">{contactMessage.text}</p>
                </div>
                <button
                  onClick={onClearMessage}
                  className="text-gray-400 hover:text-gray-600 transition ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  ref={namaRef}
                  type="text"
                  id="nama"
                  name="nama"
                  required
                  disabled={contactLoading}
                  autoComplete="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={contactLoading}
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="nama@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subjek"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subjek <span className="text-red-500">*</span>
                </label>
                <input
                  ref={subjekRef}
                  type="text"
                  id="subjek"
                  name="subjek"
                  required
                  disabled={contactLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Topik pesan Anda"
                />
              </div>

              <div>
                <label
                  htmlFor="pesan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={pesanRef}
                  id="pesan"
                  name="pesan"
                  rows={4}
                  required
                  disabled={contactLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-600 focus:border-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {contactLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Mengirim Pesan...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>

            {/* Form Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-600 mr-2 mt-0.5"
                />
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Info:</strong> Pesan Anda akan langsung tersimpan di
                    sistem kami. Tim akan merespons dalam 1x24 jam via email
                    atau WhatsApp.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Tanggal pengiriman akan otomatis tercatat: {clientDate} WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
