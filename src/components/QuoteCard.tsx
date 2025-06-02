import React from "react";
import type { Quote } from "../types/quote";

interface Props {
  quote: Quote;
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
}

const QuoteCard: React.FC<Props> = ({ quote, onEdit, onDelete }) => {
  return (
    <div
      className="quote-card"
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "4px",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>{quote.quote_name}</h3>
      <p>
        <strong>Impresora:</strong> {quote.printer.name}
      </p>
      <p>
        <strong>Filamento:</strong> {quote.filament.name}
      </p>
      <p>
        <strong>Creada:</strong> {new Date(quote.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Actualizada:</strong> {new Date(quote.updated_at).toLocaleString()}
      </p>
      <div style={{ marginTop: "8px" }}>
        <button
          onClick={() => onEdit(quote)}
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
          onClick={() => onDelete(quote._id)}  // <-- aquí _id
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
  );
};

export default QuoteCard;
