import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  Activity,
  Wifi,
  WifiOff,
  Thermometer,
  Droplet,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Station } from '../types/onlimo';
import { STATUS_SUMMARIES } from '../data/mockStations';

interface StationDetailModalProps {
  station: Station | null;
  onClose: () => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
}) => {
  if (!station) return null;

  const statusSummary = STATUS_SUMMARIES.find((s) => s.status === station.status);

  // Parameter threshold checks
  const getParamStatus = (name: string, value: number) => {
    if (station.status === 'tanpa_data') return { text: 'Tanpa Data', color: 'text-gray-400' };
    switch (name) {
      case 'ph':
        return value >= 6.0 && value <= 9.0
          ? { text: 'Normal', color: 'text-emerald-600 dark:text-emerald-400' }
          : { text: 'Melebihi Baku Mutu', color: 'text-rose-600 dark:text-rose-400' };
      case 'do':
        return value >= 4.0
          ? { text: 'Baik (≥4 mg/L)', color: 'text-emerald-600 dark:text-emerald-400' }
          : { text: 'Rendah (<4 mg/L)', color: 'text-rose-600 dark:text-rose-400' };
      case 'bod':
        return value <= 3.0
          ? { text: 'Normal (≤3 mg/L)', color: 'text-emerald-600 dark:text-emerald-400' }
          : { text: 'Tinggi (>3 mg/L)', color: 'text-rose-600 dark:text-rose-400' };
      case 'cod':
        return value <= 25.0
          ? { text: 'Normal (≤25 mg/L)', color: 'text-emerald-600 dark:text-emerald-400' }
          : { text: 'Tinggi (>25 mg/L)', color: 'text-rose-600 dark:text-rose-400' };
      case 'tss':
        return value <= 50.0
          ? { text: 'Normal (≤50 mg/L)', color: 'text-emerald-600 dark:text-emerald-400' }
          : { text: 'Keruh (>50 mg/L)', color: 'text-rose-600 dark:text-rose-400' };
      default:
        return { text: 'Normal', color: 'text-emerald-600' };
    }
  };

  // Mock 24-hr historical points
  const sparklineData = [
    { hour: '00:00', val: (station.ipScore * 0.9).toFixed(1) },
    { hour: '04:00', val: (station.ipScore * 0.95).toFixed(1) },
    { hour: '08:00', val: (station.ipScore * 1.05).toFixed(1) },
    { hour: '12:00', val: (station.ipScore * 1.1).toFixed(1) },
    { hour: '16:00', val: (station.ipScore * 1.0).toFixed(1) },
    { hour: '20:00', val: (station.ipScore * 0.98).toFixed(1) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                {station.code}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {station.isOnline ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Wifi className="w-3.5 h-3.5" /> Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                    <WifiOff className="w-3.5 h-3.5" /> Terputus
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
              {station.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {station.river} &bull; {station.das} &bull; {station.city}, {station.province}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Status & Indeks Pencemaran Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              statusSummary ? `${statusSummary.bgColor} ${statusSummary.borderColor}` : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0"
                style={{ backgroundColor: statusSummary?.color || '#64748b' }}
              >
                {station.badgeNumber}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                  Status Kualitas Air:
                </span>
                <h4
                  className="text-base font-extrabold"
                  style={{ color: statusSummary?.color }}
                >
                  {statusSummary?.label}
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {statusSummary?.description}
                </p>
              </div>
            </div>

            <div className="sm:text-right bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-gray-200/50 dark:border-slate-700/50">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                Indeks Pencemaran (IP)
              </div>
              <div className="text-xl font-black text-gray-900 dark:text-white">
                {station.status === 'tanpa_data' ? '-' : station.ipScore.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">PP No. 22 Th. 2021</div>
            </div>
          </div>

          {/* Telemetry Sensor Parameters Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Parameter Telemetri Kualitas Air</span>
              </h5>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Update: {station.lastUpdate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* pH */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Derajat Keasaman (pH)</span>
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : station.parameters.ph}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Baku mutu: 6.0 - 9.0</div>
                <div className={`text-xs font-semibold mt-1 ${getParamStatus('ph', station.parameters.ph).color}`}>
                  {getParamStatus('ph', station.parameters.ph).text}
                </div>
              </div>

              {/* DO */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>DO (Oksigen Terlarut)</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : `${station.parameters.do} mg/L`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Baku mutu: ≥ 4.0 mg/L</div>
                <div className={`text-xs font-semibold mt-1 ${getParamStatus('do', station.parameters.do).color}`}>
                  {getParamStatus('do', station.parameters.do).text}
                </div>
              </div>

              {/* BOD */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>BOD</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : `${station.parameters.bod} mg/L`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Baku mutu: ≤ 3.0 mg/L</div>
                <div className={`text-xs font-semibold mt-1 ${getParamStatus('bod', station.parameters.bod).color}`}>
                  {getParamStatus('bod', station.parameters.bod).text}
                </div>
              </div>

              {/* COD */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>COD</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : `${station.parameters.cod} mg/L`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Baku mutu: ≤ 25.0 mg/L</div>
                <div className={`text-xs font-semibold mt-1 ${getParamStatus('cod', station.parameters.cod).color}`}>
                  {getParamStatus('cod', station.parameters.cod).text}
                </div>
              </div>

              {/* TSS */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>TSS (Padatan Terlarut)</span>
                  <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : `${station.parameters.tss} mg/L`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Baku mutu: ≤ 50.0 mg/L</div>
                <div className={`text-xs font-semibold mt-1 ${getParamStatus('tss', station.parameters.tss).color}`}>
                  {getParamStatus('tss', station.parameters.tss).text}
                </div>
              </div>

              {/* Suhu */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Suhu Air</span>
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                  {station.status === 'tanpa_data' ? '-' : `${station.parameters.temp} °C`}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Deviasi baku mutu: 3 °C</div>
                <div className="text-xs font-semibold text-emerald-600 mt-1">Normal</div>
              </div>
            </div>
          </div>

          {/* 24-Hour Trend Sparkline */}
          <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200/70 dark:border-slate-700/70">
            <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 mb-3">
              Tren Indeks Pencemaran 24 Jam Terakhir
            </h5>
            <div className="flex items-end justify-between h-20 pt-2 gap-2">
              {sparklineData.map((item, idx) => {
                const heightPercent = Math.min(
                  100,
                  Math.max(20, (parseFloat(item.val) / 15) * 100)
                );
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      className="w-full max-w-[28px] rounded-t-md transition-all duration-300"
                      style={{
                        height: `${station.status === 'tanpa_data' ? 8 : heightPercent}%`,
                        backgroundColor: statusSummary?.color || '#3b82f6',
                        opacity: 0.85,
                      }}
                    />
                    <span className="text-xs font-mono text-gray-500 dark:text-slate-400 mt-1">
                      {item.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Koordinat: {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
