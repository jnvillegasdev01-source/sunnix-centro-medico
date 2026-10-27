"use client";

import React, { useState, useMemo } from "react";
import { ProveedorItem, OrdenCompraItem, RecepcionMercaderiaItem } from "@/types/stock";
import {
  MOCK_PROVEEDORES,
  MOCK_COMPRAS_KPIS,
  MOCK_ORDENES_COMPRA,
} from "@/lib/data/mock-stock";
import { ComprasKpisHeader } from "@/components/compras/compras-kpis-header";
import { ProveedoresDataTable } from "@/components/compras/proveedores-data-table";
import { ProveedorDrawerDetalle } from "@/components/compras/proveedor-drawer-detalle";
import { OrdenesRecepcionPanel } from "@/components/compras/ordenes-recepcion-panel";
import { NuevoProveedorModal } from "@/components/compras/nuevo-proveedor-modal";
import { NuevaOCModal } from "@/components/compras/nueva-oc-modal";
import {
  Building2,
  RefreshCw,
  Search,
  ChevronDown,
  Plus,
  Download,
  ShoppingCart,
} from "lucide-react";

export default function ComprasPage() {
  const [proveedores, setProveedores] = useState<readonly ProveedorItem[]>(
    () => [...MOCK_PROVEEDORES]
  );
  const [ordenesCompra, setOrdenesCompra] = useState<readonly OrdenCompraItem[]>(
    () => [...MOCK_ORDENES_COMPRA]
  );
  const [busqueda, setBusqueda] = useState<string>("");
  const [rubroSeleccionado, setRubroSeleccionado] = useState<string>("todos");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("todos");

  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNuevoProveedorOpen, setIsNuevoProveedorOpen] = useState<boolean>(false);
  const [isNuevaOCOpen, setIsNuevaOCOpen] = useState<boolean>(false);
  const [ocPreselectedProveedor, setOcPreselectedProveedor] = useState<ProveedorItem | null>(null);

  // Filtrado de proveedores
  const proveedoresFiltrados = useMemo(() => {
    return proveedores.filter((prov) => {
      if (estadoSeleccionado === "activos" && !prov.activo) return false;
      if (estadoSeleccionado === "inactivos" && prov.activo) return false;

      if (
        rubroSeleccionado !== "todos" &&
        !prov.rubro.toLowerCase().includes(rubroSeleccionado.toLowerCase())
      ) {
        return false;
      }

      if (busqueda.trim() !== "") {
        const query = busqueda.toLowerCase().trim();
        const matchesNombre = prov.razonSocial.toLowerCase().includes(query);
        const matchesCuit = prov.cuit.includes(query);
        const matchesRubro = prov.rubro.toLowerCase().includes(query);
        const matchesContacto = prov.contactoComercial.toLowerCase().includes(query);
        if (!matchesNombre && !matchesCuit && !matchesRubro && !matchesContacto) {
          return false;
        }
      }

      return true;
    });
  }, [proveedores, busqueda, rubroSeleccionado, estadoSeleccionado]);

  const handleSelectProveedor = (prov: ProveedorItem) => {
    setSelectedProveedor(prov);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleResetFiltros = () => {
    setBusqueda("");
    setRubroSeleccionado("todos");
    setEstadoSeleccionado("todos");
  };

  const handleCrearOC = (prov: ProveedorItem) => {
    setOcPreselectedProveedor(prov);
    setIsNuevaOCOpen(true);
  };

  const handleSaveNuevoProveedor = (nuevo: ProveedorItem) => {
    setProveedores((prev) => [nuevo, ...prev]);
  };

  const handleSaveNuevaOC = (nuevaOC: OrdenCompraItem) => {
    setOrdenesCompra((prev) => [nuevaOC, ...prev]);
  };

  const handleExportarProveedores = () => {
    const headers = "ID,RazonSocial,CUIT,Rubro,Telefono,Email,Direccion,CondicionPagoDias,Estado\n";
    const rows = proveedoresFiltrados
      .map(
        (p) =>
          `"${p.id}","${p.razonSocial}","${p.cuit}","${p.rubro}","${p.telefono}","${p.email}","${p.direccion}","${p.condicionPagoDias}","${p.activo ? "Activo" : "Inactivo"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Catalogo_Proveedores_Sunnix_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerOC = (oc: OrdenCompraItem) => {
    const content = `SUNNIX CENTRO MÉDICO - ORDEN DE COMPRA OFICIAL
==================================================
Número de Orden: ${oc.numeroOrden}
Proveedor Adjudicado: ${oc.proveedorNombre}
Fecha de Emisión: ${oc.fecha}
Estado Administrativo: ${oc.estado.toUpperCase()}
Monto Estimado Total: $ ${oc.montoTotal.toLocaleString("es-AR")} ARS
Ítems / Renglones de Pedido: ${oc.itemsCount ?? 1}
==================================================
Autorizado por Dirección Médica y Compras Sunnix.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Orden_Compra_${oc.numeroOrden}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerRecepcion = (rc: RecepcionMercaderiaItem) => {
    const content = `SUNNIX CENTRO MÉDICO - REMITO DE RECEPCIÓN
==================================================
Identificador Remito: ${rc.id.toUpperCase()}
Orden de Compra Vinculada: ${rc.ordenCompraNumero}
Proveedor: ${rc.proveedorNombre}
Fecha de Ingreso: ${rc.fecha}
Estado de Recepción: ${rc.estado === "completa" ? "RECEPCIÓN CONFORME Y COMPLETA" : "RECEPCIÓN PARCIAL"}
Bultos / Ítems Auditados: ${rc.itemsContados} unidades
==================================================
Ingreso registrado en farmacia y depósito central Sunnix.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Remito_Recepcion_${rc.id}.txt`;
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
            <span>Compras</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Proveedores y Adquisiciones</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de compras y proveedores
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de homologación de proveedores, emisión de órdenes de compra y fiscalización de recepciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Circuito Homologado</span>
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

      {/* 1. KPIs Superiores de Compras */}
      <section aria-label="Indicadores clave de compras y proveedores">
        <ComprasKpisHeader kpis={MOCK_COMPRAS_KPIS} />
      </section>

      {/* 2. Barra de Filtros y Acciones de Proveedores */}
      <section aria-label="Filtros de proveedores">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Buscador */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por razón social, CUIT o contacto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filtros y Botones */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rubro */}
            <div className="relative">
              <select
                value={rubroSeleccionado}
                onChange={(e) => setRubroSeleccionado(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="todos">Todos los rubros</option>
                <option value="Descartables">Descartables y Soluciones</option>
                <option value="Higiene">Higiene y Desinfección</option>
                <option value="Curación">Material de Curación</option>
                <option value="Medicamentos">Medicamentos y Farmacia</option>
                <option value="Instrumental">Instrumental Quirúrgico</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Estado */}
            <div className="relative">
              <select
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Exportar */}
            <button
              type="button"
              onClick={handleExportarProveedores}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            {/* Nueva Orden de Compra */}
            <button
              type="button"
              onClick={() => {
                setOcPreselectedProveedor(null);
                setIsNuevaOCOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>+ Nueva OC</span>
            </button>

            {/* Nuevo Proveedor */}
            <button
              type="button"
              onClick={() => setIsNuevoProveedorOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Nuevo proveedor</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Tabla Principal de Proveedores */}
      <section aria-label="Listado de proveedores registrados">
        <ProveedoresDataTable
          proveedores={proveedoresFiltrados}
          onSelectProveedor={handleSelectProveedor}
          proveedorSeleccionadoId={selectedProveedor?.id}
          onCrearOC={handleCrearOC}
        />
      </section>

      {/* 4. Paneles de Órdenes de Compra y Recepción */}
      <section aria-label="Órdenes de compra y recepción de mercadería">
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Órdenes de compra y control de recepción
          </h2>
          <p className="text-xs text-slate-500">
            Seguimiento de pedidos en curso, recepciones de remito y distribución de compras por rubro.
          </p>
        </div>

        <OrdenesRecepcionPanel
          ordenes={ordenesCompra}
          onVerOC={handleVerOC}
          onVerRecepcion={handleVerRecepcion}
        />
      </section>

      {/* 5. Drawer Lateral de Detalle del Proveedor */}
      <ProveedorDrawerDetalle
        proveedor={selectedProveedor}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onCrearOC={handleCrearOC}
      />

      {/* Modal Alta de Proveedor */}
      <NuevoProveedorModal
        isOpen={isNuevoProveedorOpen}
        onClose={() => setIsNuevoProveedorOpen(false)}
        onSave={handleSaveNuevoProveedor}
      />

      {/* Modal Emisión de Orden de Compra */}
      <NuevaOCModal
        isOpen={isNuevaOCOpen}
        onClose={() => setIsNuevaOCOpen(false)}
        onSave={handleSaveNuevaOC}
        proveedores={proveedores}
        preselectedProveedor={ocPreselectedProveedor}
      />
    </div>
  );
}
