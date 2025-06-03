// src/components/QuoteForm.tsx

import React, { useEffect, useState } from "react";
import type { QuoteCreateSchema, QuoteUpdateSchema } from "../types/schema";
import OptimizationPanel from "./OptimizationPanel";

// DEFINICIÓN DE LISTAS DE OPCIONES (deben coincidir con los enums del backend)
const PRINTER_TYPES = ["FDM", "SLA", "SLS", "DLP", "MSLA"] as const;
type PrinterType = typeof PRINTER_TYPES[number];

const NOZZLE_SIZES = ["0.2", "0.4", "0.6", "0.8", "1.0"] as const;
type NozzleSize = typeof NOZZLE_SIZES[number];

const SUPPORT_TYPES = ["Árbol", "Lineal"] as const;
type SupportType = typeof SUPPORT_TYPES[number];

const FILAMENT_TYPES = ["PLA", "ABS", "PETG", "TPU", "Nylon", "HIPS", "PC", "ASA"] as const;
type FilamentType = typeof FILAMENT_TYPES[number];

const FILAMENT_DIAMETERS = ["1.75", "2.85", "3.0"] as const;
type FilamentDiameter = typeof FILAMENT_DIAMETERS[number];

const FILAMENT_COLORS = [
  "Negro", "Blanco", "Rojo", "Azul", "Verde",
  "Amarillo", "Gris", "Transparente", "Naranja",
  "Púrpura", "Plateado", "Dorado"
] as const;
type FilamentColor = typeof FILAMENT_COLORS[number];

interface QuoteFormProps {
  initialData?: (QuoteUpdateSchema & {
    summary?: {
      grams_used: number;
      grams_wasted: number;
      waste_percentage: number;
      estimated_total_cost: number;
      suggestions: string[];
    };
  }) & {
    id?: string; // <--- agregamos aquí el id
  };
  onSubmit: (data: QuoteCreateSchema) => void;
  onCancel: () => void;
  onQuoteReload: () => void;
  quoteVersion?: number;
}


const QuoteForm: React.FC<QuoteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onQuoteReload,
  quoteVersion,
}) => {
  // — Quote Name —
  const [quoteName, setQuoteName] = useState<string>(initialData?.quote_name || "");

  // — Printer —
  const [printerName, setPrinterName] = useState<string>(initialData?.printer.name || "");
  const [printerWatts, setPrinterWatts] = useState<number>(initialData?.printer.watts || 0);
  const [printerType, setPrinterType] = useState<PrinterType>(
    (initialData?.printer.type as PrinterType) || PRINTER_TYPES[0]
  );
  const [printerSpeed, setPrinterSpeed] = useState<number>(initialData?.printer.speed || 0);
  const [printerNozzle, setPrinterNozzle] = useState<NozzleSize>(
    (initialData?.printer.nozzle as NozzleSize) || NOZZLE_SIZES[0]
  );
  const [printerLayer, setPrinterLayer] = useState<number>(initialData?.printer.layer || 0);
  const [printerBedTemp, setPrinterBedTemp] = useState<number>(initialData?.printer.bed_temperature || 0);
  const [printerHotendTemp, setPrinterHotendTemp] = useState<number>(initialData?.printer.hotend_temperature || 0);
  const [printerHourlyCost, setPrinterHourlyCost] = useState<number>(initialData?.printer.hourly_cost || 0);

  // — Filament —
  const [filamentName, setFilamentName] = useState<string>(initialData?.filament.name || "");
  const [filamentType, setFilamentType] = useState<FilamentType>(
    (initialData?.filament.type as FilamentType) || FILAMENT_TYPES[0]
  );
  const [filamentDiameter, setFilamentDiameter] = useState<FilamentDiameter>(
    String(initialData?.filament.diameter || FILAMENT_DIAMETERS[0]) as FilamentDiameter
  );
  const [filamentPricePerKg, setFilamentPricePerKg] = useState<number>(initialData?.filament.price_per_kg || 0);
  const [filamentColor, setFilamentColor] = useState<FilamentColor>(
    (initialData?.filament.color as FilamentColor) || FILAMENT_COLORS[0]
  );
  const [filamentTotalWeight, setFilamentTotalWeight] = useState<number>(initialData?.filament.total_weight || 0);

  // — Energy —
  const [energyKwhCost, setEnergyKwhCost] = useState<number>(initialData?.energy.kwh_cost || 0);

  // — ModelData —
  const [modelWeight, setModelWeight] = useState<number>(initialData?.model.model_weight || 0);
  const [modelPrintTime, setModelPrintTime] = useState<number>(initialData?.model.print_time || 0);
  const [modelInfill, setModelInfill] = useState<number>(initialData?.model.infill || 0);
  const [modelSupports, setModelSupports] = useState<boolean>(initialData?.model.supports || false);
  const [modelSupportType, setModelSupportType] = useState<SupportType>(
    (initialData?.model.support_type as SupportType) || SUPPORT_TYPES[0]
  );
  const [modelSupportWeight, setModelSupportWeight] = useState<number>(initialData?.model.support_weight || 0);
  const [modelLayerHeight, setModelLayerHeight] = useState<number>(initialData?.model.layer_height || 0);

  // — Commercial —
  const [commercialLabor, setCommercialLabor] = useState<number>(initialData?.commercial.labor || 0);
  const [commercialPostProcessing, setCommercialPostProcessing] = useState<number>(initialData?.commercial.post_processing || 0);
  const [commercialMargin, setCommercialMargin] = useState<number>(initialData?.commercial.margin || 0);
  const [commercialTaxes, setCommercialTaxes] = useState<number>(initialData?.commercial.taxes || 0);

  // Errores por campo
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const hasErrors = Object.values(errors).some((msg) => msg && msg.length > 0);

  // — Funciones de validación (cada una devuelve "" o un mensaje) —

  const validateQuoteName = (value: string): string => {
    const txt = value.trim();
    if (txt === "") return "El nombre de cotización es requerido";
    if (txt.length < 3) return "Mínimo 3 caracteres";
    if (txt.length > 60) return "Máximo 60 caracteres";
    return "";
  };

  // — Printer validations —
  const validatePrinterName = (value: string): string => {
    if (value.trim() === "") return "Nombre de impresora es requerido";
    if (!/^[a-zA-Z0-9 ]+$/.test(value)) return "Solo letras, números y espacios";
    return "";
  };
  const validatePrinterWatts = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Watts debe ser > 0";
    return "";
  };
  const validatePrinterSpeed = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Speed debe ser > 0";
    if (value > 300) return "Speed máx = 300 mm/s";
    return "";
  };
  const validatePrinterLayer = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Layer debe ser > 0";
    if (value > 1.0) return "Layer máx = 1.0 mm";
    return "";
  };
  const validatePrinterBedTemp = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 0) return "Bed Temp ≥ 0";
    if (value > 120) return "Bed Temp máx = 120 °C";
    return "";
  };
  const validatePrinterHotendTemp = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 150) return "Hotend ≥ 150 °C";
    if (value > 350) return "Hotend ≤ 350 °C";
    return "";
  };
  const validatePrinterHourlyCost = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 1) return "Costo por hora ≥ 1";
    if (value > 500) return "Costo por hora ≤ 500";
    return "";
  };

  // — Filament validations —
  const validateFilamentName = (value: string): string => {
    if (value.trim() === "") return "Nombre de filamento requerido";
    if (!/^[a-zA-Z ]+$/.test(value)) return "Solo letras y espacios";
    if (value.length < 2) return "Mínimo 2 caracteres";
    if (value.length > 40) return "Máximo 40 caracteres";
    return "";
  };
  const validateFilamentPricePerKg = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 1) return "Precio > 1";
    if (value > 100) return "Precio ≤ 100";
    return "";
  };
  const validateFilamentTotalWeight = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Peso > 0";
    return "";
  };

  // — Energy validations —
  const validateEnergyKwhCost = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Costo KWH > 0";
    return "";
  };

  // — ModelData validations —
  const validateModelWeight = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Peso del modelo > 0";
    return "";
  };
  const validateModelPrintTime = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Tiempo > 0";
    return "";
  };
  const validateModelInfill = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Infill > 0";
    if (value > 100) return "Infill ≤ 100%";
    return "";
  };
  const validateModelSupportType = (value: string): string => {
    if (!modelSupports) return ""; // si no hay supports, no validamos
    if (value.trim() === "") return "Seleccione tipo de soporte";
    return "";
  };
  const validateModelSupportWeight = (value: number): string => {
    if (!modelSupports) return ""; // si no hay supports, no validamos
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Peso del soporte > 0";
    return "";
  };
  const validateModelLayerHeight = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Layer Height > 0";
    if (value > 1.0) return "Layer Height ≤ 1.0";
    return "";
  };

  // — Commercial validations —
  const validateCommercialLabor = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 0) return "Labor ≥ 0";
    if (value > 500) return "Labor ≤ 500";
    return "";
  };
  const validateCommercialPostProcessing = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 0) return "Post-proc. ≥ 0";
    if (value > 500) return "Post-proc. ≤ 500";
    return "";
  };
  const validateCommercialMargin = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 0) return "Margen ≥ 0";
    if (value > 1.0) return "Margen ≤ 1.0";
    return "";
  };
  const validateCommercialTaxes = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value < 0) return "Impuestos ≥ 0";
    if (value > 1.0) return "Impuestos ≤ 1.0";
    return "";
  };

  // 4) USE EFFECTS para ejecutar validación en tiempo real
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      quoteName: validateQuoteName(quoteName),
    }));
  }, [quoteName]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      printerName: validatePrinterName(printerName),
      printerWatts: validatePrinterWatts(printerWatts),
      printerSpeed: validatePrinterSpeed(printerSpeed),
      printerLayer: validatePrinterLayer(printerLayer),
      printerBedTemp: validatePrinterBedTemp(printerBedTemp),
      printerHotendTemp: validatePrinterHotendTemp(printerHotendTemp),
      printerHourlyCost: validatePrinterHourlyCost(printerHourlyCost),
      printerType: printerType ? "" : "Seleccione tipo de impresora",
      printerNozzle: printerNozzle ? "" : "Seleccione boquilla",
    }));
  }, [
    printerName,
    printerWatts,
    printerType,
    printerSpeed,
    printerNozzle,
    printerLayer,
    printerBedTemp,
    printerHotendTemp,
    printerHourlyCost,
  ]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      filamentName: validateFilamentName(filamentName),
      filamentPricePerKg: validateFilamentPricePerKg(filamentPricePerKg),
      filamentTotalWeight: validateFilamentTotalWeight(filamentTotalWeight),
      filamentType: filamentType ? "" : "Seleccione tipo de filamento",
      filamentDiameter: filamentDiameter ? "" : "Seleccione diámetro",
      filamentColor: filamentColor ? "" : "Seleccione color",
    }));
  }, [
    filamentName,
    filamentType,
    filamentDiameter,
    filamentPricePerKg,
    filamentColor,
    filamentTotalWeight,
  ]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      energyKwhCost: validateEnergyKwhCost(energyKwhCost),
    }));
  }, [energyKwhCost]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      modelWeight: validateModelWeight(modelWeight),
      modelPrintTime: validateModelPrintTime(modelPrintTime),
      modelInfill: validateModelInfill(modelInfill),
      modelLayerHeight: validateModelLayerHeight(modelLayerHeight),
      modelSupportType: validateModelSupportType(modelSupportType as string),
      modelSupportWeight: validateModelSupportWeight(modelSupportWeight),
    }));
  }, [
    modelWeight,
    modelPrintTime,
    modelInfill,
    modelSupports,
    modelSupportType,
    modelSupportWeight,
    modelLayerHeight,
  ]);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      commercialLabor: validateCommercialLabor(commercialLabor),
      commercialPostProcessing: validateCommercialPostProcessing(commercialPostProcessing),
      commercialMargin: validateCommercialMargin(commercialMargin),
      commercialTaxes: validateCommercialTaxes(commercialTaxes),
    }));
  }, [commercialLabor, commercialPostProcessing, commercialMargin, commercialTaxes]);

  // 5) MANEJADORES de “onChange” para cada input/select/checkbox
  const handleQuoteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteName(e.target.value);
  };
  const handlePrinterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterName(e.target.value);
  };
  const handlePrinterWattsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterWatts(Number(e.target.value));
  };
  const handlePrinterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrinterType(e.target.value as PrinterType);
  };
  const handlePrinterSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterSpeed(Number(e.target.value));
  };
  const handlePrinterNozzleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrinterNozzle(e.target.value as NozzleSize);
  };
  const handlePrinterLayerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterLayer(Number(e.target.value));
  };
  const handlePrinterBedTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterBedTemp(Number(e.target.value));
  };
  const handlePrinterHotendTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterHotendTemp(Number(e.target.value));
  };
  const handlePrinterHourlyCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrinterHourlyCost(Number(e.target.value));
  };

  const handleFilamentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilamentName(e.target.value);
  };
  const handleFilamentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilamentType(e.target.value as FilamentType);
  };
  const handleFilamentDiameterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilamentDiameter(e.target.value as FilamentDiameter);
  };
  const handleFilamentPricePerKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilamentPricePerKg(Number(e.target.value));
  };
  const handleFilamentColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilamentColor(e.target.value as FilamentColor);
  };
  const handleFilamentTotalWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilamentTotalWeight(Number(e.target.value));
  };

  const handleEnergyKwhCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnergyKwhCost(Number(e.target.value));
  };

  const handleModelWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelWeight(Number(e.target.value));
  };
  const handleModelPrintTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelPrintTime(Number(e.target.value));
  };
  const handleModelInfillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelInfill(Number(e.target.value));
  };
  const handleModelSupportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelSupports(e.target.checked);
    if (!e.target.checked) {
      setModelSupportType(SUPPORT_TYPES[0]);
      setModelSupportWeight(0);
      setErrors((prev) => ({
        ...prev,
        modelSupportType: "",
        modelSupportWeight: "",
      }));
    }
  };
  const handleModelSupportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelSupportType(e.target.value as SupportType);
  };
  const handleModelSupportWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelSupportWeight(Number(e.target.value));
  };
  const handleModelLayerHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelLayerHeight(Number(e.target.value));
  };

  const handleCommercialLaborChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialLabor(Number(e.target.value));
  };
  const handleCommercialPostProcessingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialPostProcessing(Number(e.target.value));
  };
  const handleCommercialMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialMargin(Number(e.target.value));
  };
  const handleCommercialTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialTaxes(Number(e.target.value));
  };

  // 6) MANEJO DE ENVÍO DEL FORMULARIO (VALIDACIÓN GLOBAL + onSubmit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentErrors: Partial<Record<string, string>> = {
      quoteName: validateQuoteName(quoteName),

      printerName: validatePrinterName(printerName),
      printerWatts: validatePrinterWatts(printerWatts),
      printerType: printerType ? "" : "Seleccione tipo de impresora",
      printerSpeed: validatePrinterSpeed(printerSpeed),
      printerNozzle: printerNozzle ? "" : "Seleccione boquilla",
      printerLayer: validatePrinterLayer(printerLayer),
      printerBedTemp: validatePrinterBedTemp(printerBedTemp),
      printerHotendTemp: validatePrinterHotendTemp(printerHotendTemp),
      printerHourlyCost: validatePrinterHourlyCost(printerHourlyCost),

      filamentName: validateFilamentName(filamentName),
      filamentType: filamentType ? "" : "Seleccione tipo de filamento",
      filamentDiameter: filamentDiameter ? "" : "Seleccione diámetro",
      filamentPricePerKg: validateFilamentPricePerKg(filamentPricePerKg),
      filamentColor: filamentColor ? "" : "Seleccione color",
      filamentTotalWeight: validateFilamentTotalWeight(filamentTotalWeight),

      energyKwhCost: validateEnergyKwhCost(energyKwhCost),

      modelWeight: validateModelWeight(modelWeight),
      modelPrintTime: validateModelPrintTime(modelPrintTime),
      modelInfill: validateModelInfill(modelInfill),
      modelLayerHeight: validateModelLayerHeight(modelLayerHeight),
      modelSupportType: modelSupports ? validateModelSupportType(modelSupportType as string) : "",
      modelSupportWeight: modelSupports ? validateModelSupportWeight(modelSupportWeight) : "",

      commercialLabor: validateCommercialLabor(commercialLabor),
      commercialPostProcessing: validateCommercialPostProcessing(commercialPostProcessing),
      commercialMargin: validateCommercialMargin(commercialMargin),
      commercialTaxes: validateCommercialTaxes(commercialTaxes),
    };

    setErrors(currentErrors);

    if (Object.values(currentErrors).some((msg) => msg && msg.length > 0)) {
      alert("Corrige los errores antes de enviar.");
      return;
    }

    const payload: QuoteCreateSchema = {
      quote_name: quoteName.trim(),
      printer: {
        name: printerName.trim(),
        watts: printerWatts,
        type: printerType,
        speed: printerSpeed,
        nozzle: printerNozzle,
        layer: printerLayer,
        bed_temperature: printerBedTemp,
        hotend_temperature: printerHotendTemp,
        hourly_cost: printerHourlyCost,
      },
      filament: {
        name: filamentName.trim(),
        type: filamentType,
        diameter: parseFloat(filamentDiameter),
        price_per_kg: filamentPricePerKg,
        color: filamentColor,
        total_weight: filamentTotalWeight,
      },
      energy: {
        kwh_cost: energyKwhCost,
      },
      model: {
        model_weight: modelWeight,
        print_time: modelPrintTime,
        infill: modelInfill,
        supports: modelSupports,
        support_type: modelSupports ? (modelSupportType as SupportType) : null,
        support_weight: modelSupports ? modelSupportWeight : 0,
        layer_height: modelLayerHeight,
      },
      commercial: {
        labor: commercialLabor,
        post_processing: commercialPostProcessing,
        margin: commercialMargin,
        taxes: commercialTaxes,
      },
    };

    onSubmit(payload);

    if (!initialData) {
      setQuoteName("");
      setPrinterName("");
      setPrinterWatts(0);
      setPrinterType(PRINTER_TYPES[0]);
      setPrinterSpeed(0);
      setPrinterNozzle(NOZZLE_SIZES[0]);
      setPrinterLayer(0);
      setPrinterBedTemp(0);
      setPrinterHotendTemp(0);
      setPrinterHourlyCost(0);

      setFilamentName("");
      setFilamentType(FILAMENT_TYPES[0]);
      setFilamentDiameter(FILAMENT_DIAMETERS[0]);
      setFilamentPricePerKg(0);
      setFilamentColor(FILAMENT_COLORS[0]);
      setFilamentTotalWeight(0);

      setEnergyKwhCost(0);

      setModelWeight(0);
      setModelPrintTime(0);
      setModelInfill(0);
      setModelSupports(false);
      setModelSupportType(SUPPORT_TYPES[0]);
      setModelSupportWeight(0);
      setModelLayerHeight(0);

      setCommercialLabor(0);
      setCommercialPostProcessing(0);
      setCommercialMargin(0);
      setCommercialTaxes(0);

      setErrors({});
    }
  };

  // 7) JSX DEL FORMULARIO
  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          marginTop: 16,
          borderRadius: 4,
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: 8, color: "#000" }}>
          {initialData ? "Editar Cotización" : "Nueva Cotización"}
        </h2>

        {/* —————————— quote_name —————————— */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: "bold", color: "#000" }}>
            Nombre de Cotización:
          </label>
          <input
            type="text"
            value={quoteName}
            onChange={handleQuoteNameChange}
            placeholder="Ej: Proyecto Demo"
            style={{
              width: "100%",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "6px",
            }}
          />
          {errors.quoteName && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.quoteName}
            </div>
          )}
        </div>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Sección “Printer” —————————— */}
        <fieldset style={{ marginBottom: 16, borderColor: "#ccc" }}>
          <legend style={{ fontWeight: "bold", color: "#000" }}>
            Datos de la Impresora
          </legend>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Nombre de la Impresora:</label>
            <input
              type="text"
              value={printerName}
              onChange={handlePrinterNameChange}
              placeholder="Ej: Ultimaker S3"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerName && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Watts (consumo eléctrico):</label>
            <input
              type="number"
              min={1}
              value={printerWatts}
              onChange={handlePrinterWattsChange}
              placeholder="Ej: 120"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerWatts && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerWatts}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Tipo de Impresora:</label>
            <select
              value={printerType}
              onChange={handlePrinterTypeChange}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
                width: "100%",
              }}
            >
              <option value="">-- Seleccione tipo --</option>
              {PRINTER_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
            {errors.printerType && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerType}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Velocidad (mm/s):</label>
            <input
              type="number"
              min={1}
              max={300}
              value={printerSpeed}
              onChange={handlePrinterSpeedChange}
              placeholder="Ej: 60"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerSpeed && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerSpeed}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Diámetro de Boquilla (Nozzle):</label>
            <select
              value={printerNozzle}
              onChange={handlePrinterNozzleChange}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
                width: "100%",
              }}
            >
              <option value="">-- Seleccione boquilla --</option>
              {NOZZLE_SIZES.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
            {errors.printerNozzle && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerNozzle}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Altura de Capa (mm):</label>
            <input
              type="number"
              step="0.01"
              min={0.01}
              max={1.0}
              value={printerLayer}
              onChange={handlePrinterLayerChange}
              placeholder="Ej: 0.2"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerLayer && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerLayer}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Temperatura de Cama (°C):</label>
            <input
              type="number"
              min={0}
              max={120}
              value={printerBedTemp}
              onChange={handlePrinterBedTempChange}
              placeholder="Ej: 60"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerBedTemp && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerBedTemp}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Temperatura Hotend (°C):</label>
            <input
              type="number"
              min={150}
              max={350}
              value={printerHotendTemp}
              onChange={handlePrinterHotendTempChange}
              placeholder="Ej: 200"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerHotendTemp && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerHotendTemp}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Costo por Hora (USD):</label>
            <input
              type="number"
              min={1}
              max={500}
              value={printerHourlyCost}
              onChange={handlePrinterHourlyCostChange}
              placeholder="Ej: 10"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.printerHourlyCost && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.printerHourlyCost}
              </div>
            )}
          </div>
        </fieldset>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Sección “Filament” —————————— */}
        <fieldset style={{ marginBottom: 16, borderColor: "#ccc" }}>
          <legend style={{ fontWeight: "bold", color: "#000" }}>
            Datos del Filamento
          </legend>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Nombre de Filamento:</label>
            <input
              type="text"
              value={filamentName}
              onChange={handleFilamentNameChange}
              placeholder="Ej: 3D Solutech"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.filamentName && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Tipo de Filamento:</label>
            <select
              value={filamentType}
              onChange={handleFilamentTypeChange}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
                width: "100%",
              }}
            >
              <option value="">-- Seleccione tipo --</option>
              {FILAMENT_TYPES.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
            {errors.filamentType && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentType}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Diámetro (mm):</label>
            <select
              value={filamentDiameter}
              onChange={handleFilamentDiameterChange}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
                width: "100%",
              }}
            >
              <option value="">-- Seleccione diámetro --</option>
              {FILAMENT_DIAMETERS.map((fd) => (
                <option key={fd} value={fd}>
                  {fd}
                </option>
              ))}
            </select>
            {errors.filamentDiameter && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentDiameter}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Precio por Kg (USD):</label>
            <input
              type="number"
              min={1}
              max={100}
              step="0.01"
              value={filamentPricePerKg}
              onChange={handleFilamentPricePerKgChange}
              placeholder="Ej: 20"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.filamentPricePerKg && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentPricePerKg}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Color:</label>
            <select
              value={filamentColor}
              onChange={handleFilamentColorChange}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
                width: "100%",
              }}
            >
              <option value="">-- Seleccione color --</option>
              {FILAMENT_COLORS.map((fc) => (
                <option key={fc} value={fc}>
                  {fc}
                </option>
              ))}
            </select>
            {errors.filamentColor && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentColor}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Peso Total Disponible (g):</label>
            <input
              type="number"
              min={1}
              step={1}
              value={filamentTotalWeight}
              onChange={handleFilamentTotalWeightChange}
              placeholder="Ej: 500"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.filamentTotalWeight && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.filamentTotalWeight}
              </div>
            )}
          </div>
        </fieldset>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Sección “Energy” —————————— */}
        <fieldset style={{ marginBottom: 16, borderColor: "#ccc" }}>
          <legend style={{ fontWeight: "bold", color: "#000" }}>Costo Energético</legend>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Costo KWH (USD):</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={energyKwhCost}
              onChange={handleEnergyKwhCostChange}
              placeholder="Ej: 0.1"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.energyKwhCost && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.energyKwhCost}
              </div>
            )}
          </div>
        </fieldset>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Sección “ModelData” —————————— */}
        <fieldset style={{ marginBottom: 16, borderColor: "#ccc" }}>
          <legend style={{ fontWeight: "bold", color: "#000" }}>Datos del Modelo</legend>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Peso del Modelo (g):</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={modelWeight}
              onChange={handleModelWeightChange}
              placeholder="Ej: 100"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.modelWeight && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.modelWeight}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Tiempo Estimado de Impresión (h):</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={modelPrintTime}
              onChange={handleModelPrintTimeChange}
              placeholder="Ej: 1.5"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.modelPrintTime && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.modelPrintTime}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Infill (%):</label>
            <input
              type="number"
              min={0.1}
              max={100}
              step={0.1}
              value={modelInfill}
              onChange={handleModelInfillChange}
              placeholder="Ej: 20"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.modelInfill && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.modelInfill}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>
              <input
                type="checkbox"
                checked={modelSupports}
                onChange={handleModelSupportsChange}
                style={{ marginRight: 4 }}
              />
              ¿Usa Soportes?
            </label>
          </div>

          {modelSupports && (
            <>
              <div style={{ marginBottom: 8 }}>
                <label style={{ color: "#000" }}>Tipo de Soporte:</label>
                <select
                  value={modelSupportType}
                  onChange={handleModelSupportTypeChange}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: "6px",
                    width: "100%",
                  }}
                >
                  <option value="">-- Seleccione tipo --</option>
                  {SUPPORT_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.modelSupportType && (
                  <div style={{ color: "red", fontSize: "0.85em" }}>
                    {errors.modelSupportType}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ color: "#000" }}>Peso de Soportes (g):</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={modelSupportWeight}
                  onChange={handleModelSupportWeightChange}
                  placeholder="Ej: 10"
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: "6px",
                  }}
                />
                {errors.modelSupportWeight && (
                  <div style={{ color: "red", fontSize: "0.85em" }}>
                    {errors.modelSupportWeight}
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Altura de Capa (mm):</label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              max={1.0}
              value={modelLayerHeight}
              onChange={handleModelLayerHeightChange}
              placeholder="Ej: 0.2"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.modelLayerHeight && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.modelLayerHeight}
              </div>
            )}
          </div>
        </fieldset>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Sección “Commercial” —————————— */}
        <fieldset style={{ marginBottom: 16, borderColor: "#ccc" }}>
          <legend style={{ fontWeight: "bold", color: "#000" }}>Datos Comerciales</legend>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Costo de Mano de Obra (USD):</label>
            <input
              type="number"
              min={0}
              max={500}
              step={0.01}
              value={commercialLabor}
              onChange={handleCommercialLaborChange}
              placeholder="Ej: 5"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.commercialLabor && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.commercialLabor}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Costo Post-procesado (USD):</label>
            <input
              type="number"
              min={0}
              max={500}
              step={0.01}
              value={commercialPostProcessing}
              onChange={handleCommercialPostProcessingChange}
              placeholder="Ej: 2"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.commercialPostProcessing && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.commercialPostProcessing}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Margen de Ganancia (0–1):</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={commercialMargin}
              onChange={handleCommercialMarginChange}
              placeholder="Ej: 0.3"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.commercialMargin && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.commercialMargin}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#000" }}>Impuestos (0–1):</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={commercialTaxes}
              onChange={handleCommercialTaxesChange}
              placeholder="Ej: 0.12"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "6px",
              }}
            />
            {errors.commercialTaxes && (
              <div style={{ color: "red", fontSize: "0.85em" }}>
                {errors.commercialTaxes}
              </div>
            )}
          </div>
        </fieldset>

        <hr style={{ margin: "16px 0", borderColor: "#ccc" }} />

        {/* —————————— Resumen de la cotización (si existe) —————————— */}
        {initialData?.summary && (
          <div
            style={{
              border: "1px solid #888",
              backgroundColor: "#f0f0f0",
              padding: 12,
              marginBottom: 16,
              borderRadius: 4,
            }}
          >
            <h4 style={{ margin: 0, marginBottom: 8, color: "#000" }}>
              Resumen de la Cotización
            </h4>
            <p style={{ margin: "4px 0", color: "#000" }}>
              <strong>Gramos usados:</strong> {initialData.summary.grams_used.toFixed(2)} g
            </p>
            <p style={{ margin: "4px 0", color: "#000" }}>
              <strong>Gramos desperdiciados:</strong> {initialData.summary.grams_wasted.toFixed(2)} g
            </p>
            <p style={{ margin: "4px 0", color: "#000" }}>
              <strong>Porcentaje de desecho:</strong> {initialData.summary.waste_percentage.toFixed(2)} %
            </p>
            <p style={{ margin: "4px 0", color: "#000" }}>
              <strong>Costo total estimado:</strong> ${initialData.summary.estimated_total_cost.toFixed(2)}
            </p>
          </div>
        )}
         {/* — Si estamos editando (initialData.id existe), mostramos el panel de optimización — */}
         {initialData?.id && (
           <div style={{ marginTop: "24px" }}>
             <OptimizationPanel
               quoteId={initialData.id}
               //onQuoteUpdated={onCancel}
               onQuoteUpdated={onQuoteReload}
               quoteVersion={quoteVersion}
             />
           </div>
         )}

        {/* —————————— BOTONES: Enviar y Cancelar —————————— */}
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              marginRight: 8,
              backgroundColor: "#ccc",
              color: "#000",
              border: "none",
              borderRadius: 4,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={hasErrors}
            style={{
              backgroundColor: hasErrors ? "#999" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 12px",
              cursor: hasErrors ? "not-allowed" : "pointer",
            }}
          >
            {initialData ? "Actualizar Cotización" : "Crear Cotización"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuoteForm;
