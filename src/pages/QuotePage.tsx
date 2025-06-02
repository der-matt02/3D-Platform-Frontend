// src/pages/QuotePage.tsx

import React, { useState, useEffect } from "react";
import QuoteForm from "../components/QuoteForm";
import type { QuoteCreateSchema, QuoteUpdateSchema } from "../types/schema";

interface QuotePageProps {
  token: string;
  onLogout: () => void;
}

const API_URL = "http://localhost:8000/api/quotes/";

const QuotePage: React.FC<QuotePageProps> = ({ token, onLogout }) => {
  // 1) Estado para la lista de cotizaciones
  const [quotes, setQuotes] = useState<any[]>([]);

  // 2) Estados para edición: payload (sin id) y el id por separado
  const [editingData, setEditingData] = useState<QuoteUpdateSchema & { summary?: any } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 3) Controla si mostramos el formulario o la lista
  const [showForm, setShowForm] = useState(false);

  // — fetchQuotes: obtiene todas las cotizaciones con GET /api/quotes/ —
  const fetchQuotes = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      // Ajustamos para que cada item tenga `id = _id`
      const adjusted = data.map((item: any) => ({
        ...item,
        id: item._id,
      }));
      setQuotes(adjusted);
    } catch (err) {
      console.error("Error al leer cotizaciones:", err);
      alert("No se pudieron cargar las cotizaciones.");
    }
  };

  // 4) Al montar, cargamos la lista
  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // — handleCreate: crea una nueva cotización (POST) —
  const handleCreate = async (payload: QuoteCreateSchema) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`Error ${res.status}: ${textErr}`);
      }

      // Extraemos la respuesta completa (QuoteOutSchema)
      const createdQuote = await res.json();
      const newId = createdQuote._id;

      // Construimos payload con los mismos campos y agregamos `summary`
      const updatePayload: QuoteUpdateSchema & { summary: typeof createdQuote.summary } = {
        quote_name: createdQuote.quote_name,
        printer: {
          name: createdQuote.printer.name,
          watts: createdQuote.printer.watts,
          type: createdQuote.printer.type,
          speed: createdQuote.printer.speed,
          nozzle: createdQuote.printer.nozzle,
          layer: createdQuote.printer.layer,
          bed_temperature: createdQuote.printer.bed_temperature,
          hotend_temperature: createdQuote.printer.hotend_temperature,
          hourly_cost: createdQuote.printer.hourly_cost,
        },
        filament: {
          name: createdQuote.filament.name,
          type: createdQuote.filament.type,
          diameter: createdQuote.filament.diameter,
          price_per_kg: createdQuote.filament.price_per_kg,
          color: createdQuote.filament.color,
          total_weight: createdQuote.filament.total_weight,
        },
        energy: { kwh_cost: createdQuote.energy.kwh_cost },
        model: {
          model_weight: createdQuote.model.model_weight,
          print_time: createdQuote.model.print_time,
          infill: createdQuote.model.infill,
          supports: createdQuote.model.supports,
          support_type: createdQuote.model.support_type,
          support_weight: createdQuote.model.support_weight,
          layer_height: createdQuote.model.layer_height,
        },
        commercial: {
          labor: createdQuote.commercial.labor,
          post_processing: createdQuote.commercial.post_processing,
          margin: createdQuote.commercial.margin,
          taxes: createdQuote.commercial.taxes,
        },
        summary: {
          grams_used: createdQuote.summary.grams_used,
          grams_wasted: createdQuote.summary.grams_wasted,
          waste_percentage: createdQuote.summary.waste_percentage,
          estimated_total_cost: createdQuote.summary.estimated_total_cost,
          suggestions: createdQuote.summary.suggestions,
        },
      };

      // Dejamos el formulario abierto con el summary recién creado
      setEditingId(newId);
      setEditingData(updatePayload);
      setShowForm(true);

      // Recargamos la lista para incluir la nueva cotización
      await fetchQuotes();
    } catch (err) {
      console.error("Error al crear cotización:", err);
      alert("No se pudo crear la cotización.");
    }
  };

  // — handleUpdate: actualiza una cotización existente (PUT) —
  const handleUpdate = async (payload: QuoteCreateSchema) => {
    if (!editingId) {
      console.error("Falta el ID para actualizar.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`Error ${res.status}: ${textErr}`);
      }
      // Si actualizó correctamente, recargamos la lista y resetemos edición
      await fetchQuotes();
      setEditingData(null);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error al actualizar cotización:", err);
      alert("No se pudo actualizar la cotización.");
    }
  };

  // — handleDelete: elimina una cotización (DELETE) —
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cotización?")) return;
    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`Error ${res.status}: ${textErr}`);
      }
      await fetchQuotes();
    } catch (err) {
      console.error("Error al eliminar cotización:", err);
      alert("No se pudo eliminar la cotización.");
    }
  };

  // — handleCancel: cancela la creación/edición y oculta el formulario —
  const handleCancel = () => {
    setEditingData(null);
    setEditingId(null);
    setShowForm(false);
  };

  // — handleEditClick: al hacer clic en “Editar” para una cotización `q` —
  const handleEditClick = (q: any) => {
    // Construimos el payload con todos los campos y agregamos `summary`
    const updatePayload: QuoteUpdateSchema & { summary: typeof q.summary } = {
      quote_name: q.quote_name,
      printer: {
        name: q.printer.name,
        watts: q.printer.watts,
        type: q.printer.type,
        speed: q.printer.speed,
        nozzle: q.printer.nozzle,
        layer: q.printer.layer,
        bed_temperature: q.printer.bed_temperature,
        hotend_temperature: q.printer.hotend_temperature,
        hourly_cost: q.printer.hourly_cost,
      },
      filament: {
        name: q.filament.name,
        type: q.filament.type,
        diameter: q.filament.diameter,
        price_per_kg: q.filament.price_per_kg,
        color: q.filament.color,
        total_weight: q.filament.total_weight,
      },
      energy: { kwh_cost: q.energy.kwh_cost },
      model: {
        model_weight: q.model.model_weight,
        print_time: q.model.print_time,
        infill: q.model.infill,
        supports: q.model.supports,
        support_type: q.model.support_type,
        support_weight: q.model.support_weight,
        layer_height: q.model.layer_height,
      },
      commercial: {
        labor: q.commercial.labor,
        post_processing: q.commercial.post_processing,
        margin: q.commercial.margin,
        taxes: q.commercial.taxes,
      },
      summary: {
        grams_used: q.summary.grams_used,
        grams_wasted: q.summary.grams_wasted,
        waste_percentage: q.summary.waste_percentage,
        estimated_total_cost: q.summary.estimated_total_cost,
        suggestions: q.summary.suggestions,
      },
    };

    // Guardamos en el state el ID y el payload para edición
    setEditingId(q.id);
    setEditingData(updatePayload);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      {/* Cabecera con título y botón “Cerrar sesión” */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>Cotizaciones 3D</h1>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* BOTÓN “Nueva Cotización”: aparece solo si no estamos en modo formulario */}
      {!showForm && (
        <button
          onClick={() => {
            setEditingData(null);
            setEditingId(null);
            setShowForm(true);
          }}
          style={{
            marginBottom: 16,
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Nueva Cotización
        </button>
      )}

      {/* LISTA DE COTIZACIONES (solo si showForm === false) */}
      {!showForm && (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {quotes.map((q) => (
            <li
              key={q.id}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                marginBottom: 8,
                borderRadius: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Muestra resumen de la cotización */}
              <div>
                <strong>{q.quote_name}</strong> — Impresora: {q.printer.name} — Filamento:{" "}
                {q.filament.name} — Infill: {q.model.infill}%
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(q)}
                  style={{
                    marginRight: 8,
                    backgroundColor: "#ffc107",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* FORMULARIO (solo si showForm === true) */}
      {showForm && (
        <QuoteForm
          initialData={editingData || undefined}
          onSubmit={(payload) => {
            editingId ? handleUpdate(payload) : handleCreate(payload);
          }}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default QuotePage;
