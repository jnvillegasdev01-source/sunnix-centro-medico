"use client";

import React, { useState, useMemo } from "react";
import { InsumoItem } from "@/types/stock";
import { MOCK_INSUMOS, MOCK_STOCK_KPIS } from "@/lib/data/mock-stock";
import { StockKpisHeader } from "@/components/stock/stock-kpis-header";
import { StockFiltrosBar } from "@/components/stock/stock-filtros-bar";
import { InsumosDataTable } from "@/components/stock/insumos-data-table";
import { InsumoDrawerDetalle } from "@/components/stock/insumo-drawer-detalle";
import { StockMetricasPanel } from "@/components/stock/stock-metricas-panel";
import { NuevoInsumoModal } from "@/components/stock/nuevo-insumo-modal";
import {
  Boxes,
  RefreshCw,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Building2,
  FolderTree,
} from "lucide-react";

type VistaStockTab =
  | "listado"
  | "entradas"
  | "salidas"
  | "ordenes"
  | "proveedores"
  | "categorias";

export default function StockPage() {
  const [insumos, setInsumos] = useState<readonly InsumoItem[]>(
    () => [...MOCK_INSUMOS]
  );
  const [activeTab, setActiveTab] = useState<VistaStockTab>("listado");

  // Filtros
  const [busqueda, setBusqueda] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("todas");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("todos");
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>("todas");
  const [soloStockBajo, setSoloStockBajo] = useState<boolean>(false);

  // Drawer
  const [selectedInsumo, setSelectedInsumo] = useState<InsumoItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNuevoInsumoModalOpen, setIsNuevoInsumoModalOpen] = useState<boolean>(false);

  // Filtrado reactivo de inventario
  const insumosFiltrados = useMemo(() => {
    return insumos.filter((item) => {
      // Regla de Negocio: Switch "Solo stock bajo"
      if (soloStockBajo && item.estado === "normal") {
        return false;
      }

      // Filtro por Estado
      if (estadoSeleccionado !== "todos" && item.estado !== estadoSeleccionado) {
        return false;
      }

      // Filtro por Categoría
      if (
        categoriaSeleccionada !== "todas" &&
        item.categoria !== categoriaSeleccionada
      ) {
        return false;
      }

      // Filtro por Ubicación
      if (
        ubicacionSeleccionada !== "todas" &&
        !item.ubicacion.toLowerCase().includes(ubicacionSeleccionada.toLowerCase())
      ) {
        return false;
      }

      // Filtro por Búsqueda libre
      if (busqueda.trim() !== "") {
        const query = busqueda.toLowerCase().trim();
        const matchesNombre = item.nombre.toLowerCase().includes(query);
        const matchesCodigo = item.codigo.toLowerCase().includes(query);
        const matchesProveedor = item.proveedorHabitualNombre.toLowerCase().includes(query);
        const matchesUbicacion = item.ubicacion.toLowerCase().includes(query);
        if (!matchesNombre && !matchesCodigo && !matchesProveedor && !matchesUbicacion) {
          return false;
        }
      }

      return true;
    });
  }, [
    insumos,
    soloStockBajo,
    estadoSeleccionado,
    categoriaSeleccionada,
    ubicacionSeleccionada,
    busqueda,
  ]);

  const handleSelectInsumo = (item: InsumoItem) => {
    setSelectedInsumo(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleResetFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("todas");
    setEstadoSeleccionado("todos");
    setUbicacionSeleccionada("todas");
    setSoloStockBajo(false);
  };

  const handleRegistrarEntrada = (item: InsumoItem) => {
    setInsumos((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              stockActual: i.stockActual + 20,
              estado:
                i.stockActual + 20 > i.stockMinimo
                  ? "normal"
                  : i.stockActual + 20 === 0
                  ? "sin_stock"
                  : "stock_bajo",
            }
          : i
      )
    );
  };

  const handleRegistrarSalida = (item: InsumoItem) => {
    if (item.stockActual <= 0) {
      return;
    }
    setInsumos((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        const nuevoStock = Math.max(0, i.stockActual - 5);
        return {
          ...i,
          stockActual: nuevoStock,
          estado:
            nuevoStock === 0
              ? "sin_stock"
              : nuevoStock <= i.stockMinimo
              ? "stock_bajo"
              : "normal",
        };
      })
    );
  };

  const handleCrearOC = (item: InsumoItem) => {
    handleRegistrarEntrada(item);
  };

  const handleSaveNuevoInsumo = (nuevo: InsumoItem) => {
    setInsumos((prev) => [nuevo, ...prev]);
  };

  const handleExportarStock = () => {
    const headers = "ID,Nombre,Codigo,Categoria,StockActual,StockMinimo,Ubicacion,Proveedor\n";
    const rows = insumosFiltrados.map((i) => `"${i.id}","${i.nombre}","${i.codigo}","${i.categoria}","${i.stockActual}","${i.stockMinimo}","${i.ubicacion}","${i.proveedorHabitualNombre}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Stock_General_Sunnix_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header del Módulo con Breadcrumb y Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Insumos y Stock</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Control de inventario</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Stock de insumos médicos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión y trazabilidad de descartables, medicamentos y materiales de consultorio y quirófano.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold">
            <Boxes className="w-4 h-4 text-blue-600" />
            <span>Inventario Activo</span>
          </div>

          <button
            type="button"
            onClick={handleResetFiltros}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Restablecer filtros"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. KPIs Superiores de Stock */}
      <section aria-label="Indicadores clave de inventario">
        <StockKpisHeader kpis={MOCK_STOCK_KPIS} />
      </section>

      {/* Tabs de Vistas de Stock */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("listado")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "listado"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Listado de insumos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("entradas")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "entradas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Entradas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("salidas")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "salidas"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Salidas / Consumo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ordenes")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "ordenes"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Órdenes de compra</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("proveedores")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "proveedores"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Proveedores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categorias")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "categorias"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categorías</span>
        </button>
      </div>

      {/* 2. Barra de Filtros y Acciones */}
      <section aria-label="Filtros de inventario">
        <StockFiltrosBar
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
          estadoSeleccionado={estadoSeleccionado}
          onEstadoChange={setEstadoSeleccionado}
          ubicacionSeleccionada={ubicacionSeleccionada}
          onUbicacionChange={setUbicacionSeleccionada}
          soloStockBajo={soloStockBajo}
          onToggleSoloStockBajo={() => setSoloStockBajo((prev) => !prev)}
          onExportar={handleExportarStock}
          onNuevoInsumo={() => setIsNuevoInsumoModalOpen(true)}
          onRegistrarMovimiento={() => {
            if (insumosFiltrados.length > 0) {
              handleRegistrarEntrada(insumosFiltrados[0]);
            }
          }}
        />
      </section>

      {/* 3. Tabla Principal de Insumos */}
      <section aria-label="Tabla de inventario de insumos">
        <InsumosDataTable
          insumos={insumosFiltrados}
          onSelectInsumo={handleSelectInsumo}
          insumoSeleccionadoId={selectedInsumo?.id}
          onRegistrarEntrada={handleRegistrarEntrada}
          onRegistrarSalida={handleRegistrarSalida}
          onCrearOC={handleCrearOC}
        />
      </section>

      {/* 4. Panel Inferior de Métricas */}
      <section aria-label="Analítica de stock y consumos">
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Analítica de consumo y existencias críticas
          </h2>
          <p className="text-xs text-slate-500">
            Distribución por categorías, control de desabastecimiento y evolución mensual de adquisiciones.
          </p>
        </div>

        <StockMetricasPanel
          onSelectInsumo={handleSelectInsumo}
        />
      </section>

      {/* 5. Drawer Lateral de Detalle del Insumo */}
      <InsumoDrawerDetalle
        insumo={selectedInsumo}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onCrearOC={handleCrearOC}
        onRegistrarMovimiento={handleRegistrarEntrada}
      />

      {/* Modal de Alta de Insumo */}
      <NuevoInsumoModal
        isOpen={isNuevoInsumoModalOpen}
        onClose={() => setIsNuevoInsumoModalOpen(false)}
        onSave={handleSaveNuevoInsumo}
      />
    </div>
  );
}
