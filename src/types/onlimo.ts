export type WaterQualityStatus =
  | 'baku_mutu'
  | 'memenuhi_baku_mutu'
  | 'cemar_ringan'
  | 'cemar_sedang'
  | 'cemar_berat'
  | 'tanpa_data';

export interface StationParameter {
  ph: number;
  do: number; // Dissolved Oxygen (mg/L)
  bod: number; // Biochemical Oxygen Demand (mg/L)
  cod: number; // Chemical Oxygen Demand (mg/L)
  tss: number; // Total Suspended Solids (mg/L)
  temp: number; // Temperature (°C)
}

export interface ParameterThreshold {
  name: string;
  unit: string;
  bakuMutu: string;
  min?: number;
  max?: number;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  das: string;
  river: string;
  province: string;
  city: string;
  district?: string; // Kecamatan
  subdistrict?: string; // Kelurahan/Desa
  lat: number;
  lng: number;
  displayLat?: string;
  displayLng?: string;
  status: WaterQualityStatus;
  ipScore: number; // Indeks Pencemaran (IP)
  badgeNumber: string; // "999" from UI
  parameters: StationParameter;
  lastUpdate: string;
  isOnline: boolean;
}

export interface MonitoringMetrics {
  das: string;
  sungai: string;
  stasiun: string;
  provinsi: string;
  kabupaten: string;
}

export interface StatusSummary {
  status: WaterQualityStatus;
  label: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  count: string;
  description: string;
}
