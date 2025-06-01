// src/pages/QuotePage.tsx
import React, { useState, useEffect } from "react";
import QuoteForm from "../components/QuoteForm";
import type { QuoteCreateSchema, QuoteUpdateSchema } from "../types/schema";

const API_URL = "http://localhost:8000/api/quotes/";

const QuotePage: React.FC = () => {
  // 1) Estado para la lista de cotizaciones (de tipo `any[]` porque QuoteOutSchema no existe)
  const [quotes, setQuotes] = useState<any[]>([]);

  // 2) En vez de almacenar `QuoteUpdateSchema` con `id` incluido, 
  //    separamos: `editingData` contiene el payload sin el id, 
  //    `editingId` tiene la cadena del id que vamos a editar.
  const [editingData, setEditingData] = useState<QuoteUpdateSchema | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 3) Controla si mostramos el formulario o la lista
  const [showForm, setShowForm] = useState(false);

  // ——————————————————————————————————————————————————————————————————
  // fetchQuotes: obtiene todas las cotizaciones con GET /api/quotes/
  // ——————————————————————————————————————————————————————————————————
  const fetchQuotes = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      // En `data` esperamos algo como: [{ _id: "...", quote_name: "...", printer: {...}, ... }, ...]
      // Ajustamos para que cada item tenga `id = _id` para facilitar
      const adjusted = data.map((item: any) => ({
        ...item,
        id: item._id, // asumimos que el backend devuelve `_id`
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
  }, []);

  // ——————————————————————————————————————————————————————————————————
  // handleCreate: crea una nueva cotización (POST)
  // ——————————————————————————————————————————————————————————————————
  const handleCreate = async (payload: QuoteCreateSchema) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`Error ${res.status}: ${textErr}`);
      }
      // Si creó correctamente, recargamos la lista y ocultamos el formulario
      await fetchQuotes();
      setShowForm(false);
    } catch (err) {
      console.error("Error al crear cotización:", err);
      alert("No se pudo crear la cotización.");
    }
  };

  // ——————————————————————————————————————————————————————————————————
  // handleUpdate: actualiza una cotización existente (PUT)
  // ——————————————————————————————————————————————————————————————————
  const handleUpdate = async (payload: QuoteCreateSchema) => {
    if (!editingId) {
      console.error("Falta el ID para actualizar.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  // ——————————————————————————————————————————————————————————————————
  // handleDelete: elimina una cotización (DELETE)
  // ——————————————————————————————————————————————————————————————————
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cotización?")) return;
    try {
      const res = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
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

  // ——————————————————————————————————————————————————————————————————
  // handleCancel: cancela la creación/edición y oculta el formulario
  // ——————————————————————————————————————————————————————————————————
  const handleCancel = () => {
    setEditingData(null);
    setEditingId(null);
    setShowForm(false);
  };

  // ——————————————————————————————————————————————————————————————————
  // handleEditClick: al hacer clic en “Editar” para una cotización `q`
  //   aquí extraemos su id (`_id`) y los datos que van a `QuoteUpdateSchema`.
  // ——————————————————————————————————————————————————————————————————
  const handleEditClick = (q: any) => {
    // q tiene al menos: q._id, q.quote_name, q.printer, q.filament, q.energy, q.model, q.commercial
    const updatePayload: QuoteUpdateSchema = {
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
    };

    // Guardamos en el state el ID y el payload para edición
    setEditingId(q._id);
    setEditingData(updatePayload);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h1>Cotizaciones 3D</h1>

      {/* —————————————————————————————————————————————————————
          BOTÓN “Nueva Cotización”: muestra el formulario vacío
         ————————————————————————————————————————————————————— */}
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

      {/* —————————————————————————————————————————————————————
          LISTA DE COTIZACIONES (solo si showForm === false)
         ————————————————————————————————————————————————————— */}
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
              {/* Aquí muestras de forma resumida la cotización. Ajusta según convenga */}
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

      {/* —————————————————————————————————————————————————————
          FORMULARIO (solo si showForm === true)
         ————————————————————————————————————————————————————— */}
      {showForm && (
        <QuoteForm
          // Si editingData existe, pasamos { ...editingData } como initialData
          initialData={ editingData || undefined }
          onSubmit={(payload) => {
            // Si editingId está presente, estamos en modo edición → PUT
            // Sino, estamos en modo creación → POST
            editingId ? handleUpdate(payload) : handleCreate(payload);
          }}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default QuotePage;
