"use client";

import React, { useState } from "react";
import { CirugiaItem, EstadoCirugia } from "@/types/agenda";
import { X, Scissors, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevaCirugiaModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nueva: CirugiaItem) => void;
}

export function NuevaCirugiaModal({
  isOpen,
  onClose,
  onSave,
}: NuevaCirugiaModalProps) {
  const [pacienteNombre, setPacienteNombre] = useState<string>("");
  const [pacienteDni, setPacienteDni] = useState<string>("");
  const [procedimiento, setProcedimiento] = useState<string>("Biopsia cutánea por punción");
  const [cirujanoNombre, setCirujanoNombre] = useState<string>("Dr. Roberto Rossi");
  const [quirofanoNombre, setQuirofanoNombre] = useState<"Quirófano 1" | "Quirófano 2">("Quirófano 1");
  const [horaInicio, setHoraInicio] = useState<string>("08:00");
  const [duracionHoras, setDuracionHoras] = useState<number>(1.5);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pacienteNombre.trim() || pacienteNombre.length < 3) {
      setError("El nombre del paciente es obligatorio.");
      return;
    }

    if (!procedimiento.trim()) {
      setError("El procedimiento quirúrgico es obligatorio.");
      return;
    }

    const calcHoraFin = (inicio: string, duracion: number): string => {
      const [h, m] = inicio.split(":").map(Number);
      const totalMinutes = h * 60 + m + Math.round(duracion * 60);
      const endH = Math.floor(totalMinutes / 60);
      const endM = totalMinutes % 60;
      return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    };

    const nuevaCirugia: CirugiaItem = {
      id: `cir-${Date.now().toString().slice(-4)}`,
      fecha: "2025-05-12",
      horaInicio,
      horaFin: calcHoraFin(horaInicio, duracionHoras),
      pacienteNombre: pacienteNombre.trim(),
      pacienteDni: pacienteDni.trim() || "31.200.400",
      procedimiento: procedimiento.trim(),
      cirujanoNombre,
      quirofanoNombre,
      duracionHoras,
      estado: "programada" as EstadoCirugia,
    };

    onSave(nuevaCirugia);
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
              <Scissors className="w-4 h-4 text-rose-600" />
              <span>Programar Cirugía Ambulatoria</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Reserva de quirófano, equipo quirúrgico y tiempo estimado de anestesia.
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
            <span>Cirugía programada exitosamente en el cronograma de quirófano.</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Paciente *
              </label>
              <input
                type="text"
                placeholder="Ej: Sebastián Pereyra"
                value={pacienteNombre}
                onChange={(e) => {
                  setPacienteNombre(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                DNI
              </label>
              <input
                type="text"
                placeholder="Ej: 34.500.120"
                value={pacienteDni}
                onChange={(e) => setPacienteDni(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Procedimiento Quirúrgico *
              </label>
              <input
                type="text"
                placeholder="Ej: Hernioplastia inguinal laparoscópica"
                value={procedimiento}
                onChange={(e) => {
                  setProcedimiento(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Cirujano Principal *
              </label>
              <select
                value={cirujanoNombre}
                onChange={(e) => setCirujanoNombre(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
              >
                <option value="Dr. Roberto Rossi">Dr. Roberto Rossi</option>
                <option value="Dr. Marcos Albarracín">Dr. Marcos Albarracín</option>
                <option value="Dra. Laura García">Dra. Laura García</option>
                <option value="Dr. Juan Paéz">Dr. Juan Paéz</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Quirófano *
              </label>
              <select
                value={quirofanoNombre}
                onChange={(e) => setQuirofanoNombre(e.target.value as "Quirófano 1" | "Quirófano 2")}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
              >
                <option value="Quirófano 1">Quirófano 1 (Cirugía Mayor Ambulatoria)</option>
                <option value="Quirófano 2">Quirófano 2 (Procedimientos Menores)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Hora de Inicio *
              </label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
              >
                <option value="08:00">08:00 hs</option>
                <option value="09:30">09:30 hs</option>
                <option value="11:00">11:00 hs</option>
                <option value="13:30">13:30 hs</option>
                <option value="15:00">15:00 hs</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Duración Estimada (Horas) *
              </label>
              <select
                value={duracionHoras}
                onChange={(e) => setDuracionHoras(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
              >
                <option value={0.5}>30 minutos (0.5 hs)</option>
                <option value={1.0}>1 hora (1.0 hs)</option>
                <option value={1.5}>1 hora y media (1.5 hs)</option>
                <option value={2.0}>2 horas (2.0 hs)</option>
                <option value={3.0}>3 horas (3.0 hs)</option>
              </select>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Programar Cirugía</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
