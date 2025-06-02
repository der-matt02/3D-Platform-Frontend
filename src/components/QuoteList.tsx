import React from "react";
import type { Quote } from "../types/quote";

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onEdit, onDelete }) => {
  if (quotes.length === 0) {
    return <p style={{ textAlign: "center" }}>(No hay cotizaciones registradas)</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {quotes.map((q) => (
        <div
          key={q._id}  // <-- Aquí cambia a _id
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            borderRadius: "4px",
            backgroundColor: "#1e1e1e",
            color: "#fff",
          }}
        >
          {/* Nombre de la cotización */}
          <h3 style={{ margin: "0 0 8px 0" }}>{q.quote_name}</h3>

          {/* Nombre de la impresora */}
          <p style={{ margin: "4px 0" }}>
            <strong>Impresora:</strong> {q.printer.name}
          </p>

          {/* Nombre del filamento */}
          <p style={{ margin: "4px 0" }}>
            <strong>Filamento:</strong> {q.filament.name}
          </p>

          {/* Fechas */}
          <p style={{ margin: "4px 0" }}>
            <strong>Creada:</strong> {new Date(q.created_at).toLocaleString()}
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Actualizada:</strong> {new Date(q.updated_at).toLocaleString()}
          </p>

          {/* Botones Editar / Eliminar */}
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => onEdit(q)}
              style={{
                marginRight: "8px",
                padding: "6px 12px",
                backgroundColor: "#007acc",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(q._id)}  // <-- Aquí también _id
              style={{
                padding: "6px 12px",
                backgroundColor: "#cc0000",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuoteList;
