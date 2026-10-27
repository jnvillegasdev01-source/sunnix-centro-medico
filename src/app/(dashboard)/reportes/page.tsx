"use client";

import React, { useState, useMemo } from "react";
import {
  PeriodoFiltro,
  CategoriaReporte,
  ReporteCatalogoItem,
  ReportePreviewData,
} from "@/types/reportes";
import {
  MOCK_CATALOGO_REPORTES,
  MOCK_RESUMEN_EJECUTIVO_STRIP,
  getPreviewDataForReport,
} from "@/lib/data/mock-reportes";
import { ResumenEjecutivoStrip } from "@/components/reportes/resumen-ejecutivo-strip";
import { ReportesFiltroBar } from "@/components/reportes/reportes-filtro-bar";
import { CatalogoReportesGrid } from "@/components/reportes/catalogo-reportes-grid";
import { ReportePreviewModal } from "@/components/reportes/reporte-preview-modal";
import {
  FileBarChart,
  DownloadCloud,
} from "lucide-react";

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("mes");
  const [categoria, setCategoria] = useState<"todos" | CategoriaReporte>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  const [previewData, setPreviewData] = useState<ReportePreviewData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Período formateado para mostrar en modales y reportes
  const periodoTexto = useMemo(() => {
    switch (periodo) {
      case "hoy":
        return "12/05/2025";
      case "semana":
        return "08/05/2025 al 14/05/2025";
      case "mes":
        return "Mayo 2025";
      case "ano":
        return "Año 2025";
      default:
        return "Período personalizado";
    }
  }, [periodo]);

  // Conteos por categoría
  const conteos = useMemo(() => {
    return {
      todos: MOCK_CATALOGO_REPORTES.length,
      clinica: MOCK_CATALOGO_REPORTES.filter((r) => r.categoria === "clinica").length,
      infraestructura: MOCK_CATALOGO_REPORTES.filter((r) => r.categoria === "infraestructura").length,
      finanzas: MOCK_CATALOGO_REPORTES.filter((r) => r.categoria === "finanzas").length,
      suministros: MOCK_CATALOGO_REPORTES.filter((r) => r.categoria === "suministros").length,
    };
  }, []);

  // Filtrado reactivo de catálogo
  const reportesFiltrados = useMemo(() => {
    return MOCK_CATALOGO_REPORTES.filter((reporte) => {
      if (categoria !== "todos" && reporte.categoria !== categoria) {
        return false;
      }

      if (busqueda.trim() !== "") {
        const query = busqueda.toLowerCase().trim();
        const matchTitulo = reporte.titulo.toLowerCase().includes(query);
        const matchQue = reporte.queMuestra.toLowerCase().includes(query);
        const matchUtilidad = reporte.utilidadNegocio.toLowerCase().includes(query);
        const matchId = reporte.id.toLowerCase().includes(query);
        if (!matchTitulo && !matchQue && !matchUtilidad && !matchId) {
          return false;
        }
      }

      return true;
    });
  }, [categoria, busqueda]);

  const handleVerReporte = (reporte: ReporteCatalogoItem) => {
    const data = getPreviewDataForReport(reporte.id, periodoTexto);
    setPreviewData(data);
    setIsModalOpen(true);
  };

  const handleExportarDirecto = (reporte: ReporteCatalogoItem) => {
    const data = getPreviewDataForReport(reporte.id, periodoTexto);
    // Exportación inmediata CSV
    const headers = data.columnas.map((c) => `"${c.label}"`).join(",");
    const rows = data.filas
      .map((fila) =>
        data.columnas
          .map((col) => {
            const val = String(fila[col.key] ?? "");
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const csvContent = "\uFEFF" + `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${data.reporteId.toLowerCase()}_${data.titulo.toLowerCase().replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDescargarPaquete = () => {
    const content = `SUNNIX CENTRO MÉDICO - PAQUETE EJECUTIVO CONSOLIDADO
=====================================================
Período: ${periodoTexto}
Ocupación de Consultorios: 78.4%
Total Pacientes Atendidos: 1.420
Recaudación y Cobranzas: $ 28.940.000 ARS
Membresías Activas: 385 socios
Auditoría Médica y de Gestión: Homologada
=====================================================`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reportes_Ejecutivos_Sunnix_${periodoTexto.replace(" ", "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header del Módulo con Breadcrumb y Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Reportes</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Centro de Inteligencia Operativa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reportes clave para tu centro médico
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Matriz de 18 informes estratégicos: gestión clínica, productividad de consultorios, finanzas y suministros.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold">
            <FileBarChart className="w-4 h-4 text-blue-600" />
            <span>18 Reportes Disponibles</span>
          </div>

          <button
            type="button"
            onClick={handleDescargarPaquete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Descargar paquete</span>
          </button>
        </div>
      </div>

      {/* 1. Resumen Ejecutivo Consolidado (Executive KPI Strip) */}
      <section aria-label="Indicadores ejecutivos consolidados">
        <ResumenEjecutivoStrip resumen={MOCK_RESUMEN_EJECUTIVO_STRIP} />
      </section>

      {/* 2. Barra de Filtros por Período y Categorías */}
      <section aria-label="Filtros del catálogo de reportes">
        <ReportesFiltroBar
          periodoSeleccionado={periodo}
          onPeriodoChange={setPeriodo}
          categoriaSeleccionada={categoria}
          onCategoriaChange={setCategoria}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          conteos={conteos}
        />
      </section>

      {/* 3. Catálogo de los 18 Reportes Clave */}
      <section aria-label="Catálogo interactivo de reportes clave">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Catálogo de reportes ({reportesFiltrados.length})
          </h2>
          <span className="text-xs text-slate-500">
            Estructura: Muestra de datos • Finalidad de negocio • Exportación directa
          </span>
        </div>

        <CatalogoReportesGrid
          reportes={reportesFiltrados}
          onVerReporte={handleVerReporte}
          onExportarReporte={handleExportarDirecto}
        />
      </section>

      {/* 4. Modal de Previsualización y Exportación */}
      <ReportePreviewModal
        data={previewData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
