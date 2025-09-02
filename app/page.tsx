"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  googleSheetsService,
  AnnouncementData,
  GalleryData,
  ActivityData,
  FinanceData,
  FinanceSummary,
  FinanceFilter,
  PaginatedFinanceData,
  type ContactData,
  ContactSubmissionResponse,
} from "../lib/googleSheets";
import Image from "next/image";
// Interface untuk data jadwal sholat Aladhan API (Updated)
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

interface AladhanCityResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: {
      readable: string;
      timestamp: string;
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
          days: number;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
    };
    meta: {
      methodName?: string;
      schoolName?: string;
      fajrDegree?: string;
      ishaDegree?: string;
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        name: string;
        params: {
          Fajr: string;
          Isha: string;
          Maghrib: string;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {};
    };
  };
}

interface SortConfig {
  field: "date" | "description" | "income" | "expense";
  direction: "asc" | "desc";
}

// Import semua section components
import HeaderSection from "./components/section/HeaderSection";
import HeroSection from "./components/section/HeroSection";
import PrayerTimesSection from "./components/section/PrayerTimesSection";
import AnnouncementSection from "./components/section/AnnouncementSection";
import AboutSection from "./components/section/AboutSection";
import FacilitiesSection from "./components/section/FacilitiesSection";
import OrganizationSection from "./components/section/OrganizationSection";
import FinanceSection from "./components/section/FinanceSection";
import ActivitiesSection from "./components/section/ActivitiesSection";
import GallerySection from "./components/section/GallerySection";
import ArticlesSection from "./components/section/ArticlesSection";
import ContactSection from "./components/section/ContactSection";
import MapSection from "./components/section/MapSection";
import FooterSection from "./components/section/FooterSection";
import PWAInstallBanner from "./components/PWAInstallBanner";

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Bandung, Indonesia");
  const [showOrgChart, setShowOrgChart] = useState(false); // Tambah state ini
  const [activeTab, setActiveTab] = useState("rutin"); // Untuk tab kegiatan
  const [showAllGallery, setShowAllGallery] = useState(false); // Untuk gallery
  const [showAllArticles, setShowAllArticles] = useState(false); // Untuk articles
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(
    null
  );
  const [loadingFinance, setLoadingFinance] = useState(true);
  const [financeFilter, setFinanceFilter] = useState<FinanceFilter>({
    period: "all",
    page: 1,
    itemsPerPage: 7,
    sortField: "date",
    sortDirection: "desc",
  });

  const [paginatedFinanceData, setPaginatedFinanceData] =
    useState<PaginatedFinanceData | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "date",
    direction: "desc", // Default: tanggal terbaru dulu
  });

  // Fungsi untuk fetch data finance dari Google Sheets
  const fetchFinanceData = async () => {
    try {
      setLoadingFinance(true);

      const [financeTransactions, summary] = await Promise.all([
        googleSheetsService.getFinanceData(),
        googleSheetsService.getFinanceSummary(),
      ]);

      setFinanceData(financeTransactions);
      setFinanceSummary(summary);
    } catch (error) {
      console.error("Error fetching finance data:", error);
      // Set fallback data
      setFinanceSummary({
        totalIncome: 25750000,
        totalExpense: 18300000,
        balance: 142650000,
        formattedTotalIncome: "Rp 25.750.000",
        formattedTotalExpense: "Rp 18.300.000",
        formattedBalance: "Rp 142.650.000",
        transactionCount: 50,
        lastUpdated: "Hari ini",
      });
      console.error("Failed to fetch finance data, using fallback data");
      setLoadingFinance(false);
    } finally {
      setLoadingFinance(false);
    }
  };

  // Fungsi untuk fetch data finance dengan filter dan pagination
  const fetchFinanceDataPaginated = async (filter: FinanceFilter) => {
    const fetchId = Date.now();
    try {
      setLoadingFinance(true);

      const [paginatedData, summary] = await Promise.all([
        googleSheetsService.getFinanceDataPaginated(filter),
        googleSheetsService.getFinanceSummaryByPeriod(filter.period),
      ]);

      setPaginatedFinanceData(paginatedData);
      setFinanceSummary(summary);
    } catch (error) {
      console.error(`❌ [${fetchId}] fetchFinanceDataPaginated error:`, error);

      // Set fallback data
      setFinanceSummary({
        totalIncome: 25750000,
        totalExpense: 18300000,
        balance: 142650000,
        formattedTotalIncome: "Rp 25.750.000",
        formattedTotalExpense: "Rp 18.300.000",
        formattedBalance: "Rp 142.650.000",
        transactionCount: 50,
        lastUpdated: "Fallback data",
      });
    } finally {
      // console.log(`🏁 [${fetchId}] fetchFinanceDataPaginated finished`);
      setLoadingFinance(false);
    }
  };

  const handlePeriodChange = useCallback(
    (period: "week" | "month" | "year" | "all") => {
      console.log("📅 Period changing to:", period);
      setFinanceFilter((prev) => ({
        ...prev,
        period,
        page: 1, // Reset to first page
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    console.log("📄 Page changing to:", page);
    setFinanceFilter((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleSort = useCallback(
    (field: "date" | "description" | "income" | "expense") => {
      console.log("🔄 Sorting by:", field);
      setFinanceFilter((prev) => {
        const newDirection: "asc" | "desc" =
          prev.sortField === field && prev.sortDirection === "desc"
            ? "asc"
            : "desc";

        return {
          ...prev,
          sortField: field,
          sortDirection: newDirection,
          page: 1, // Reset to first page
        };
      });
    },
    []
  );

  const handleRefreshFinance = useCallback(() => {
    fetchFinanceDataPaginated(financeFilter);
  }, [financeFilter]);

  // Helper function untuk icon sorting
  const getSortIcon = (
    field: "date" | "description" | "income" | "expense"
  ) => {
    if (financeFilter.sortField !== field) {
      return (
        <FontAwesomeIcon
          icon={faSort}
          className="ml-1 text-gray-400 opacity-50"
        />
      );
    }

    return financeFilter.sortDirection === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="ml-1 text-green-600" />
    ) : (
      <FontAwesomeIcon icon={faSortUp} className="ml-1 text-green-600" />
    );
  };

  // Fungsi untuk fetch data dari Google Sheets
  const fetchContentData = async () => {
    try {
      setLoadingContent(true);
      const [announcementsData, galleryData, activitiesData, articlesData] =
        await Promise.all([
          googleSheetsService.getAnnouncements(),
          googleSheetsService.getGalleryItems(),
          googleSheetsService.getActivities(),
          googleSheetsService.getArticles(),
        ]);

      // console.log("✅ Content data received:", {
      //   announcements: announcementsData.length,
      //   gallery: galleryData.length,
      //   activities: activitiesData.length,
      //   articles: articlesData.length,
      // });

      setAnnouncements(announcementsData);
      setGalleryItems(galleryData);
      setActivities(activitiesData);
      setArticles(articlesData);
    } catch (error) {
      console.error("❌ fetchContentData error:", error);

      // Set fallback data
      setAnnouncements([
        {
          id: "1",
          title: "Pengumuman Penting",
          content:
            "Pendaftaran Peserta Kajian Rutin Ahad Pagi dibuka mulai tanggal 1 Juni 2023",
          category: "info",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          isActive: true,
          buttonText: "Daftar Sekarang",
          buttonLink: "#activities",
        },
      ]);
      setGalleryItems([]);
      setActivities([]);
      setArticles([]);
    } finally {
      // console.log("🏁 fetchContentData finished");
      setLoadingContent(false);
    }
  };

  // Fungsi untuk download gambar struktur organisasi
  const downloadOrgChart = () => {
    const link = document.createElement("a");
    link.href = "/struktur-organisasi.jpg";
    link.download = "Struktur-Organisasi-DKM-Ulul-Albaab.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Format tanggal: DD-MM-YYYY
      const currentDate = new Date();
      const dateString = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;

      // Parameter Bandung, Indonesia
      const params = new URLSearchParams({
        latitude: "-6.9175",
        longitude: "107.6191",
        method: "20", // KEMENAG Indonesia
        school: "0", // Shafi
        tune: "0,0,0,0,0,0,0,0,0",
        timezonestring: "Asia/Jakarta",
      });

      const url = `https://api.aladhan.com/v1/timings/${dateString}?${params.toString()}`;

      // Timeout handler
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AladhanCityResponse = await response.json();

      if (data.code === 200 && data.data && data.data.timings) {
        const timings = data.data.timings;
        const date = data.data.date;

        // Format tanggal Gregorian Indonesia
        const dayNames = {
          Sunday: "Minggu",
          Monday: "Senin",
          Tuesday: "Selasa",
          Wednesday: "Rabu",
          Thursday: "Kamis",
          Friday: "Jumat",
          Saturday: "Sabtu",
        };
        const monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        const dayName =
          dayNames[date.gregorian.weekday.en as keyof typeof dayNames];
        const monthName = monthNames[date.gregorian.month.number - 1];
        const formattedDate = `${dayName}, ${date.gregorian.day} ${monthName} ${date.gregorian.year}`;

        // Format tanggal Hijriah Indonesia
        const hijriMonthNames = {
          Muharram: "Muharram",
          Safar: "Safar",
          "Rabi' al-awwal": "Rabiul Awwal",
          "Rabi' al-thani": "Rabiul Akhir",
          "Jumada al-awwal": "Jumadil Awwal",
          "Jumada al-thani": "Jumadil Akhir",
          Rajab: "Rajab",
          "Sha'ban": "Syaban",
          Ramadan: "Ramadhan",
          Shawwal: "Syawal",
          "Dhu al-Qi'dah": "Dzulqaidah",
          "Dhu al-Hijjah": "Dzulhijjah",
        };
        // const hijriMonthName =
        //   hijriMonthNames[
        //     date.hijri.month.en as keyof typeof hijriMonthNames
        //   ] || date.hijri.month.en;
        // const formattedHijriDate = `${date.hijri.day} ${hijriMonthName} ${date.hijri.year} H`;

        // Offset -1 hari Hijriah
        let hijriDay = parseInt(date.hijri.day, 10) - 1;
        let hijriMonth = date.hijri.month.number;
        let hijriYear = parseInt(date.hijri.year, 10);

        // Jika mundur ke hari 0, mundurkan ke bulan sebelumnya
        if (hijriDay < 1) {
          hijriMonth -= 1;
          if (hijriMonth < 1) {
            hijriMonth = 12;
            hijriYear -= 1;
          }
          // Ambil jumlah hari di bulan sebelumnya
          hijriDay = date.hijri.month.days; // fallback, bisa lebih akurat jika ambil dari API
        }

        const hijriMonthName =
          hijriMonthNames[
            date.hijri.month.en as keyof typeof hijriMonthNames
          ] || date.hijri.month.en;

        const formattedHijriDate = `${hijriDay} ${hijriMonthName} ${hijriYear} H`;

        setPrayerTimes({
          date: formattedDate,
          hijriDate: formattedHijriDate,
          fajr: timings.Fajr.split(" ")[0],
          sunrise: timings.Sunrise.split(" ")[0],
          dhuhr: timings.Dhuhr.split(" ")[0],
          asr: timings.Asr.split(" ")[0],
          sunset: timings.Sunset.split(" ")[0],
          maghrib: timings.Maghrib.split(" ")[0],
          isha: timings.Isha.split(" ")[0],
          imsak: timings.Imsak.split(" ")[0],
          midnight: timings.Midnight.split(" ")[0],
          firstthird: timings.Firstthird.split(" ")[0],
          lastthird: timings.Lastthird.split(" ")[0],
        });
      } else {
        throw new Error("Data jadwal sholat tidak tersedia");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setPrayerTimes({
        date: "Hari ini",
        hijriDate: "Hari ini H",
        fajr: "04:47",
        sunrise: "05:58",
        dhuhr: "11:54",
        asr: "16:11",
        sunset: "17:50",
        maghrib: "17:50",
        isha: "19:09",
        imsak: "04:37",
        midnight: "23:54",
        firstthird: "21:53",
        lastthird: "01:55",
      });
    } finally {
      setLoading(false);
    }
  };

  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const namaRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjekRef = useRef<HTMLInputElement>(null);
  const pesanRef = useRef<HTMLTextAreaElement>(null);

  // Update handleContactSubmit function
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !namaRef.current ||
      !emailRef.current ||
      !subjekRef.current ||
      !pesanRef.current
    ) {
      setContactMessage({
        type: "error",
        text: "Semua field harus diisi",
      });
      return;
    }

    setContactLoading(true);
    setContactMessage(null);

    try {
      const contactData = {
        nama: namaRef.current.value,
        email: emailRef.current.value,
        subjek: subjekRef.current.value,
        pesan: pesanRef.current.value,
      };

      // Submit to Google Sheets using the service
      const result = await googleSheetsService.submitContactForm(contactData);

      if (result.success) {
        setContactMessage({
          type: "success",
          text: result.message,
        });

        // Clear form
        namaRef.current.value = "";
        emailRef.current.value = "";
        subjekRef.current.value = "";
        pesanRef.current.value = "";
      } else {
        setContactMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      setContactMessage({
        type: "error",
        text: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
      });
    } finally {
      setContactLoading(false);
    }
  };

  // Clear contact message
  const clearContactMessage = () => {
    setContactMessage(null);
  };

  const stableFinanceFilter = useMemo(
    () => ({
      period: financeFilter.period,
      page: financeFilter.page,
      itemsPerPage: financeFilter.itemsPerPage,
      sortField: financeFilter.sortField,
      sortDirection: financeFilter.sortDirection,
    }),
    [
      financeFilter.period,
      financeFilter.page,
      financeFilter.itemsPerPage,
      financeFilter.sortField,
      financeFilter.sortDirection,
    ]
  );

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    }
  };

  // Filter activities berdasarkan kategori
  const getActivitiesByCategory = (category: "rutin" | "khusus" | "jadwal") => {
    return activities.filter((activity) => activity.category === category);
  };

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    // Debounce untuk prevent rapid calls
    const timeoutId = setTimeout(() => {
      fetchFinanceDataPaginated(stableFinanceFilter);
    }, 300); // 300ms debounce
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = anchor.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: (targetElement as HTMLElement).offsetTop - 80,
            behavior: "smooth",
          });

          // Close mobile menu if open
          if (mobileMenu) mobileMenu.classList.add("hidden");
        }
      });
    });

    setFinanceFilter((prev) => ({
      ...prev,
      startDate: `${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-01`,
      endDate: `${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-${new Date(currentYear, currentMonth, 0).getDate()}`,
    }));

    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll("nav a");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute("id") || "";
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active-nav");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active-nav");
        }
      });
    };

    // Add passive event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    fetchPrayerTimes();
    fetchContentData();

    // ✅ PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      // console.log("📱 PWA install prompt triggered");
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [stableFinanceFilter]);

  return (
    <>
      <HeaderSection />
      <HeroSection />
      <PrayerTimesSection
        prayerTimes={prayerTimes}
        loading={loading}
        error={error}
        location={location}
        onRefresh={fetchPrayerTimes}
      />
      <AnnouncementSection
        announcements={announcements}
        loading={loadingContent}
      />
      <AboutSection />
      <FacilitiesSection />
      <OrganizationSection
        showOrgChart={showOrgChart}
        setShowOrgChart={setShowOrgChart}
        downloadOrgChart={downloadOrgChart}
      />
      <FinanceSection
        loadingFinance={loadingFinance}
        financeSummary={financeSummary}
        paginatedFinanceData={paginatedFinanceData}
        financeFilter={financeFilter}
        onPeriodChange={handlePeriodChange}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onRefresh={handleRefreshFinance}
        getSortIcon={getSortIcon}
      />
      <ActivitiesSection
        activities={activities}
        loading={loadingContent}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        getActivitiesByCategory={getActivitiesByCategory}
      />
      <GallerySection
        galleryItems={galleryItems}
        loading={loadingContent}
        showAllGallery={showAllGallery}
        onToggleShowAll={setShowAllGallery}
      />
      <ArticlesSection
        articles={articles}
        loading={loadingContent}
        showAllArticles={showAllArticles}
        onToggleShowAll={setShowAllArticles}
      />
      <ContactSection
        contactLoading={contactLoading}
        contactMessage={contactMessage}
        namaRef={namaRef}
        emailRef={emailRef}
        subjekRef={subjekRef}
        pesanRef={pesanRef}
        onSubmit={handleContactSubmit}
        onClearMessage={clearContactMessage}
      />
      <MapSection />
      <FooterSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <PWAInstallBanner
        showInstallBanner={showInstallBanner}
        onInstallClick={handleInstallClick}
        onDismiss={() => setShowInstallBanner(false)}
      />
    </>
  );
}
