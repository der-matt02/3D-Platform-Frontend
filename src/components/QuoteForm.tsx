// src/components/QuoteForm.tsx
import React, { useEffect, useState } from "react";
import type { QuoteCreateSchema, QuoteUpdateSchema } from "../types/schema";

// —————————————————————————————————————————————————————————————————————————————
// DEFINICIÓN DE LISTAS DE OPCIONES (deben coincidir con los enums del backend)
// —————————————————————————————————————————————————————————————————————————————

// PrinterType (coincidir con models.enums.printer_enums.PrinterType en FastAPI)
const PRINTER_TYPES = ["FDM", "SLA", "SLS", "DLP", "MSLA"] as const;
type PrinterType = typeof PRINTER_TYPES[number];

// NozzleSize (coincidir con models.enums.printer_enums.NozzleSize)
const NOZZLE_SIZES = ["0.2", "0.4", "0.6", "0.8", "1.0"] as const;
type NozzleSize = typeof NOZZLE_SIZES[number];

// SupportType (coincidir con models.enums.printer_enums.SupportType)
const SUPPORT_TYPES = ["Árbol", "Lineal"] as const;
type SupportType = typeof SUPPORT_TYPES[number];

// FilamentType (coincidir con models.enums.filament_enums.FilamentType)
const FILAMENT_TYPES = ["PLA", "ABS", "PETG", "TPU", "Nylon", "HIPS", "PC", "ASA"] as const;
type FilamentType = typeof FILAMENT_TYPES[number];

// FilamentDiameter (coincidir con models.enums.filament_enums.FilamentDiameter)
// Usamos cadenas para mapear 1.75, 2.85, 3.0 si el backend así lo maneja.
const FILAMENT_DIAMETERS = ["1.75", "2.85", "3.0"] as const;
type FilamentDiameter = typeof FILAMENT_DIAMETERS[number];

// FilamentColor (coincidir con models.enums.filament_enums.FilamentColor)
const FILAMENT_COLORS = [
  "Negro", "Blanco", "Rojo", "Azul", "Verde",
  "Amarillo", "Gris", "Transparente", "Naranja",
  "Púrpura", "Plateado", "Dorado"
] as const;
type FilamentColor = typeof FILAMENT_COLORS[number];

// Para “Commercial” no hay enum, son valores numéricos.
// Tampoco controles especiales para “Energy”.

// —————————————————————————————————————————————————————————————————————————————
// PROPS del componente
// —————————————————————————————————————————————————————————————————————————————
interface QuoteFormProps {
  initialData?: QuoteUpdateSchema;   // si estamos editando, llega con los campos a editar
  onSubmit: (data: QuoteCreateSchema) => void;  // callback para crear/actualizar
  onCancel: () => void;  // cancelar edición
}

// —————————————————————————————————————————————————————————————————————————————
// COMPONENTE
// —————————————————————————————————————————————————————————————————————————————
const QuoteForm: React.FC<QuoteFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // ————————————————————————————————————————————————————————————————————————
  // 1) ESTADOS PARA LOS VALORES DEL FORMULARIO
  //    Inicializamos con '' o 0, o con “initialData” si estamos editando.
  //    Note que “initialData” viene con los mismos campos que QuoteCreateSchema.
  // ————————————————————————————————————————————————————————————————————————

  const [quoteName, setQuoteName] = useState<string>(initialData?.quote_name || "");

  // — Printer —
  const [printerName, setPrinterName] = useState<string>(initialData?.printer.name || "");
  const [printerWatts, setPrinterWatts] = useState<number>(initialData?.printer.watts || 0);
  const [printerType, setPrinterType] = useState<PrinterType>(initialData?.printer.type as PrinterType || PRINTER_TYPES[0]);
  const [printerSpeed, setPrinterSpeed] = useState<number>(initialData?.printer.speed || 0);
  const [printerNozzle, setPrinterNozzle] = useState<NozzleSize>(initialData?.printer.nozzle as NozzleSize || NOZZLE_SIZES[0]);
  const [printerLayer, setPrinterLayer] = useState<number>(initialData?.printer.layer || 0);
  const [printerBedTemp, setPrinterBedTemp] = useState<number>(initialData?.printer.bed_temperature || 0);
  const [printerHotendTemp, setPrinterHotendTemp] = useState<number>(initialData?.printer.hotend_temperature || 0);
  const [printerHourlyCost, setPrinterHourlyCost] = useState<number>(initialData?.printer.hourly_cost || 0);

  // — Filament —
  const [filamentName, setFilamentName] = useState<string>(initialData?.filament.name || "");
  const [filamentType, setFilamentType] = useState<FilamentType>(initialData?.filament.type as FilamentType || FILAMENT_TYPES[0]);
  const [filamentDiameter, setFilamentDiameter] = useState<FilamentDiameter>(String(initialData?.filament.diameter || FILAMENT_DIAMETERS[0]) as FilamentDiameter);
  const [filamentPricePerKg, setFilamentPricePerKg] = useState<number>(initialData?.filament.price_per_kg || 0);
  const [filamentColor, setFilamentColor] = useState<FilamentColor>(initialData?.filament.color as FilamentColor || FILAMENT_COLORS[0]);
  const [filamentTotalWeight, setFilamentTotalWeight] = useState<number>(initialData?.filament.total_weight || 0);

  // — Energy —
  const [energyKwhCost, setEnergyKwhCost] = useState<number>(initialData?.energy.kwh_cost || 0);

  // — ModelData —
  const [modelWeight, setModelWeight] = useState<number>(initialData?.model.model_weight || 0);
  const [modelPrintTime, setModelPrintTime] = useState<number>(initialData?.model.print_time || 0);
  const [modelInfill, setModelInfill] = useState<number>(initialData?.model.infill || 0);
  const [modelSupports, setModelSupports] = useState<boolean>(initialData?.model.supports || false);
  const [modelSupportType, setModelSupportType] = useState<SupportType>(initialData?.model.support_type as SupportType || SUPPORT_TYPES[0]);
  const [modelSupportWeight, setModelSupportWeight] = useState<number>(initialData?.model.support_weight || 0);
  const [modelLayerHeight, setModelLayerHeight] = useState<number>(initialData?.model.layer_height || 0);

  // — Commercial —
  const [commercialLabor, setCommercialLabor] = useState<number>(initialData?.commercial.labor || 0);
  const [commercialPostProcessing, setCommercialPostProcessing] = useState<number>(initialData?.commercial.post_processing || 0);
  const [commercialMargin, setCommercialMargin] = useState<number>(initialData?.commercial.margin || 0);
  const [commercialTaxes, setCommercialTaxes] = useState<number>(initialData?.commercial.taxes || 0);

  // ————————————————————————————————————————————————————————————————————————
  // 2) ESTADO PARA MENSAJES DE ERROR (uno por cada campo).  
  //    Usamos un objeto cuya clave es el nombre del campo y valor es la cadena de error.
  // ————————————————————————————————————————————————————————————————————————
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Helper para determinar si hay al menos un error activo:
  const hasErrors = Object.values(errors).some((msg) => msg && msg.length > 0);

  // ————————————————————————————————————————————————————————————————————————
  // 3) FUNCIONES DE VALIDACIÓN POR CAMPO (devuelven "" si todo OK, o mensaje si no)
  // ————————————————————————————————————————————————————————————————————————
  const validateQuoteName = (value: string): string => {
    const txt = value.trim();
    if (txt === "") return "El nombre de cotización es requerido";
    if (txt.length < 3) return "Mínimo 3 caracteres";
    if (txt.length > 60) return "Máximo 60 caracteres";
    return "";
  };

  // — Printer —
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

  // — Filament —
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

  // — Energy —
  const validateEnergyKwhCost = (value: number): string => {
    if (isNaN(value)) return "Ingrese un número válido";
    if (value <= 0) return "Costo KWH > 0";
    return "";
  };

  // — ModelData —
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

  // — Commercial —
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

  // ————————————————————————————————————————————————————————————————————————
  // 4) USE EFFECTS para ejecutar validación en tiempo real cada vez que cambie un campo
  // ————————————————————————————————————————————————————————————————————————
  // Al cambiar “quoteName”
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      quoteName: validateQuoteName(quoteName),
    }));
  }, [quoteName]);

  // Al cambiar campos de Printer (uno por uno)
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      printerName: validatePrinterName(printerName),
      printerWatts: validatePrinterWatts(printerWatts),
      printerSpeed: validatePrinterSpeed(printerSpeed),
      printerLayer: validatePrinterLayer(printerLayer),
      printerBedTemp: validatePrinterBedTemp(printerBedTemp),
      printerHotendTemp: validatePrinterHotendTemp(printerHotendTemp),
      printerHourlyCost: validatePrinterHourlyCost(printerHourlyCost),
      // Validamos también que printerType y printerNozzle no estén vacíos:
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

  // Al cambiar campos de Filament
  useEffect(() => {
    setErrors(prev => ({
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

  // Al cambiar campos de Energy
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      energyKwhCost: validateEnergyKwhCost(energyKwhCost),
    }));
  }, [energyKwhCost]);

  // Al cambiar campos de ModelData
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      modelWeight: validateModelWeight(modelWeight),
      modelPrintTime: validateModelPrintTime(modelPrintTime),
      modelInfill: validateModelInfill(modelInfill),
      modelLayerHeight: validateModelLayerHeight(modelLayerHeight),
      // Solo si “supports” está activo validamos estos:
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

  // Al cambiar campos de Commercial
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      commercialLabor: validateCommercialLabor(commercialLabor),
      commercialPostProcessing: validateCommercialPostProcessing(commercialPostProcessing),
      commercialMargin: validateCommercialMargin(commercialMargin),
      commercialTaxes: validateCommercialTaxes(commercialTaxes),
    }));
  }, [commercialLabor, commercialPostProcessing, commercialMargin, commercialTaxes]);

  // ————————————————————————————————————————————————————————————————————————
  // 5) MANEJADORES de “onChange” para cada input/select/checkbox
  // ————————————————————————————————————————————————————————————————————————
  // A cada campo le asignamos su propio “onChange” que actualiza el estado correspondiente

  // — Quote Name —
  const handleQuoteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteName(e.target.value);
  };

  // — Printer —
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

  // — Filament —
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

  // — Energy —
  const handleEnergyKwhCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnergyKwhCost(Number(e.target.value));
  };

  // — ModelData —
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
    // Si lo desmarcamos, limpiamos los campos de soporte
    if (!e.target.checked) {
      setModelSupportType(SUPPORT_TYPES[0]);
      setModelSupportWeight(0);
      // Limpiamos errores de soporte
      setErrors(prev => ({
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

  // — Commercial —
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

  // ————————————————————————————————————————————————————————————————————————
  // 6) MANEJO DE ENVÍO DEL FORMULARIO (VALIDACIÓN GLOBAL + onSubmit)
  // ————————————————————————————————————————————————————————————————————————
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 6.1) Validar TODOS los campos antes de enviar → construimos un nuevo objeto “currentErrors”
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
      // Si “supports” está activo validamos estos, sino quedan vacíos:
      modelSupportType: modelSupports ? validateModelSupportType(modelSupportType as string) : "",
      modelSupportWeight: modelSupports ? validateModelSupportWeight(modelSupportWeight) : "",

      commercialLabor: validateCommercialLabor(commercialLabor),
      commercialPostProcessing: validateCommercialPostProcessing(commercialPostProcessing),
      commercialMargin: validateCommercialMargin(commercialMargin),
      commercialTaxes: validateCommercialTaxes(commercialTaxes),
    };

    setErrors(currentErrors);

    // 6.2) Si hay algún mensaje de error no vacío, detenemos
    if (Object.values(currentErrors).some((msg) => msg && msg.length > 0)) {
      alert("Corrige los errores antes de enviar.");
      return;
    }

    // 6.3) Si todo OK, construimos el objeto que enviaremos al onSubmit:
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
        diameter: parseFloat(filamentDiameter), // conversión de string a número
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

    // 6.4) Disparamos el callback (que en QuotePage hará POST o PUT)
    onSubmit(payload);

    // 6.5) Si estamos en modo “editar”, el onSubmit de QuotePage se encargará de resetear
    //       initialData / cerrar el formulario. Si es modo “crear”, limpiamos manualmente:
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

  // ————————————————————————————————————————————————————————————————————————
  // 7) JSX DEL FORMULARIO (se muestra todo en un solo formulario)
  // ————————————————————————————————————————————————————————————————————————
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #444",
        padding: 16,
        marginTop: 16,
        borderRadius: 4,
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ marginBottom: 8 }}>
        {initialData ? "Editar Cotización" : "Nueva Cotización"}
      </h2>

      {/* —————————— quote_name —————————— */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Nombre de Cotización:</label>
        <input
          type="text"
          value={quoteName}
          onChange={handleQuoteNameChange}
          placeholder="Ej: Proyecto Demo"
          style={{ width: "100%" }}
        />
        {errors.quoteName && (
          <div style={{ color: "red", fontSize: "0.85em" }}>
            {errors.quoteName}
          </div>
        )}
      </div>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— Sección “Printer” —————————— */}
      <fieldset style={{ marginBottom: 16 }}>
        <legend style={{ fontWeight: "bold" }}>Datos de la Impresora</legend>

        <div style={{ marginBottom: 8 }}>
          <label>Nombre de la Impresora:</label>
          <input
            type="text"
            value={printerName}
            onChange={handlePrinterNameChange}
            placeholder="Ej: Ultimaker S3"
            style={{ width: "100%" }}
          />
          {errors.printerName && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Watts (consumo eléctrico):</label>
          <input
            type="number"
            min={1}
            value={printerWatts}
            onChange={handlePrinterWattsChange}
            placeholder="Ej: 120"
          />
          {errors.printerWatts && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerWatts}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Tipo de Impresora:</label>
          <select value={printerType} onChange={handlePrinterTypeChange}>
            <option value="">-- Seleccione tipo --</option>
            {PRINTER_TYPES.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
          {errors.printerType && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerType}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Velocidad (mm/s):</label>
          <input
            type="number"
            min={1}
            max={300}
            value={printerSpeed}
            onChange={handlePrinterSpeedChange}
            placeholder="Ej: 60"
          />
          {errors.printerSpeed && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerSpeed}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Diámetro de Boquilla (Nozzle):</label>
          <select value={printerNozzle} onChange={handlePrinterNozzleChange}>
            <option value="">-- Seleccione boquilla --</option>
            {NOZZLE_SIZES.map((ns) => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
          {errors.printerNozzle && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerNozzle}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Altura de Capa (mm):</label>
          <input
            type="number"
            step="0.01"
            min={0.01}
            max={1.0}
            value={printerLayer}
            onChange={handlePrinterLayerChange}
            placeholder="Ej: 0.2"
          />
          {errors.printerLayer && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerLayer}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Temperatura de Cama (°C):</label>
          <input
            type="number"
            min={0}
            max={120}
            value={printerBedTemp}
            onChange={handlePrinterBedTempChange}
            placeholder="Ej: 60"
          />
          {errors.printerBedTemp && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerBedTemp}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Temperatura Hotend (°C):</label>
          <input
            type="number"
            min={150}
            max={350}
            value={printerHotendTemp}
            onChange={handlePrinterHotendTempChange}
            placeholder="Ej: 200"
          />
          {errors.printerHotendTemp && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerHotendTemp}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Costo por Hora (USD):</label>
          <input
            type="number"
            min={1}
            max={500}
            value={printerHourlyCost}
            onChange={handlePrinterHourlyCostChange}
            placeholder="Ej: 10"
          />
          {errors.printerHourlyCost && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.printerHourlyCost}
            </div>
          )}
        </div>
      </fieldset>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— Sección “Filament” —————————— */}
      <fieldset style={{ marginBottom: 16 }}>
        <legend style={{ fontWeight: "bold" }}>Datos del Filamento</legend>

        <div style={{ marginBottom: 8 }}>
          <label>Nombre de Filamento:</label>
          <input
            type="text"
            value={filamentName}
            onChange={handleFilamentNameChange}
            placeholder="Ej: 3D Solutech"
            style={{ width: "100%" }}
          />
          {errors.filamentName && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Tipo de Filamento:</label>
          <select value={filamentType} onChange={handleFilamentTypeChange}>
            <option value="">-- Seleccione tipo --</option>
            {FILAMENT_TYPES.map((ft) => (
              <option key={ft} value={ft}>{ft}</option>
            ))}
          </select>
          {errors.filamentType && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentType}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Diámetro (mm):</label>
          <select value={filamentDiameter} onChange={handleFilamentDiameterChange}>
            <option value="">-- Seleccione diámetro --</option>
            {FILAMENT_DIAMETERS.map((fd) => (
              <option key={fd} value={fd}>{fd}</option>
            ))}
          </select>
          {errors.filamentDiameter && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentDiameter}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Precio por Kg (USD):</label>
          <input
            type="number"
            min={1}
            max={100}
            step="0.01"
            value={filamentPricePerKg}
            onChange={handleFilamentPricePerKgChange}
            placeholder="Ej: 20"
          />
          {errors.filamentPricePerKg && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentPricePerKg}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Color:</label>
          <select value={filamentColor} onChange={handleFilamentColorChange}>
            <option value="">-- Seleccione color --</option>
            {FILAMENT_COLORS.map((fc) => (
              <option key={fc} value={fc}>{fc}</option>
            ))}
          </select>
          {errors.filamentColor && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentColor}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Peso Total Disponible (g):</label>
          <input
            type="number"
            min={1}
            step="1"
            value={filamentTotalWeight}
            onChange={handleFilamentTotalWeightChange}
            placeholder="Ej: 500"
          />
          {errors.filamentTotalWeight && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.filamentTotalWeight}
            </div>
          )}
        </div>
      </fieldset>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— Sección “Energy” —————————— */}
      <fieldset style={{ marginBottom: 16 }}>
        <legend style={{ fontWeight: "bold" }}>Costo Energético</legend>

        <div style={{ marginBottom: 8 }}>
          <label>Costo KWH (USD):</label>
          <input
            type="number"
            min={0.01}
            step="0.01"
            value={energyKwhCost}
            onChange={handleEnergyKwhCostChange}
            placeholder="Ej: 0.1"
          />
          {errors.energyKwhCost && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.energyKwhCost}
            </div>
          )}
        </div>
      </fieldset>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— Sección “ModelData” —————————— */}
      <fieldset style={{ marginBottom: 16 }}>
        <legend style={{ fontWeight: "bold" }}>Datos del Modelo</legend>

        <div style={{ marginBottom: 8 }}>
          <label>Peso del Modelo (g):</label>
          <input
            type="number"
            min={0.1}
            step="0.1"
            value={modelWeight}
            onChange={handleModelWeightChange}
            placeholder="Ej: 100"
          />
          {errors.modelWeight && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.modelWeight}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Tiempo Estimado de Impresión (h):</label>
          <input
            type="number"
            min={0.01}
            step="0.01"
            value={modelPrintTime}
            onChange={handleModelPrintTimeChange}
            placeholder="Ej: 1.5"
          />
          {errors.modelPrintTime && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.modelPrintTime}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Infill (%):</label>
          <input
            type="number"
            min={0.1}
            max={100}
            step="0.1"
            value={modelInfill}
            onChange={handleModelInfillChange}
            placeholder="Ej: 20"
          />
          {errors.modelInfill && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.modelInfill}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={modelSupports}
              onChange={handleModelSupportsChange}
            />{" "}
            ¿Usa Soportes?
          </label>
        </div>

        {/* Si “supports” está activo, mostramos campos adicionales */}
        {modelSupports && (
          <>
            <div style={{ marginBottom: 8 }}>
              <label>Tipo de Soporte:</label>
              <select
                value={modelSupportType}
                onChange={handleModelSupportTypeChange}
              >
                <option value="">-- Seleccione tipo --</option>
                {SUPPORT_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.modelSupportType && (
                <div style={{ color: "red", fontSize: "0.85em" }}>
                  {errors.modelSupportType}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Peso de Soportes (g):</label>
              <input
                type="number"
                min={0.1}
                step="0.1"
                value={modelSupportWeight}
                onChange={handleModelSupportWeightChange}
                placeholder="Ej: 10"
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
          <label>Altura de Capa (mm):</label>
          <input
            type="number"
            min={0.01}
            step="0.01"
            max={1.0}
            value={modelLayerHeight}
            onChange={handleModelLayerHeightChange}
            placeholder="Ej: 0.2"
          />
          {errors.modelLayerHeight && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.modelLayerHeight}
            </div>
          )}
        </div>
      </fieldset>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— Sección “Commercial” —————————— */}
      <fieldset style={{ marginBottom: 16 }}>
        <legend style={{ fontWeight: "bold" }}>Datos Comerciales</legend>

        <div style={{ marginBottom: 8 }}>
          <label>Costo de Mano de Obra (USD):</label>
          <input
            type="number"
            min={0}
            max={500}
            step="0.01"
            value={commercialLabor}
            onChange={handleCommercialLaborChange}
            placeholder="Ej: 5"
          />
          {errors.commercialLabor && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.commercialLabor}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Costo Post-procesado (USD):</label>
          <input
            type="number"
            min={0}
            max={500}
            step="0.01"
            value={commercialPostProcessing}
            onChange={handleCommercialPostProcessingChange}
            placeholder="Ej: 2"
          />
          {errors.commercialPostProcessing && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.commercialPostProcessing}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Margen de Ganancia (0–1):</label>
          <input
            type="number"
            min={0}
            max={1}
            step="0.01"
            value={commercialMargin}
            onChange={handleCommercialMarginChange}
            placeholder="Ej: 0.3"
          />
          {errors.commercialMargin && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.commercialMargin}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Impuestos (0–1):</label>
          <input
            type="number"
            min={0}
            max={1}
            step="0.01"
            value={commercialTaxes}
            onChange={handleCommercialTaxesChange}
            placeholder="Ej: 0.12"
          />
          {errors.commercialTaxes && (
            <div style={{ color: "red", fontSize: "0.85em" }}>
              {errors.commercialTaxes}
            </div>
          )}
        </div>
      </fieldset>

      <hr style={{ margin: "16px 0" }} />

      {/* —————————— BOTONES: Enviar y Cancelar —————————— */}
      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginRight: 8,
            backgroundColor: "#ccc",
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
            backgroundColor: hasErrors ? "#999" : "#007bff",
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
    </form>
  );
};

export default QuoteForm;
