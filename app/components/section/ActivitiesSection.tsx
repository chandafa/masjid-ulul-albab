"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { ActivityData } from "../../../lib/googleSheets";

interface ActivitiesSectionProps {
  activities: ActivityData[];
  loading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  getActivitiesByCategory: (
    category: "rutin" | "khusus" | "jadwal"
  ) => ActivityData[];
}

export default function ActivitiesSection({
  activities,
  loading,
  activeTab,
  onTabChange,
  getActivitiesByCategory,
}: ActivitiesSectionProps) {
  return (
    <section id="activities" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center section-title">
          Kegiatan Kami
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === "rutin"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => onTabChange("rutin")}
            >
              Rutin
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === "khusus"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => onTabChange("khusus")}
            >
              Khusus
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === "jadwal"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:text-green-600"
              }`}
              onClick={() => onTabChange("jadwal")}
            >
              Jadwal
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {loading ? (
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-3xl mb-4 text-gray-400"
            />
            <p className="text-gray-600">Memuat kegiatan...</p>
          </div>
        ) : (
          <>
            {/* Tab Rutin */}
            {activeTab === "rutin" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {getActivitiesByCategory("rutin").map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md h-full flex flex-col"
                  >
                    <img
                      src={activity.imageUrl || "/api/placeholder/400/200"}
                      alt={activity.title}
                      className="w-full h-32 md:h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/200";
                      }}
                    />
                    <div className="p-4 md:p-5 flex-1 flex flex-col">
                      <h4 className="font-bold text-base md:text-lg mb-2">
                        {activity.title}
                      </h4>
                      <p className="text-gray-700 mb-3 text-sm md:text-base flex-1">
                        {activity.description}
                      </p>
                      <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 mt-auto">
                        <span>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-1"
                          />
                          {activity.schedule}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faUsers} className="mr-1" />
                          {activity.participants}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Khusus */}
            {activeTab === "khusus" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {getActivitiesByCategory("khusus").map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-card bg-green-50 border border-green-100 rounded-lg p-4 md:p-6 h-full flex flex-col"
                  >
                    <div className="flex items-start h-full">
                      <div className="bg-green-100 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-green-600 text-lg md:text-xl"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-base md:text-lg mb-2">
                          {activity.title}
                        </h4>
                        <p className="text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                          {activity.description}
                        </p>
                        <div className="flex items-center text-xs md:text-sm text-green-700 mt-auto">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2"
                          />
                          <span>{activity.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Jadwal */}
            {activeTab === "jadwal" && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                {/* Mobile: Card layout */}
                <div className="block md:hidden">
                  <div className="divide-y divide-gray-200">
                    {getActivitiesByCategory("jadwal").map((activity) => (
                      <div key={activity.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-base">
                            {activity.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {activity.schedule}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.instructor} • {activity.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kegiatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pemateri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lokasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peserta
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getActivitiesByCategory("jadwal").map((activity) => (
                        <tr key={activity.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {activity.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.schedule}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {activity.participants}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
