// 3d-quotes-frontend/src/components/OptimizationPanel.tsx

import React, { useEffect, useState } from "react";

import type {
  OptimizationResponse,
  OptimizationMode
} from "../api/quoteApi";

import {
  fetchQuoteOptimization,
  applyOptimizationMode
} from "../api/quoteApi";

interface OptimizationPanelProps {
  quoteId: string;
  onQuoteUpdated: () => void;
  quoteVersion?: number; 
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  quoteId,
  onQuoteUpdated,
  quoteVersion,
}) => {
  const [optimizationData, setOptimizationData] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchQuoteOptimization(quoteId)
      .then((data) => {
        setOptimizationData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error al obtener optimizaciones");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [quoteId, quoteVersion]);

  const handleApply = async (modeKey: keyof OptimizationResponse) => {
    if (!optimizationData) return;
    setApplying(true);
    try {
      const mode: OptimizationMode = optimizationData[modeKey];

      // Construir payload según los campos permitidos en tu QuoteUpdateSchema
      const payload = {
        printer: {
          speed: mode.new_parameters.speed,
        },
        model: {
          layer_height: mode.new_parameters.layer_height,
          infill: mode.new_parameters.infill,
          support_weight: mode.new_parameters.support_weight,
          print_time: mode.results.print_time,
        },
        summary: {
          grams_used: mode.results.grams_used,
          grams_wasted: mode.results.grams_wasted,
          waste_percentage: mode.results.waste_percentage,
          // Si tu backend acepta estimated_total_cost en summary, puedes añadirlo:
          // estimated_total_cost: mode.results.total_cost
        },
      };
      await applyOptimizationMode(quoteId, payload);
      onQuoteUpdated();
    } catch (err: any) {
      setError(err.message || "Error al aplicar optimización");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={{ color: "#000" }}>Cargando optimizaciones...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!optimizationData) return null;

  // Renderiza una “tarjeta” para cada modo
  const renderModeCard = (modeKey: keyof OptimizationResponse, title: string) => {
    const mode = optimizationData[modeKey];
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "16px",
          marginBottom: "16px",
          color: "#000"
        }}
      >
        <h4 style={{ margin: 0, marginBottom: 8, color: "#000" }}>{title}</h4>
        <div>
          <strong>Parámetros nuevos:</strong>
          <ul>
            <li>Speed: {mode.new_parameters.speed} mm/s</li>
            <li>Layer height: {mode.new_parameters.layer_height} mm</li>
            <li>Infill: {mode.new_parameters.infill} %</li>
            <li>Support weight: {mode.new_parameters.support_weight} g</li>
          </ul>
        </div>
        <div>
          <strong>Resultados estimados:</strong>
          <ul>
            <li>Print time: {mode.results.print_time} h</li>
            <li>Grams used: {mode.results.grams_used} g</li>
            <li>Grams wasted: {mode.results.grams_wasted} g</li>
            <li>Waste %: {mode.results.waste_percentage} %</li>
            <li>Material cost: ${mode.results.material_cost}</li>
            <li>Energy cost: ${mode.results.energy_cost}</li>
            <li>Machine cost: ${mode.results.machine_cost}</li>
            <li>Total cost: ${mode.results.total_cost}</li>
          </ul>
        </div>
        <button
          onClick={() => handleApply(modeKey)}
          disabled={applying}
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "#28a745", /* mismo verde de QuoteForm */
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {applying ? "Aplicando..." : "Aplicar este modo"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f0f0f0", padding: "16px", borderRadius: "8px" }}>
      <h3 style={{ margin: 0, marginBottom: 16, color: "#000" }}>Opciones de optimización</h3>
      {renderModeCard("fast", "Modo ⚡ Rápido")}
      {renderModeCard("economic", "Modo 💲 Económico")}
      {renderModeCard("balanced", "Modo ⚖️ Balanceado")}
    </div>
  );
};

export default OptimizationPanel;
