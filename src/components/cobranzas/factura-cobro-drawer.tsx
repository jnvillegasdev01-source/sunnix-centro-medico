"use client";

import React, { useState } from "react";
import { FacturaCobroItem } from "@/types/finanzas";
import {
  X,
  Receipt,
  User,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface FacturaCobroDrawerProps {
  readonly factura: FacturaCobroItem | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onRegistrarCobro?: (factura: FacturaCobroItem, monto: number) => void;
  readonly onPagoParcial?: (factura: FacturaCobroItem, montoParcial: number) => void;
  readonly onNotaCredito?: (factura: FacturaCobroItem) => void;
}

export function FacturaCobroDrawer({
  factura,
  isOpen,
  onClose,
  onRegistrarCobro,
  onPagoParcial,
  onNotaCredito,
}: FacturaCobroDrawerProps) {
  const [activeTab, setActiveTab] = useState<"liquidacion" | "detalle" | "mora">("liquidacion");
  const [montoParcialInput, setMontoParcialInput] = useState<string>("25000");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !factura) {
    return null;
  }

  const handleCobroTotal = () => {
    onRegistrarCobro?.(factura, factura.totalACobrar);
    setFeedbackMsg(`Cobro total registrado por $${factura.totalACobrar.toLocaleString("es-AR")} para ${factura.pacienteNombre}.`);
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 800);
  };

  const handleAplicarPagoParcial = () => {
    const monto = Number(montoParcialInput);
    if (isNaN(monto) || monto <= 0 || monto >= factura.totalACobrar) {
      setErrorMsg("Ingrese un monto parcial válido (mayor a $0 y menor al total).");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }
    onPagoParcial?.(factura, monto);
    setFeedbackMsg(`Pago parcial registrado por $${monto.toLocaleString("es-AR")}. Saldo: $${(factura.totalACobrar - monto).toLocaleString("es-AR")}.`);
    setTimeout(() => {
      setFeedbackMsg(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
                <Receipt className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    {factura.numeroFactura}
                  </span>
                  {factura.estado === "vencida" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      Vencida
                    </span>
                  )}
                  {factura.estado === "hoy_vence" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                      Hoy vence
                    </span>
                  )}
                  {factura.estado === "por_vencer" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                      Por vencer
                    </span>
                  )}
                  {factura.estado === "al_dia" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Al día
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {factura.pacienteNombre}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {factura.concepto}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Tarjeta de Liquidación Total */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Total Liquidado a Percibir
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  Base 2.0% mensual
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  ${factura.totalACobrar.toLocaleString("es-AR")}
                </span>
                {factura.interesCalculado > 0 && (
                  <span className="text-xs font-bold text-rose-600">
                    Incluye mora (+${factura.interesCalculado.toLocaleString("es-AR")})
                  </span>
                )}
              </div>

              {/* Desglose Matemático */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Monto original:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ${factura.montoOriginal.toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Días transcurridos en mora:</span>
                  <span
                    className={`font-mono font-bold ${
                      factura.diasAtraso > 0 ? "text-rose-600" : "text-slate-700"
                    }`}
                  >
                    {factura.diasAtraso > 0 ? `${factura.diasAtraso} días` : "0 días (al día)"}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Interés punitorio acumulado:</span>
                  <span
                    className={`font-mono font-bold ${
                      factura.interesCalculado > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    ${factura.interesCalculado.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("liquidacion")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "liquidacion"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Liquidación</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("detalle")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "detalle"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paciente & Fechas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mora")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "mora"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Parámetros de mora</span>
              </button>
            </div>

            {/* TAB: Liquidación y Pago Parcial */}
            {activeTab === "liquidacion" && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="font-semibold text-slate-800">
                    Opciones de cancelación
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-500 block">
                      Monto para pago parcial ($):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={montoParcialInput}
                        onChange={(e) => setMontoParcialInput(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAplicarPagoParcial}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg font-semibold shrink-0 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      El saldo remanente generará una cuota sucesora con nuevo vencimiento.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Paciente y Fechas */}
            {activeTab === "detalle" && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Paciente asociado
                      </span>
                      <span className="font-semibold text-slate-800">
                        {factura.pacienteNombre} (ID: {factura.pacienteId})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Fecha de emisión
                      </span>
                      <span className="font-mono font-medium text-slate-700">
                        {factura.fechaEmision}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Fecha límite de vencimiento
                      </span>
                      <span className="font-mono font-medium text-slate-700">
                        {factura.fechaVencimiento}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Parámetros de Mora */}
            {activeTab === "mora" && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tasa mensual estipulada:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      2.00% mensual
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tasa diaria aplicada:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      0.066% diario
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/80">
                    <span className="text-slate-500">Fórmula de cálculo:</span>
                    <span className="font-mono text-[11px] text-blue-700">
                      Monto * (0.02 / 30) * Días
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mensajes de Feedback y Error */}
            {feedbackMsg && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Footer de Acciones */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onNotaCredito?.(factura);
                setFeedbackMsg(`Nota de crédito generada para anular ${factura.numeroFactura}.`);
                setTimeout(() => {
                  setFeedbackMsg(null);
                  onClose();
                }, 800);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Nota de crédito
            </button>

            <button
              type="button"
              onClick={handleAplicarPagoParcial}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Pago parcial
            </button>

            <button
              type="button"
              onClick={handleCobroTotal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Registrar cobro total</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
