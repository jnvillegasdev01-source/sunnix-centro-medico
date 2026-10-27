"use client";

import React, { useState } from "react";
import { FamiliarDependiente } from "@/types/pacientes";
import { X, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

interface AgregarFamiliarModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevoFamiliar: FamiliarDependiente) => void;
  readonly cantidadActual: number;
}

export function AgregarFamiliarModal({
  isOpen,
  onClose,
  onSave,
  cantidadActual,
}: AgregarFamiliarModalProps) {
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [parentesco, setParentesco] = useState<"Pareja" | "Hijo" | "Otro">("Hijo");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim() || nombreCompleto.trim().length < 3) {
      setError("El nombre completo debe tener al menos 3 caracteres.");
      return;
    }

    if (!dni.trim() || dni.trim().length < 7) {
      setError("El DNI es obligatorio y debe ser válido.");
      return;
    }

    if (cantidadActual >= 4) {
      setError("Se ha alcanzado el cupo máximo de 4 integrantes para este plan.");
      return;
    }

    const nuevoFamiliar: FamiliarDependiente = {
      id: `fam-${Date.now().toString().slice(-4)}`,
      nombreCompleto: nombreCompleto.trim(),
      dni: dni.trim(),
      parentesco,
      estado: "Activo",
    };

    onSave(nuevoFamiliar);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setNombreCompleto("");
      setDni("");
      setError(null);
      onClose();
    }, 800);
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
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>Agregar Familiar al Plan</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Cupo disponible: {cantidadActual} de 4 integrantes.
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
            <span>Familiar incorporado a la membresía con éxito.</span>
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
              Nombre Completo *
            </label>
            <input
              type="text"
              placeholder="Ej: Camila Gómez Torres"
              value={nombreCompleto}
              onChange={(e) => {
                setNombreCompleto(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              DNI / Documento *
            </label>
            <input
              type="text"
              placeholder="Ej: 54.912.801"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Parentesco con el Titular *
            </label>
            <select
              value={parentesco}
              onChange={(e) => setParentesco(e.target.value as "Pareja" | "Hijo" | "Otro")}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
            >
              <option value="Hijo">Hijo / Hija</option>
              <option value="Pareja">Pareja / Cónyuge</option>
              <option value="Otro">Otro dependiente a cargo</option>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Adherir Familiar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
