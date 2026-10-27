"use client";

import React, { useState } from "react";
import { TesoreriaKpis } from "@/components/finanzas/tesoreria-kpis";
import { CuentasBancosWidget } from "@/components/finanzas/cuentas-bancos-widget";
import { GraficosFinanzas } from "@/components/finanzas/graficos-finanzas";
import { TablasMovimientosPanel } from "@/components/finanzas/tablas-movimientos-panel";
import { NuevoMovimientoModal } from "@/components/finanzas/nuevo-movimiento-modal";
import {
  MOCK_TESORERIA_KPIS,
  MOCK_CUENTAS_BANCOS,
  MOCK_MOVIMIENTOS_INGRESOS,
  MOCK_MOVIMIENTOS_EGRESOS,
  MOCK_DISTRIBUCION_EGRESOS,
  MOCK_RESUMEN_CATEGORIA_INGRESOS,
  MOCK_EVOLUCION_FINANCIERA,
} from "@/lib/data/mock-finanzas";
import {
  Wallet,
  Download,
  Calendar,
} from "lucide-react";

export default function FinanzasPage() {
  const [periodo] = useState<string>("Mayo 2025");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleNuevoMovimiento = () => {
    setIsModalOpen(true);
  };

  const handleTransferir = () => {
    setIsModalOpen(true);
  };

  const handleConciliar = () => {
    // Conciliation status
  };

  const handleExportarBalance = () => {
    const content = `SUNNIX CENTRO MÉDICO - BALANCE DE TESORERÍA (${periodo})
=====================================================
Saldo Disponible en Cuentas: $ 24.580.000 ARS
Ingresos Operativos del Mes: $ 18.420.000 ARS
Egresos y Compras del Mes: $ 11.230.000 ARS
Superávit Neto Operativo: $ 7.190.000 ARS
Fecha de Auditoría: ${new Date().toLocaleDateString("es-AR")}
Auditoría Oficial: Gerencia de Administración y Finanzas Sunnix
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Balance_Tesoreria_Sunnix_${periodo.replace(" ", "_")}.txt`;
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
            <span>Finanzas</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Tesorería y Liquidez</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Ingresos, egresos y tesorería
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de flujo de caja, conciliación de cuentas bancarias y balance operativo mensual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Período: {periodo}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Tesorería Auditada</span>
          </div>

          <button
            type="button"
            onClick={handleExportarBalance}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Exportar balance"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. KPIs Superiores de Tesorería */}
      <section aria-label="Indicadores ejecutivos de tesorería">
        <TesoreriaKpis
          kpis={MOCK_TESORERIA_KPIS}
          onNuevoMovimiento={handleNuevoMovimiento}
        />
      </section>

      {/* 2. Widget de Cuentas y Bancos en Tiempo Real */}
      <section aria-label="Saldos por cuenta y disponibilidad bancaria">
        <CuentasBancosWidget
          cuentas={MOCK_CUENTAS_BANCOS}
          onTransferir={handleTransferir}
          onConciliar={handleConciliar}
        />
      </section>

      {/* 3. Panel de Gráficos y Distribución */}
      <section aria-label="Analítica y evolución de flujo de fondos">
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Analítica de flujo y distribución de recursos
          </h2>
          <p className="text-xs text-slate-500">
            Evolución histórica de ingresos vs. egresos y composición de gastos por centro de costo.
          </p>
        </div>

        <GraficosFinanzas
          evolucion={MOCK_EVOLUCION_FINANCIERA}
          egresos={MOCK_DISTRIBUCION_EGRESOS}
          ingresosPorCategoria={MOCK_RESUMEN_CATEGORIA_INGRESOS}
        />
      </section>

      {/* 4. Tablas del Libro Diario de Ingresos y Egresos */}
      <section aria-label="Libro diario de tesorería">
        <TablasMovimientosPanel
          ingresos={MOCK_MOVIMIENTOS_INGRESOS}
          egresos={MOCK_MOVIMIENTOS_EGRESOS}
          onVerMovimiento={() => {}}
        />
      </section>

      {/* Modal de Nuevo Movimiento */}
      <NuevoMovimientoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
      />
    </div>
  );
}
