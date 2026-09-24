import React from 'react';
import { WaterQualityStatus } from '../types/onlimo';

export interface StatusVisualConfig {
  status: WaterQualityStatus | string;
  label: string;
  startColor: string;
  midColor: string;
  endColor: string;
  ringGlow: string;
  hexColor: string;
  textColor: string;
  bgLight: string;
}

export const getStatusVisualConfig = (
  status: WaterQualityStatus | string
): StatusVisualConfig => {
  switch (status) {
    case 'baku_mutu':
    case 'memenuhi_baku_mutu':
      return {
        status: 'baku_mutu',
        label: 'Memenuhi Baku Mutu',
        startColor: '#00D25B',
        midColor: '#00BA4E',
        endColor: '#00993D',
        ringGlow: 'rgba(0, 210, 91, 0.4)',
        hexColor: '#16a34a',
        textColor: 'text-[#16a34a] dark:text-emerald-400',
        bgLight: 'bg-[#E8F8EE] dark:bg-emerald-950/60',
      };
    case 'cemar_ringan':
      return {
        status: 'cemar_ringan',
        label: 'Cemar Ringan',
        startColor: '#3B82F6',
        midColor: '#2563EB',
        endColor: '#1D4ED8',
        ringGlow: 'rgba(37, 99, 235, 0.4)',
        hexColor: '#2563eb',
        textColor: 'text-[#2563eb] dark:text-blue-400',
        bgLight: 'bg-[#EBF2FE] dark:bg-blue-950/60',
      };
    case 'cemar_sedang':
      return {
        status: 'cemar_sedang',
        label: 'Cemar Sedang',
        startColor: '#FFCA28',
        midColor: '#F59E0B',
        endColor: '#D97706',
        ringGlow: 'rgba(245, 158, 11, 0.4)',
        hexColor: '#d97706',
        textColor: 'text-[#d97706] dark:text-amber-400',
        bgLight: 'bg-[#FEF9E8] dark:bg-amber-950/60',
      };
    case 'cemar_berat':
      return {
        status: 'cemar_berat',
        label: 'Cemar Berat',
        startColor: '#FF453A',
        midColor: '#E52E2E',
        endColor: '#B91C1C',
        ringGlow: 'rgba(229, 46, 46, 0.4)',
        hexColor: '#ef4444',
        textColor: 'text-[#ef4444] dark:text-red-400',
        bgLight: 'bg-[#FEECEC] dark:bg-red-950/60',
      };
    case 'tanpa_data':
    default:
      return {
        status: 'tanpa_data',
        label: 'Tanpa Data / Invalid',
        startColor: '#5B6473',
        midColor: '#475060',
        endColor: '#333A46',
        ringGlow: 'rgba(100, 116, 139, 0.4)',
        hexColor: '#64748b',
        textColor: 'text-[#64748b] dark:text-slate-400',
        bgLight: 'bg-[#F1F3F5] dark:bg-slate-800',
      };
  }
};

/**
 * Returns raw SVG / HTML string for Leaflet markers matching the 4 uploaded Frame images
 * + the existing green badge for Baku Mutu.
 */
export const renderWeatherIconHtml = (
  isSelected: boolean,
  stationId: string,
  status: WaterQualityStatus | string
): string => {
  const config = getStatusVisualConfig(status);
  const uid = `${stationId.replace(/[^a-zA-Z0-9_-]/g, '_')}_${config.status}`;

  return `
    <div class="weather-station-marker ${isSelected ? 'is-selected' : ''}">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Status Circular Gradient Background -->
          <linearGradient id="bgGrad_${uid}" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${config.startColor}" />
            <stop offset="55%" stop-color="${config.midColor}" />
            <stop offset="100%" stop-color="${config.endColor}" />
          </linearGradient>
          <!-- Sun Gradient -->
          <linearGradient id="sunGrad_${uid}" x1="12" y1="10" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFF266" />
            <stop offset="100%" stop-color="#FF9900" />
          </linearGradient>
          <!-- Cloud Gradient -->
          <linearGradient id="cloudGrad_${uid}" x1="12" y1="18" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>
        <!-- White Outer Halo Ring -->
        <circle cx="20" cy="20" r="18.5" fill="#FFFFFF" />
        <!-- Status Colored Circular Body -->
        <circle cx="20" cy="20" r="16.5" fill="url(#bgGrad_${uid})" />
        <!-- Glowing Sun -->
        <circle cx="17.5" cy="16.5" r="5.8" fill="url(#sunGrad_${uid})" />
        <!-- Soft Sunshine Rays -->
        <path d="M17.5 8.5v1.8M17.5 22.7v1.8M9.5 16.5h1.8M23.7 16.5h1.8M11.8 10.8l1.3 1.3M21.9 20.9l1.3 1.3M11.8 22.2l1.3-1.3M21.9 12.1l1.3-1.3" stroke="#FFF566" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
        <!-- Fluffy White Cloud -->
        <ellipse cx="23" cy="20" rx="4.5" ry="3.8" fill="#F1F5F9" opacity="0.95" />
        <path d="M13.2 24.5C13.2 22 15 20 17.5 20c.5 0 1 .1 1.5.3 1-2.2 3.1-3.6 5.5-3.3 2.5.3 4.4 2.3 4.5 4.8.4.1.8.3 1.1.7 1.4 1.2 1.8 3.1 1 4.7-.7 1.3-2 2.1-3.6 2.1H15.5c-1.3 0-2.3-1-2.3-2.3v-2.5z" fill="url(#cloudGrad_${uid})" />
        <path d="M14 25.5h14c1 0 1.8-.7 1.8-1.6 0-.2-.04-.4-.1-.5-.5.4-1.2.6-1.9.6H15.5c-.9 0-1.7-.4-2-.9-.2.3-.3.6-.3.9 0 .8.7 1.5 1.5 1.5z" fill="#CBD5E1" opacity="0.7"/>
      </svg>
      ${
        isSelected
          ? `
        <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff6900] border-2 border-white rounded-full animate-ping"></div>
        <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff6900] border-2 border-white rounded-full"></div>
      `
          : ''
      }
    </div>
  `;
};

/**
 * Reusable React component for WeatherStationBadge icon matching the uploaded frames
 */
export const WeatherStationBadge: React.FC<{
  status: WaterQualityStatus | string;
  size?: number;
  className?: string;
  isSelected?: boolean;
}> = ({ status, size = 24, className = '', isSelected = false }) => {
  const config = getStatusVisualConfig(status);
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={config.label}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id={`stReactGrad_${uid}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={config.startColor} />
            <stop offset="55%" stopColor={config.midColor} />
            <stop offset="100%" stopColor={config.endColor} />
          </linearGradient>
          <linearGradient id={`sunReactGrad_${uid}`} x1="12" y1="10" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF266" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>
          <linearGradient id={`cloudReactGrad_${uid}`} x1="12" y1="18" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
        {/* White Outer Halo Ring */}
        <circle cx="20" cy="20" r="18.5" fill="#FFFFFF" />
        {/* Colored Circle Body */}
        <circle cx="20" cy="20" r="16.5" fill={`url(#stReactGrad_${uid})`} />
        {/* Glowing Sun */}
        <circle cx="17.5" cy="16.5" r="5.8" fill={`url(#sunReactGrad_${uid})`} />
        {/* Sunshine Rays */}
        <path
          d="M17.5 8.5v1.8M17.5 22.7v1.8M9.5 16.5h1.8M23.7 16.5h1.8M11.8 10.8l1.3 1.3M21.9 20.9l1.3 1.3M11.8 22.2l1.3-1.3M21.9 12.1l1.3-1.3"
          stroke="#FFF566"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Cloud Body */}
        <ellipse cx="23" cy="20" rx="4.5" ry="3.8" fill="#F1F5F9" opacity="0.95" />
        <path
          d="M13.2 24.5C13.2 22 15 20 17.5 20c.5 0 1 .1 1.5.3 1-2.2 3.1-3.6 5.5-3.3 2.5.3 4.4 2.3 4.5 4.8.4.1.8.3 1.1.7 1.4 1.2 1.8 3.1 1 4.7-.7 1.3-2 2.1-3.6 2.1H15.5c-1.3 0-2.3-1-2.3-2.3v-2.5z"
          fill={`url(#cloudReactGrad_${uid})`}
        />
        <path
          d="M14 25.5h14c1 0 1.8-.7 1.8-1.6 0-.2-.04-.4-.1-.5-.5.4-1.2.6-1.9.6H15.5c-.9 0-1.7-.4-2-.9-.2.3-.3.6-.3.9 0 .8.7 1.5 1.5 1.5z"
          fill="#CBD5E1"
          opacity="0.7"
        />
      </svg>
      {isSelected && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff6900] border border-white rounded-full"></span>
      )}
    </div>
  );
};
