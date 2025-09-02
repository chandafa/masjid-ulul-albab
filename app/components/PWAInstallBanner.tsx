interface PWAInstallBannerProps {
  showInstallBanner: boolean;
  onInstallClick: () => void;
  onDismiss: () => void;
}

export default function PWAInstallBanner({
  showInstallBanner,
  onInstallClick,
  onDismiss,
}: PWAInstallBannerProps) {
  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-2xl mr-3">📱</span>
        <div>
          <p className="font-medium">Install Aplikasi</p>
          <p className="text-sm text-green-100">
            Akses lebih cepat ke website masjid
          </p>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={onInstallClick}
          className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          Install
        </button>
        <button
          onClick={onDismiss}
          className="text-green-100 hover:text-white px-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
