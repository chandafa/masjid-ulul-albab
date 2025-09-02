export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  category: "urgent" | "info" | "event";
  startDate: string;
  endDate: string;
  isActive: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface GalleryData {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  date: string;
  isActive: boolean;
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  category: "rutin" | "khusus" | "jadwal";
  imageUrl: string;
  schedule: string;
  location: string;
  participants: string;
  instructor: string;
  isActive: boolean;
}

export interface FinanceData {
  id: string;
  date: string;
  description: string;
  income: number;
  expense: number;
  fund: "Ummat" | "Kas";
  formattedIncome: string;
  formattedExpense: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  formattedTotalIncome: string;
  formattedTotalExpense: string;
  formattedBalance: string;
  transactionCount: number;
  lastUpdated: string;
}

export interface FinanceFilter {
  period: "week" | "month" | "year" | "all";
  page: number;
  itemsPerPage: number;
  sortField: "date" | "description" | "income" | "expense";
  sortDirection: "asc" | "desc";
}

export interface PaginatedFinanceData {
  data: FinanceData[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ContactData {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  tanggal: string; // Auto-generated
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data?: ContactData;
}

export interface ArticleData {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
}
class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private isDev = process.env.NODE_ENV === "development";

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  private log(message: string, data?: any) {
    // Only log in development and only important messages
    if (
      this.isDev &&
      (message.includes("error") || message.includes("failed"))
    ) {
      console.log(`[GoogleSheets] ${message}`, data || "");
    }
  }

  private error(message: string, error?: any) {
    // Always log errors but make them cleaner
    if (this.isDev) {
      console.error(`[GoogleSheets] ${message}`, error || "");
    } else {
      // In production, just log to error tracking service if available
      // console.error(`Contact form error: ${message}`);
    }
  }

  private parseCurrency(value: string): number {
    if (!value || value.trim() === "" || value === "0") return 0;

    const cleanValue = value
      .replace(/Rp\s*/g, "")
      .replace(/\./g, "")
      .replace(/,/g, "")
      .trim();

    return parseInt(cleanValue) || 0;
  }

  private formatCurrency(amount: number): string {
    if (amount === 0) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Helper function untuk parse date dari berbagai format dengan validasi yang lebih ketat
  private parseDate(dateStr: string): Date {
    if (!dateStr || dateStr.trim() === "") {
      return new Date(); // Return current date if empty
    }

    try {
      // Clean the date string
      const cleanDateStr = dateStr.trim();

      // Handle DD/MM/YYYY format (Indonesian format - most common in sheets)
      const ddmmyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const ddmmyyyyMatch = cleanDateStr.match(ddmmyyyyPattern);
      if (ddmmyyyyMatch) {
        const day = parseInt(ddmmyyyyMatch[1]);
        const month = parseInt(ddmmyyyyMatch[2]);
        const year = parseInt(ddmmyyyyMatch[3]);

        // Validate ranges
        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          // Create date using DD/MM/YYYY format
          const date = new Date(year, month - 1, day); // month is 0-indexed in JS

          // Verify the date is valid (e.g., not 31/02/2025)
          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            this.log(`Parsed date: ${cleanDateStr} → ${date.toISOString()}`);
            return date;
          }
        }
      }

      // Handle MM/DD/YYYY format (American format - fallback)
      const mmddyyyyPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const mmddyyyyMatch = cleanDateStr.match(mmddyyyyPattern);

      if (mmddyyyyMatch) {
        const month = parseInt(mmddyyyyMatch[1]);
        const day = parseInt(mmddyyyyMatch[2]);
        const year = parseInt(mmddyyyyMatch[3]);

        // Only use MM/DD format if day > 12 (clearly not a month)
        if (
          day > 12 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month - 1, day);
          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            this.log(
              `Parsed date (MM/DD): ${cleanDateStr} → ${date.toISOString()}`
            );
            return date;
          }
        }
      }

      // Handle YYYY-MM-DD format (ISO format)
      const isoPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
      const isoMatch = cleanDateStr.match(isoPattern);

      if (isoMatch) {
        const year = parseInt(isoMatch[1]);
        const month = parseInt(isoMatch[2]);
        const day = parseInt(isoMatch[3]);

        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month - 1, day);
          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            this.log(
              `Parsed date (ISO): ${cleanDateStr} → ${date.toISOString()}`
            );
            return date;
          }
        }
      }

      // Fallback: try JavaScript's built-in parser
      const fallbackDate = new Date(cleanDateStr);
      if (!isNaN(fallbackDate.getTime())) {
        this.log(
          `Parsed date (fallback): ${cleanDateStr} → ${fallbackDate.toISOString()}`
        );
        return fallbackDate;
      }

      // If all else fails, log error and return current date
      this.error(`Unable to parse date: ${cleanDateStr}`);
      return new Date();
    } catch (error) {
      this.error("Error parsing date:", `${dateStr} - ${error}`);
      return new Date();
    }
  }

  // Helper function untuk format date ke Indonesian format untuk display
  private formatDateToIndonesian(date: Date): string {
    try {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      this.error("Error formatting date:", error);
      return "Invalid Date";
    }
  }

  // Fetch data from API route (server-side)
  private async fetchFromApi(type: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/sheets?type=${type}`);
      if (!res.ok) {
        this.error(`Failed to fetch ${type} from API`, await res.text());
        return [];
      }
      const data = await res.json();
      return data.values || []; // <-- fix di sini!
    } catch (error) {
      this.error(`Error fetching ${type} from API`, error);
      return [];
    }
  }

  async getAnnouncements(): Promise<AnnouncementData[]> {
    const announcements = await this.fetchFromApi("announcement");
    return announcements.filter((announcement: AnnouncementData) => {
      if (!announcement.isActive) return false;
      // Tampilkan jika belum ada endDate, atau endDate >= hari ini
      if (!announcement.endDate) return true;
      try {
        const now = new Date();
        let endDate = new Date(announcement.endDate);
        endDate.setHours(23, 59, 59, 999);
        return now <= endDate;
      } catch {
        return true;
      }
    });
  }

  async getGalleryItems(): Promise<GalleryData[]> {
    const items = await this.fetchFromApi("gallery");
    // Data sudah array of object, cukup filter
    return items.filter((item) => item.isActive);
  }

  async getActivities(): Promise<ActivityData[]> {
    const rows = await this.fetchFromApi("activity");
    return rows.filter((activity) => activity.isActive);
  }

  async getActivityById(id: string): Promise<ActivityData | null> {
    const activities = await this.getActivities();
    return activities.find((activity) => activity.id === id) || null;
  }

  async getArticles(): Promise<ArticleData[]> {
    const rows = await this.fetchFromApi("article");
    return rows.filter((article) => article.isActive);
  }

  async getArticleById(id: string): Promise<ArticleData | null> {
    const articles = await this.getArticles();
    return articles.find((article) => article.id === id) || null;
  }
  async getFinanceData(): Promise<FinanceData[]> {
    const items = await this.fetchFromApi("finance");
    return items
      .filter((finance) => finance.fund === "Ummat")
      .sort((a, b) => {
        const dateA = this.parseDate(a.date);
        const dateB = this.parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  }

  private parseRowToAnnouncement(row: string[]): AnnouncementData {
    return {
      id: row[0] || "",
      title: row[1] || "",
      content: row[2] || "",
      category: (row[3] as "urgent" | "info" | "event") || "info",
      startDate: row[4] || "",
      endDate: row[5] || "",
      isActive: row[6]?.toLowerCase() === "true",
      buttonText: row[7] || "",
      buttonLink: row[8] || "",
    };
  }

  private parseRowToGallery(row: string[]): GalleryData {
    return {
      id: row[0] || "",
      title: row[1] || "",
      imageUrl: row[2] || "",
      description: row[3] || "",
      category: row[4] || "",
      date: row[5] || "",
      isActive: row[6]?.toLowerCase() === "true",
    };
  }

  private parseRowToActivity(row: string[]): ActivityData {
    return {
      id: row[0] || "",
      title: row[1] || "",
      description: row[2] || "",
      category: (row[3] as "rutin" | "khusus" | "jadwal") || "rutin",
      imageUrl: row[4] || "",
      schedule: row[5] || "",
      location: row[6] || "",
      participants: row[7] || "",
      instructor: row[8] || "",
      isActive: row[9]?.toLowerCase() === "true",
    };
  }

  private parseRowToArticle(row: string[]): ArticleData {
    return {
      id: row[0] || "",
      title: row[1] || "",
      author: row[2] || "",
      date: row[3] || "",
      category: row[4] || "",
      content: row[5] || "",
      imageUrl: row[6] || "",
      isActive: row[7]?.toLowerCase() === "true",
    };
  }
  // Update parseRowToFinance untuk consistent date formatting
  private parseRowToFinance(row: string[], index: number): FinanceData {
    const income = this.parseCurrency(row[2] || "0");
    const expense = this.parseCurrency(row[3] || "0");

    // Parse dan format ulang tanggal untuk konsistensi
    const originalDate = row[0] || "";
    const parsedDate = this.parseDate(originalDate);
    const formattedDate = this.formatDateToIndonesian(parsedDate);

    return {
      id: (index + 1).toString(),
      date: formattedDate, // Use formatted date
      description: row[1] || "",
      income: income,
      expense: expense,
      fund: (row[4] as "Ummat" | "Kas") || "Ummat",
      formattedIncome: this.formatCurrency(income),
      formattedExpense: this.formatCurrency(expense),
    };
  }

  async getFinanceSummary(): Promise<FinanceSummary> {
    const financeData = await this.getFinanceData();

    const totalIncome = financeData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = financeData.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const balance = totalIncome - totalExpense;

    const summary: FinanceSummary = {
      totalIncome,
      totalExpense,
      balance,
      formattedTotalIncome: this.formatCurrency(totalIncome),
      formattedTotalExpense: this.formatCurrency(totalExpense),
      formattedBalance: this.formatCurrency(balance),
      transactionCount: financeData.length,
      lastUpdated: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    this.log("Finance summary calculated:", summary);
    return summary;
  }

  // Helper function untuk filter berdasarkan periode
  private filterByPeriod(
    data: FinanceData[],
    period: "week" | "month" | "year" | "all"
  ): FinanceData[] {
    if (period === "all") return data;

    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        // startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return data.filter((item) => {
      const itemDate = this.parseDate(item.date);
      return itemDate >= startDate;
    });
  }

  // Helper function untuk pagination
  private paginateData<T>(
    data: T[],
    page: number,
    itemsPerPage: number
  ): PaginatedFinanceData {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData as FinanceData[],
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  // Update sorting untuk menggunakan parsed date
  private sortData(
    data: FinanceData[],
    field: "date" | "description" | "income" | "expense",
    direction: "asc" | "desc"
  ): FinanceData[] {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case "date":
          // Use parsed date for accurate sorting
          aValue = this.parseDate(a.date).getTime();
          bValue = this.parseDate(b.date).getTime();
          break;
        case "description":
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case "income":
          aValue = a.income;
          bValue = b.income;
          break;
        case "expense":
          aValue = a.expense;
          bValue = b.expense;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  async getFinanceDataPaginated(
    filter: FinanceFilter
  ): Promise<PaginatedFinanceData> {
    // Get all finance data
    const allData = await this.getFinanceData();

    // Filter by period
    const filteredData = this.filterByPeriod(allData, filter.period);

    // Apply sorting
    const sortedData = this.sortData(
      filteredData,
      filter.sortField,
      filter.sortDirection
    );

    // Apply pagination
    const paginatedResult = this.paginateData(
      sortedData,
      filter.page,
      filter.itemsPerPage
    );

    this.log(
      `Finance data: ${filteredData.length} items → sorted by ${filter.sortField} (${filter.sortDirection}) → page ${filter.page}/${paginatedResult.totalPages}`
    );

    return paginatedResult;
  }

  async getFinanceSummaryByPeriod(
    period: "week" | "month" | "year" | "all"
  ): Promise<FinanceSummary> {
    const allData = await this.getFinanceData();
    const filteredData = this.filterByPeriod(allData, period);

    const totalIncome = filteredData.reduce(
      (sum, item) => sum + item.income,
      0
    );
    const totalExpense = filteredData.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const balance = totalIncome - totalExpense;

    const periodLabels = {
      week: "Seminggu Terakhir",
      month: "Sebulan Terakhir",
      year: "Setahun Terakhir",
      all: "Semua Periode",
    };

    const summary: FinanceSummary = {
      totalIncome,
      totalExpense,
      balance,
      formattedTotalIncome: this.formatCurrency(totalIncome),
      formattedTotalExpense: this.formatCurrency(totalExpense),
      formattedBalance: this.formatCurrency(balance),
      transactionCount: filteredData.length,
      lastUpdated: `${periodLabels[period]} - ${new Date().toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )}`,
    };

    this.log(`Finance summary calculated for ${period}:`, summary);
    return summary;
  }

  // Helper function untuk format tanggal Indonesia
  private getCurrentDateTimeString(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("id-ID", options);
    const parts = formatter.formatToParts(now);

    // Format: DD/MM/YYYY HH:mm:ss
    const day = parts.find((part) => part.type === "day")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const year = parts.find((part) => part.type === "year")?.value;
    const hour = parts.find((part) => part.type === "hour")?.value;
    const minute = parts.find((part) => part.type === "minute")?.value;
    const second = parts.find((part) => part.type === "second")?.value;

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  // In the submitContactForm method, update this part:

  // Replace submitContactForm dengan version ini:

  async submitContactForm(
    contactData: Omit<ContactData, "tanggal">
  ): Promise<ContactSubmissionResponse> {
    try {
      // Validate required fields
      if (
        !contactData.nama ||
        !contactData.email ||
        !contactData.subjek ||
        !contactData.pesan
      ) {
        throw new Error("Semua field harus diisi");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email)) {
        throw new Error("Format email tidak valid");
      }

      const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

      if (!APPS_SCRIPT_URL) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          success: true,
          message: "Pesan Anda telah diterima! (Mode demo)",
          data: { ...contactData, tanggal: this.getCurrentDateTimeString() },
        };
      }

      // Submit to Google Apps Script
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
        mode: "no-cors",
      });

      // Assume success for opaque response (no-cors mode)
      if (response.type === "opaque") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return {
          success: true,
          message:
            "Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.",
          data: { ...contactData, tanggal: this.getCurrentDateTimeString() },
        };
      }

      throw new Error("Gagal mengirim pesan. Silakan coba lagi.");
    } catch (error) {
      // Silent error handling
      let errorMessage = "Terjadi kesalahan saat mengirim pesan.";

      if (error instanceof Error) {
        if (
          error.message.includes("field harus diisi") ||
          error.message.includes("email tidak valid")
        ) {
          errorMessage = error.message;
        } else if (error.name === "TypeError") {
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        }
      }

      return {
        success: false,
        message: errorMessage + " Atau hubungi kami langsung via WhatsApp.",
      };
    }
  }
}

export const googleSheetsService = GoogleSheetsService.getInstance();
