"use client";

import React, { useState } from "react";
import { X, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevoMovimientoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (mov: {
    tipo: "ingreso" | "egreso";
    concepto: string;
    monto: number;
    cuenta: string;
    categoria: string;
  }) => void;
}

export function NuevoMovimientoModal({
  isOpen,
  onClose,
  onSave,
}: NuevoMovimientoModalProps) {
  const [tipo, setTipo] = useState<"ingreso" | "egreso">("ingreso");
  const [concepto, setConcepto] = useState<string>("");
  const [monto, setMonto] = useState<number>(45000);
  const [cuenta, setCuenta] = useState<string>("Santander Río Cta Cte");
  const [categoria, setCategoria] = useState<string>("Alquileres de Consultorios");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!concepto.trim() || concepto.length < 3) {
      setError("El concepto del movimiento es obligatorio.");
      return;
    }

    if (monto <= 0) {
      setError("El importe debe ser mayor a 0.");
      return;
    }

    onSave({
      tipo,
      concepto: concepto.trim(),
      monto,
      cuenta,
      categoria,
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Registrar Movimiento de Tesorería</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Asienta cobros de alquileres, copagos o gastos operativos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success message */}
        {showSuccessToast && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Asiento registrado en el Libro Diario de Tesorería.</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("ingreso")}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                tipo === "ingreso"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
              }`}
            >
              + Ingreso / Cobranza
            </button>
            <button
              type="button"
              onClick={() => setTipo("egreso")}
              className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                tipo === "egreso"
                  ? "bg-rose-50 border-rose-300 text-rose-800 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
              }`}
            >
              - Egreso / Pago
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Concepto / Descripción *
            </label>
            <input
              type="text"
              placeholder="Ej: Canon mensual consultorio 2 Dr. López"
              value={concepto}
              onChange={(e) => {
                setConcepto(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Monto ($ ARS) *
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Cuenta / Caja Destino *
              </label>
              <select
                value={cuenta}
                onChange={(e) => setCuenta(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                <option value="Santander Río Cta Cte">Santander Río Cta Cte</option>
                <option value="Banco Galicia Operativa">Banco Galicia Operativa</option>
                <option value="Caja Chica Administración">Caja Chica Administración</option>
                <option value="Mercado Pago Recaudaciones">Mercado Pago Recaudaciones</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Categoría Contable
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
            >
              <option value="Alquileres de Consultorios">Alquileres de Consultorios</option>
              <option value="Copagos y Consultas Particulares">Copagos y Consultas Particulares</option>
              <option value="Membresías de Salud">Membresías de Salud</option>
              <option value="Compra de Insumos">Compra de Insumos y Materiales</option>
              <option value="Servicios y Mantenimiento">Servicios y Mantenimiento</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Asentar Movimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
