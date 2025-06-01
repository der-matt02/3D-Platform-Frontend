// src/types/quote.ts

export interface PrinterData {
  name: string;
  watts: number;
  type: string;
  speed: number;
  nozzle: string;
  layer: number;
  bed_temperature: number;
  hotend_temperature: number;
  hourly_cost: number;
}

export interface FilamentData {
  name: string;
  type: string;
  diameter: number;
  price_per_kg: number;
  color: string;
  total_weight: number;
}

export interface EnergyData {
  kwh_cost: number;
}

export interface ModelData {
  model_weight: number;
  print_time: number;
  infill: number;
  supports: boolean;
  support_type: string | null;
  support_weight: number;
  layer_height: number;
}

export interface CommercialData {
  labor: number;
  post_processing: number;
  margin: number;
  taxes: number;
}

export interface SummaryData {
  total: number;
  // Si el backend devuelve más campos de desglose, agrégalos aquí.
}

export interface Quote {
  _id: string;         // MongoDB usa "_id" por defecto
  user_id: string;
  quote_name: string;
  printer: PrinterData;
  filament: FilamentData;
  energy: EnergyData;
  model: ModelData;
  commercial: CommercialData;
  summary: SummaryData;
  created_at: string;
  updated_at: string;
}
