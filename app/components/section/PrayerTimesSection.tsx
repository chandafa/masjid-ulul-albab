"use client";
// components/sections/PrayerTimesSection.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface PrayerTime {
  date: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
  firstthird: string;
  lastthird: string;
}

interface PrayerTimesSectionProps {
  prayerTimes: PrayerTime | null;
  loading: boolean;
  error: string | null;
  location: string;
  onRefresh: () => void;
  meta: {
    methodName?: string;
    schoolName?: string;
    fajrDegree?: string;
    ishaDegree?: string;
  };
}

export default function PrayerTimesSection({
  prayerTimes,
  loading,
  error,
  location,
  onRefresh,
  meta,
}: PrayerTimesSectionProps) {
  // Default/fallback jika meta tidak ada
  const methodName = meta?.methodName || "KEMENAG (Kementerian Agama RI)";
  const schoolName = meta?.schoolName || "Syafi'i";
  const fajrDegree = meta?.fajrDegree || "20°";
  const ishaDegree = meta?.ishaDegree || "18°";
  return (
    <section className="bg-gradient-to-b from-green-600 to-green-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Waktu Sholat Hari Ini</h2>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
            ) : null}
            {loading ? "Memuat..." : "Perbarui"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm">⚠️ {error}</p>
            <p className="text-xs mt-1 opacity-75">Menggunakan data cadangan</p>
          </div>
        )}

        {prayerTimes && (
          <>
            <div className="text-center mb-4">
              <p className="text-lg font-medium opacity-90">
                {prayerTimes.date}
              </p>
              <p className="text-sm opacity-75">{prayerTimes.hijriDate}</p>
              <p className="text-sm opacity-75">{location}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="prayer-time p-4 rounded-lg text-center bg-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Subuh</h3>
                <p className="text-2xl font-mono">{prayerTimes.fajr}</p>
              </div>
              <div className="prayer-time p-4 rounded-lg text-center bg-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Dzuhur</h3>
                <p className="text-2xl font-mono">{prayerTimes.dhuhr}</p>
              </div>
              <div className="prayer-time p-4 rounded-lg text-center bg-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Ashar</h3>
                <p className="text-2xl font-mono">{prayerTimes.asr}</p>
              </div>
              <div className="prayer-time p-4 rounded-lg text-center bg-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Maghrib</h3>
                <p className="text-2xl font-mono">{prayerTimes.maghrib}</p>
              </div>
              <div className="prayer-time p-4 rounded-lg text-center bg-white/10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Isya</h3>
                <p className="text-2xl font-mono">{prayerTimes.isha}</p>
              </div>
            </div>

            {/* Additional prayer times */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="text-center bg-white/5 rounded p-2">
                <span className="opacity-75">Imsak: </span>
                <span className="font-mono">{prayerTimes.imsak}</span>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <span className="opacity-75">Terbit: </span>
                <span className="font-mono">{prayerTimes.sunrise}</span>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <span className="opacity-75">Tenggelam: </span>
                <span className="font-mono">{prayerTimes.sunset}</span>
              </div>
              <div className="text-center bg-white/5 rounded p-2">
                <span className="opacity-75">Sumber: </span>
                <span className="text-xs">Aladhan API</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs opacity-75">
                Metode: {methodName} (Subuh: {fajrDegree}, Isya: {ishaDegree}) |
                Mazhab: {schoolName}
              </p>
            </div>
          </>
        )}

        {loading && !prayerTimes && (
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-3xl mb-4"
            />
            <p>Memuat jadwal sholat...</p>
          </div>
        )}
      </div>
    </section>
  );
}
