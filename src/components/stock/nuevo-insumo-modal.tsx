"use client";

import React, { useState } from "react";
import { InsumoItem, CategoriaInsumo, EstadoStock } from "@/types/stock";
import { X, PackagePlus, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevoInsumoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevo: InsumoItem) => void;
}

export function NuevoInsumoModal({
  isOpen,
  onClose,
  onSave,
}: NuevoInsumoModalProps) {
  const [nombre, setNombre] = useState<string>("");
  const [codigo, setCodigo] = useState<string>("");
  const [categoria, setCategoria] = useState<CategoriaInsumo>("descartables");
  const [presentacion, setPresentacion] = useState<string>("Caja x 100 u");
  const [stockActual, setStockActual] = useState<number>(50);
  const [stockMinimo, setStockMinimo] = useState<number>(20);
  const [ubicacion, setUbicacion] = useState<string>("Depósito Central - Estante A");
  const [proveedor, setProveedor] = useState<string>("Droguería Médica Sur");
  const [costoUnitario, setCostoUnitario] = useState<number>(1200);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || nombre.length < 3) {
      setError("El nombre del insumo es obligatorio.");
      return;
    }

    const newId = `ins-${Date.now().toString().slice(-4)}`;
    const estado: EstadoStock =
      stockActual <= 0
        ? "sin_stock"
        : stockActual <= stockMinimo
        ? "stock_bajo"
        : "normal";

    const nuevoInsumo: InsumoItem = {
      id: newId,
      codigo: codigo.trim() || `INS-${Math.floor(1000 + Math.random() * 9000)}`,
      nombre: nombre.trim(),
      categoria,
      presentacion: presentacion.trim() || "Unidades",
      stockActual,
      stockMinimo,
      estado,
      ubicacion,
      precioCompraReferencia: costoUnitario,
      proveedorHabitualNombre: proveedor,
      ultimaCompraFecha: new Date().toISOString().split("T")[0],
    };

    onSave(nuevoInsumo);
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
              <PackagePlus className="w-4 h-4 text-emerald-600" />
              <span>Alta de Nuevo Insumo Médico</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Registra artículo en inventario, umbrales de reorden y depósito.
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
            <span>Insumo incorporado al inventario con éxito.</span>
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
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Descripción del Insumo / Medicamento *
            </label>
            <input
              type="text"
              placeholder="Ej: Gasas estériles 10x10cm x 100u"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Código SKU / Barras
              </label>
              <input
                type="text"
                placeholder="Ej: INS-8820"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Categoría *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                <option value="descartables">Descartables</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="curaciones">Curaciones</option>
                <option value="higiene">Higiene</option>
                <option value="soluciones">Soluciones</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Presentación (Ej: Caja x 100 u, Frasco x 1 L)
            </label>
            <input
              type="text"
              placeholder="Ej: Caja x 100 u"
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Stock Inicial *
              </label>
              <input
                type="number"
                value={stockActual}
                onChange={(e) => setStockActual(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Stock Mínimo (Alerta) *
              </label>
              <input
                type="number"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Ubicación Física *
              </label>
              <input
                type="text"
                placeholder="Ej: Depósito Central - Estante A"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Costo Unitario ($) *
              </label>
              <input
                type="number"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Proveedor Habitual
            </label>
            <input
              type="text"
              placeholder="Ej: Droguería Médica Sur"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
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
              <PackagePlus className="w-3.5 h-3.5" />
              <span>Guardar Insumo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
