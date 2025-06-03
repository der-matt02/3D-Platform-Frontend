// src/api/quoteApi.ts

import type { Quote } from "../types/quote";

const API_URL = "http://localhost:8000/api/quotes/";

// ─────────────────────────────────────────────────────────────────────────────
// Funciones existentes
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAllQuotes(): Promise<Quote[]> {
  const res = await fetch(API_URL, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

export async function createQuote(data: any): Promise<Quote> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let detalle = "";
    try {
      const errJson = await res.json();
      detalle = errJson.detail || errJson.message || "";
    } catch {}
    throw new Error(`Error ${res.status}: ${res.statusText} ${detalle}`);
  }
  return await res.json();
}

export async function updateQuote(id: string, data: any): Promise<Quote> {
  const res = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let detalle = "";
    try {
      const errJson = await res.json();
      detalle = errJson.detail || errJson.message || "";
    } catch {}
    throw new Error(`Error ${res.status}: ${res.statusText} ${detalle}`);
  }
  return await res.json();
}

export async function deleteQuote(id: string): Promise<void> {
  const res = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}` 
    },
  });
  if (!res.ok) {
    let detalle = "";
    try {
      const errJson = await res.json();
      detalle = errJson.detail || errJson.message || "";
    } catch {}
    throw new Error(`Error ${res.status}: ${res.statusText} ${detalle}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipos para la respuesta de optimización
// ─────────────────────────────────────────────────────────────────────────────

export interface ModeParameters {
  speed: number;
  layer_height: number;
  infill: number;
  support_weight: number;
}

export interface ModeResults {
  print_time: number;
  grams_used: number;
  grams_wasted: number;
  waste_percentage: number;
  material_cost: number;
  energy_cost: number;
  machine_cost: number;
  total_cost: number;
}

export interface OptimizationMode {
  new_parameters: ModeParameters;
  results: ModeResults;
}

export interface OptimizationResponse {
  fast: OptimizationMode;
  economic: OptimizationMode;
  balanced: OptimizationMode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Función para obtener las tres propuestas de optimización
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchQuoteOptimization(
  quoteId: string
): Promise<OptimizationResponse> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${quoteId}/optimize`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as OptimizationResponse;
}

// ─────────────────────────────────────────────────────────────────────────────
// Función para aplicar uno de los modos de optimización
// ─────────────────────────────────────────────────────────────────────────────

export interface QuoteUpdatePayload {
  printer?: {
    speed?: number;
  };
  model?: {
    layer_height?: number;
    infill?: number;
    support_weight?: number;
    print_time?: number;
  };
  summary?: {
    grams_used?: number;
    grams_wasted?: number;
    waste_percentage?: number;
    estimated_total_cost?: number;
  };
  // Agrega aquí otros campos que tu backend permita modificar en PUT
}

export async function applyOptimizationMode(
  quoteId: string,
  payload: QuoteUpdatePayload
): Promise<Quote> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${quoteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detalle = "";
    try {
      const errJson = await res.json();
      detalle = errJson.detail || errJson.message || "";
    } catch {}
    throw new Error(`Error ${res.status}: ${res.statusText} ${detalle}`);
  }
  return await res.json();
}
