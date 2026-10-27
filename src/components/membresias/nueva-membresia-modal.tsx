"use client";

import React, { useState } from "react";
import { PacienteDetalle, TipoMembresia } from "@/types/pacientes";
import { X, Award, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevaMembresiaModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevoPacienteConPlan: PacienteDetalle) => void;
}

export function NuevaMembresiaModal({
  isOpen,
  onClose,
  onSave,
}: NuevaMembresiaModalProps) {
  const [nombreTitular, setNombreTitular] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [tipoPlan, setTipoPlan] = useState<TipoMembresia>("familiar");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreTitular.trim() || nombreTitular.length < 3) {
      setError("El nombre del titular debe tener al menos 3 caracteres.");
      return;
    }

    if (!dni.trim() || dni.length < 7) {
      setError("El DNI es obligatorio y debe ser válido.");
      return;
    }

    const newId = `p-${Date.now().toString().slice(-4)}`;
    const nuevoPaciente: PacienteDetalle = {
      id: newId,
      nombreCompleto: nombreTitular.trim(),
      dni: dni.trim(),
      edad: 38,
      fechaNacimiento: "1987-04-12",
      telefono: telefono.trim() || "+54 9 11 4000-0000",
      email: email.trim() || "titular@email.com",
      direccion: "Av. Córdoba 2140, CABA",
      obraSocial: "Particular",
      numeroAfiliado: "SUNNIX-SOCIO",
      contactoEmergenciaNombre: "Contacto Familiar",
      contactoEmergenciaTelefono: "+54 9 11 5000-0000",
      estado: "activo",
      alertaMedica: {
        alergias: [],
        enfermedadesPreexistentes: [],
        medicamentosHabituales: [],
        grupoSanguineo: "0+",
      },
      membresia: {
        id: `mem-${newId}`,
        codigo: tipoPlan === "familiar" ? `FAM-${Math.floor(100000 + Math.random() * 900000)}` : `IND-${Math.floor(100000 + Math.random() * 900000)}`,
        nombrePlan: tipoPlan === "familiar" ? "Plan Familiar" : "Plan Individual",
        tipo: tipoPlan,
        estado: "activa",
        fechaVencimiento: "2026-12-31",
        beneficios: [
          "Descuentos en farmacia red Sunnix",
          "Sin copagos en consultas médicas",
          "1 chequeo preventivo anual",
        ],
        familiares: [
          {
            id: `fam-${newId}-1`,
            nombreCompleto: nombreTitular.trim(),
            dni: dni.trim(),
            parentesco: "Titular",
            estado: "Activo",
          },
        ],
      },
      prosimosTurnos: [],
      historialTurnos: [],
    };

    onSave(nuevoPaciente);
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
              <Award className="w-4 h-4 text-blue-600" />
              <span>Alta de Nueva Membresía de Salud</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Registra un titular y genera credencial digital con cobertura Sunnix.
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
            <span>Membresía activada con éxito. Credencial digital emitida.</span>
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
              Nombre y Apellido del Titular *
            </label>
            <input
              type="text"
              placeholder="Ej: Carolina Domínguez"
              value={nombreTitular}
              onChange={(e) => {
                setNombreTitular(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                DNI / Documento *
              </label>
              <input
                type="text"
                placeholder="Ej: 36.192.400"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Tipo de Plan *
              </label>
              <select
                value={tipoPlan}
                onChange={(e) => setTipoPlan(e.target.value as TipoMembresia)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
              >
                <option value="familiar">Plan Familiar (Hasta 4 adherentes)</option>
                <option value="individual">Plan Individual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                placeholder="Ej: +54 9 11 5820-1122"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="Ej: carolina@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Emitir Membresía</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
