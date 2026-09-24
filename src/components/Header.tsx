import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Table as TableIcon,
  LogIn,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Menu,
  X,
  Droplets,
} from 'lucide-react';

interface HeaderProps {
  viewMode: 'dashboard' | 'table';
  setViewMode: (mode: 'dashboard' | 'table') => void;
  onOpenLogin: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onToggleSidebarMobile?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onOpenLogin,
  isDarkMode,
  toggleDarkMode,
  onToggleSidebarMobile,
  isMobileSidebarOpen,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Indonesian e.g. "28 Agustus 2025 11:42:23 WIB"
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      const day = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setCurrentDateTime(`${day} ${month} ${year} ${hours}:${minutes}:${seconds} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header
      className={`h-16 w-full ${
        isDarkMode
          ? 'bg-[#0f172a] border-slate-800 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      } border-b flex items-center justify-between px-3 md:px-5 shadow-xs z-30 transition-colors duration-200`}
    >
      {/* Left: KLHK / BPLH Branding */}
      <div className="flex items-center gap-3">
        {/* Emblem Badge */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0a2540] text-emerald-400 shadow-sm border border-slate-700 shrink-0">
          <div className="flex flex-col items-center justify-center leading-none">
            <Droplets className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            <span className="text-[12px] tracking-tight font-semibold text-blue-300">JBT</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <h1
            className={`text-[14px] font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } leading-tight line-clamp-1`}
          >
            Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[12px] ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } font-medium`}
            >
              Online Monitoring
            </span>
            <span
              className={`text-[12px] font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              (ONLIMO)
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline-block text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Ticker, View Toggle, Login, Dark Mode */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Real-time Indonesian clock display */}
        <div
          className={`hidden lg:flex items-center text-[12px] font-medium ${
            isDarkMode
              ? 'text-slate-300 bg-slate-800/80 border-slate-700'
              : 'text-gray-700 bg-gray-50 border-gray-200/90'
          } font-mono tracking-tight px-2.5 py-1.5 rounded-md border`}
        >
          {currentDateTime || 'Memuat waktu...'}
        </div>

        {/* View Mode Switcher: Dashboard / Table */}
        <div
          className={`flex items-center ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'
          } p-0.5 rounded-lg border text-[12px] font-medium`}
        >
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`min-h-[32px] h-8 flex items-center gap-1.5 px-3 rounded-md transition-all cursor-pointer ${
              viewMode === 'dashboard'
                ? isDarkMode
                  ? 'bg-slate-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-gray-900 shadow-xs font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tampilan Peta Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`min-h-[32px] h-8 flex items-center gap-1.5 px-3 rounded-md transition-all cursor-pointer ${
              viewMode === 'table'
                ? isDarkMode
                  ? 'bg-slate-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-gray-900 shadow-xs font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tampilan Tabel Data"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>

        {/* "Masuk" (Login) Button - Primary brand color #ff6900 */}
        <button
          type="button"
          onClick={onOpenLogin}
          className="min-h-[32px] h-8 flex items-center gap-1.5 px-3.5 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white text-[12px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          title="Masuk ke Akun ONLIMO"
        >
          <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Masuk</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className={`min-h-[32px] min-w-[32px] h-8 w-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? 'text-amber-400 hover:bg-slate-800'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
          aria-label="Toggle Dark Mode"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`hidden md:flex min-h-[32px] min-w-[32px] h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="Toggle Fullscreen"
          title="Layar Penuh"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>

        {/* Mobile Sidebar Toggle Button */}
        {onToggleSidebarMobile && (
          <button
            type="button"
            onClick={onToggleSidebarMobile}
            className={`md:hidden min-h-[32px] min-w-[32px] h-8 w-8 flex items-center justify-center rounded-lg cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Toggle Sidebar Menu"
            title="Buka Panel Statistik"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
};
