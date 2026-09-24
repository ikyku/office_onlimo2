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
    <header className="h-16 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-3 md:px-5 shadow-xs z-30 transition-colors">
      {/* Left: KLHK / BPLH Branding */}
      <div className="flex items-center gap-3">
        {/* Emblem Badge matching the circular navy logo in screenshot */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#0a2540] text-emerald-400 shadow-sm border border-slate-700 shrink-0">
          <div className="flex flex-col items-center justify-center leading-none">
            <Droplets className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            <span className="text-xs tracking-tight font-extrabold text-blue-300">JBT</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
            Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Online Monitoring
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              (ONLIMO)
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline-block text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Ticker, View Toggle, Login, Dark Mode */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Real-time Indonesian clock display */}
        <div className="hidden lg:flex items-center text-xs font-medium text-gray-600 dark:text-slate-300 font-mono tracking-tight bg-gray-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-gray-200/80 dark:border-slate-700">
          {currentDateTime || 'Memuat waktu...'}
        </div>

        {/* View Mode Switcher: Dashboard / Table */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
              viewMode === 'dashboard'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Tampilan Peta Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs font-semibold'
                : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Tampilan Tabel Data"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>

        {/* "Masuk" (Login) Button - Orange themed matching screenshot */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E65100] hover:bg-[#D84315] active:bg-[#BF360C] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          title="Masuk ke Akun ONLIMO"
        >
          <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Masuk</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Dark Mode"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hidden md:flex p-1.5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
            onClick={onToggleSidebarMobile}
            className="md:hidden p-1.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
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
