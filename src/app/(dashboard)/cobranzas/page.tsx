"use client";

import React, { useState } from "react";
import { FacturaCobroItem } from "@/types/finanzas";
import {
  MOCK_COBRANZAS_KPIS,
  MOCK_FACTURAS_COBRO,
  MOCK_ANTIGUEDAD_SALDOS,
} from "@/lib/data/mock-finanzas";
import { CobranzasKpisHeader } from "@/components/cobranzas/cobranzas-kpis-header";
import { FacturasCobroTable } from "@/components/cobranzas/facturas-cobro-table";
import { FacturaCobroDrawer } from "@/components/cobranzas/factura-cobro-drawer";
import { MoraYAntiguedadPanel } from "@/components/cobranzas/mora-y-antiguedad-panel";
import {
  Receipt,
  Download,
  Percent,
} from "lucide-react";

export default function CobranzasPage() {
  const [facturas, setFacturas] = useState<readonly FacturaCobroItem[]>(
    () => [...MOCK_FACTURAS_COBRO]
  );
  const [selectedFactura, setSelectedFactura] = useState<FacturaCobroItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleSelectFactura = (fac: FacturaCobroItem) => {
    setSelectedFactura(fac);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleRegistrarCobro = (fac: FacturaCobroItem) => {
    setFacturas((prev) =>
      prev.map((f) =>
        f.id === fac.id
          ? {
              ...f,
              estado: "cobrada",
              totalACobrar: 0,
              interesCalculado: 0,
            }
          : f
      )
    );
  };

  const handlePagoParcial = (fac: FacturaCobroItem, montoParcial: number) => {
    setFacturas((prev) =>
      prev.map((f) => {
        if (f.id !== fac.id) return f;
        const nuevoTotal = Math.max(0, f.totalACobrar - montoParcial);
        return {
          ...f,
          totalACobrar: nuevoTotal,
        };
      })
    );
  };

  const handleNotaCredito = (fac: FacturaCobroItem) => {
    setFacturas((prev) =>
      prev.map((f) =>
        f.id === fac.id
          ? {
              ...f,
              estado: "cobrada",
              totalACobrar: 0,
              interesCalculado: 0,
            }
          : f
      )
    );
  };

  const handleExportarCobranzas = () => {
    const headers = "ID,Numero,Paciente,PacienteId,Vencimiento,TotalACobrar,Estado\n";
    const rows = facturas.map((f) => `"${f.id}","${f.numeroFactura}","${f.pacienteNombre}","${f.pacienteId}","${f.fechaVencimiento}","${f.totalACobrar}","${f.estado}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cuentas_Por_Cobrar_Sunnix_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header del Módulo con Breadcrumb y Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Cobranzas</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Cuentas por Cobrar & Mora</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de cobranzas y liquidación de mora
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de cuentas por cobrar, cálculo de recargos punitorios diarios al 2.0% mensual y pagos parciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold">
            <Percent className="w-4 h-4 text-blue-600" />
            <span>Mora Activa: 2.0% mes</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>42 comprobantes</span>
          </div>

          <button
            type="button"
            onClick={handleExportarCobranzas}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Exportar cuentas por cobrar"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. KPIs Superiores de Cobranzas */}
      <section aria-label="Indicadores ejecutivos de cuentas por cobrar">
        <CobranzasKpisHeader kpis={MOCK_COBRANZAS_KPIS} />
      </section>

      {/* 2. Tabla Principal de Cuentas por Cobrar */}
      <section aria-label="Tabla de facturas y liquidación de mora">
        <FacturasCobroTable
          facturas={facturas}
          onSelectFactura={handleSelectFactura}
          facturaSeleccionadaId={selectedFactura?.id}
          onCobrarRapido={handleRegistrarCobro}
        />
      </section>

      {/* 3. Panel de Parámetros de Mora y Antigüedad de Saldos */}
      <section aria-label="Motor de cálculo de mora y antigüedad de saldos">
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Política de mora y estratificación de saldos
          </h2>
          <p className="text-xs text-slate-500">
            Reglas de punitorios automáticos, simulador de liquidaciones y distribución por tramos de vencimiento.
          </p>
        </div>

        <MoraYAntiguedadPanel
          antiguedad={MOCK_ANTIGUEDAD_SALDOS}
          tasaMensualBase={2.0}
        />
      </section>

      {/* 4. Drawer Lateral de Liquidación de Factura */}
      <FacturaCobroDrawer
        factura={selectedFactura}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onRegistrarCobro={handleRegistrarCobro}
        onPagoParcial={handlePagoParcial}
        onNotaCredito={handleNotaCredito}
      />
    </div>
  );
}
