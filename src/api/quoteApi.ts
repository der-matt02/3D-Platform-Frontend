import type { Quote } from "../types/quote";

const API_URL = "http://localhost:8000/api/quotes/";

export async function fetchAllQuotes(): Promise<Quote[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

export async function createQuote(data: any): Promise<Quote> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
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
