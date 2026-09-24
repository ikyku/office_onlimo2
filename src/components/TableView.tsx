import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Station, WaterQualityStatus } from '../types/onlimo';
import { STATUS_SUMMARIES } from '../data/mockStations';
import { WaterQualityStatusIcon } from './Sidebar';

interface TableViewProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  onSwitchToDashboard: () => void;
}

export const TableView: React.FC<TableViewProps> = ({
  stations,
  onSelectStation,
  onSwitchToDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WaterQualityStatus | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Station>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique provinces
  const provinces = useMemo(() => {
    return Array.from(new Set(stations.map((s) => s.province))).sort();
  }, [stations]);

  // Filtered and Sorted list
  const processedStations = useMemo(() => {
    return stations
      .filter((station) => {
        const matchesSearch =
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.river.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.das.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.code.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          selectedStatus === 'all' || station.status === selectedStatus;

        const matchesProvince =
          selectedProvince === 'all' || station.province === selectedProvince;

        return matchesSearch && matchesStatus && matchesProvince;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [stations, searchQuery, selectedStatus, selectedProvince, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(processedStations.length / itemsPerPage) || 1;
  const paginatedStations = processedStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Station) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Kode Stasiun',
      'Nama Stasiun',
      'DAS',
      'Sungai',
      'Provinsi',
      'Kabupaten/Kota',
      'Status',
      'Indeks Pencemaran (IP)',
      'pH',
      'DO (mg/L)',
      'BOD (mg/L)',
      'COD (mg/L)',
      'TSS (mg/L)',
      'Suhu (°C)',
      'Terakhir Update',
    ];

    const rows = processedStations.map((s) => [
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.das}"`,
      `"${s.river}"`,
      `"${s.province}"`,
      `"${s.city}"`,
      `"${s.status}"`,
      s.ipScore,
      s.parameters.ph,
      s.parameters.do,
      s.parameters.bod,
      s.parameters.cod,
      s.parameters.tss,
      s.parameters.temp,
      `"${s.lastUpdate}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `onlimo_monitoring_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: WaterQualityStatus) => {
    const summary = STATUS_SUMMARIES.find((s) => s.status === status);
    if (!summary) return null;

    let badgeClass = 'bg-[#F1F3F5] text-[#64748b] dark:bg-slate-800 dark:text-slate-300 border border-gray-200 dark:border-slate-700';

    if (status === 'baku_mutu' || status === 'memenuhi_baku_mutu') {
      badgeClass = 'bg-[#E8F8EE] text-[#16a34a] dark:bg-emerald-950/60 dark:text-emerald-300 border border-[#bbf7d0] dark:border-emerald-700';
    } else if (status === 'cemar_ringan') {
      badgeClass = 'bg-[#EBF2FE] text-[#2563eb] dark:bg-blue-950/60 dark:text-blue-300 border border-[#bfdbfe] dark:border-blue-700';
    } else if (status === 'cemar_sedang') {
      badgeClass = 'bg-[#FEF9E8] text-[#d97706] dark:bg-amber-950/60 dark:text-amber-300 border border-[#fde68a] dark:border-amber-700';
    } else if (status === 'cemar_berat') {
      badgeClass = 'bg-[#FEECEC] text-[#ef4444] dark:bg-red-950/60 dark:text-red-300 border border-[#fecaca] dark:border-red-700';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${badgeClass}`}>
        <WaterQualityStatusIcon status={status} className="w-3.5 h-3.5 shrink-0" />
        <span>{summary.label}</span>
      </span>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-slate-950 flex flex-col p-4 md:p-6 overflow-y-auto">
      {/* Table Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Daftar Stasiun Monitoring Kualitas Air</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
              {processedStations.length} Stasiun
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Data pemantauan kontinyu real-time kualitas air sungai seluruh Indonesia
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="min-h-[32px] h-8 flex items-center gap-1.5 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onSwitchToDashboard}
            className="min-h-[32px] h-8 flex items-center gap-1.5 px-3 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#c75300] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Buka di Peta</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-gray-200 dark:border-slate-800 mb-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama stasiun, sungai, DAS, atau daerah..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-slate-200"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as WaterQualityStatus | 'all');
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="baku_mutu">Memenuhi Baku Mutu</option>
            <option value="cemar_ringan">Cemar Ringan</option>
            <option value="cemar_sedang">Cemar Sedang</option>
            <option value="cemar_berat">Cemar Berat</option>
            <option value="tanpa_data">Tanpa Data</option>
          </select>

          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none text-gray-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Semua Provinsi</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700/80 text-gray-600 dark:text-slate-300 font-semibold select-none">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3.5 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Stasiun & Lokasi</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('das')}
                  className="py-3 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>DAS & Sungai</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('province')}
                  className="py-3 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white hidden sm:table-cell"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Provinsi & Kab/Kota</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status Mutu Air</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ipScore')}
                  className="py-3 px-3 cursor-pointer hover:text-gray-900 dark:hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Nilai IP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center hidden md:table-cell">pH</th>
                <th className="py-3 px-3 text-center hidden md:table-cell">DO (mg/L)</th>
                <th className="py-3 px-3 text-center hidden lg:table-cell">BOD (mg/L)</th>
                <th className="py-3 px-3 text-center hidden lg:table-cell">COD (mg/L)</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginatedStations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    Tidak ada stasiun yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedStations.map((station) => (
                  <tr
                    key={station.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {station.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {station.code}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-gray-800 dark:text-slate-200 font-medium">
                        {station.river}
                      </div>
                      <div className="text-xs text-gray-500">{station.das}</div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell">
                      <div className="text-gray-800 dark:text-slate-200">
                        {station.city}
                      </div>
                      <div className="text-xs text-gray-500">{station.province}</div>
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(station.status)}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900 dark:text-white">
                      {station.status === 'tanpa_data' ? '-' : station.ipScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-700 dark:text-slate-300 hidden md:table-cell">
                      {station.status === 'tanpa_data' ? '-' : station.parameters.ph}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-700 dark:text-slate-300 hidden md:table-cell">
                      {station.status === 'tanpa_data' ? '-' : station.parameters.do}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-700 dark:text-slate-300 hidden lg:table-cell">
                      {station.status === 'tanpa_data' ? '-' : station.parameters.bod}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-700 dark:text-slate-300 hidden lg:table-cell">
                      {station.status === 'tanpa_data' ? '-' : station.parameters.cod}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={() => {
                          onSelectStation(station);
                          onSwitchToDashboard();
                        }}
                        className="inline-flex min-h-[32px] h-8 items-center gap-1 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                        title="Tinjau stasiun di peta"
                      >
                        <span>Tinjau</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-gray-50 dark:bg-slate-800/60 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
          <div>
            Menampilkan{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {processedStations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, processedStations.length)}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {processedStations.length}
            </span>{' '}
            stasiun
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="min-h-[32px] min-w-[32px] h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Hal {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="min-h-[32px] min-w-[32px] h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
