// src/types/schema.ts

// Nota: ajusta los tipos (string, number, boolean) para que coincidan con los de tu backend.
//       Si tu backend espera exactamente estos campos, aquí deben tener el mismo nombre y tipo.

export interface PrinterSchema {
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

export interface FilamentSchema {
  name: string;
  type: string;
  diameter: number;
  price_per_kg: number;
  color: string;
  total_weight: number;
}

export interface EnergySchema {
  kwh_cost: number;
}

export interface ModelDataSchema {
  model_weight: number;
  print_time: number;
  infill: number;
  supports: boolean;
  support_type: string | null;
  support_weight: number;
  layer_height: number;
}

export interface CommercialSchema {
  labor: number;
  post_processing: number;
  margin: number;
  taxes: number;
}

// Este es el payload completo para crear una cotización
export interface QuoteCreateSchema {
  quote_name: string;
  printer: PrinterSchema;
  filament: FilamentSchema;
  energy: EnergySchema;
  model: ModelDataSchema;
  commercial: CommercialSchema;
}

// Para actualizar, en este caso es idéntico al de creación (puedes cambiarlo si tu backend acepta menos campos)
export interface QuoteUpdateSchema extends QuoteCreateSchema {}
