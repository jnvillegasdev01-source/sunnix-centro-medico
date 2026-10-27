"use client";

import React, { useState } from "react";
import { TurnoAgendaItem, TipoTurnoAgenda } from "@/types/agenda";
import { MOCK_PROFESIONALES_FILTRO } from "@/lib/data/mock-agenda";
import { X, CalendarPlus, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevoTurnoAgendaModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevo: TurnoAgendaItem) => void;
}

export function NuevoTurnoAgendaModal({
  isOpen,
  onClose,
  onSave,
}: NuevoTurnoAgendaModalProps) {
  const [pacienteNombre, setPacienteNombre] = useState<string>("");
  const [pacienteDni, setPacienteDni] = useState<string>("");
  const [profesionalId, setProfesionalId] = useState<string>("med-garcia");
  const [horaInicio, setHoraInicio] = useState<string>("09:30");
  const [tipo, setTipo] = useState<TipoTurnoAgenda>("Consulta");
  const [motivo, setMotivo] = useState<string>("Consulta médica general");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pacienteNombre.trim() || pacienteNombre.length < 3) {
      setError("El nombre del paciente es obligatorio.");
      return;
    }

    if (!pacienteDni.trim()) {
      setError("El DNI del paciente es obligatorio.");
      return;
    }

    const prof = MOCK_PROFESIONALES_FILTRO.find((p) => p.id === profesionalId) ?? MOCK_PROFESIONALES_FILTRO[0];

    const horaFinMap: Record<string, string> = {
      "08:00": "08:30",
      "08:30": "09:00",
      "09:00": "09:30",
      "09:30": "10:00",
      "10:00": "10:30",
      "10:30": "11:00",
      "11:00": "11:30",
      "11:30": "12:00",
      "12:00": "12:30",
      "12:30": "13:00",
    };

    const nuevoTurno: TurnoAgendaItem = {
      id: `tur-agenda-${Date.now().toString().slice(-4)}`,
      pacienteId: `p-${Date.now().toString().slice(-3)}`,
      pacienteNombre: pacienteNombre.trim(),
      pacienteDni: pacienteDni.trim(),
      pacienteEdad: 35,
      profesionalId: prof.id,
      profesionalNombre: prof.nombre,
      consultorioId: prof.consultorioId,
      consultorioNombre: `Consultorio ${prof.consultorioId.replace("c-", "")}`,
      fecha: "2025-05-12",
      horaInicio,
      horaFin: horaFinMap[horaInicio] ?? "10:00",
      tipo,
      motivo: motivo.trim() || "Atención ambulatoria",
      estado: "confirmado",
    };

    onSave(nuevoTurno);
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
              <CalendarPlus className="w-4 h-4 text-sky-600" />
              <span>Agendar Turno en Consultorio</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Asigna paciente, médico de cabecera y franja horaria.
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
            <span>Turno agendado en la grilla correctamente.</span>
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
                Nombre del Paciente *
              </label>
              <input
                type="text"
                placeholder="Ej: Marcelo Galli"
                value={pacienteNombre}
                onChange={(e) => {
                  setPacienteNombre(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                DNI / Documento *
              </label>
              <input
                type="text"
                placeholder="Ej: 32.119.890"
                value={pacienteDni}
                onChange={(e) => {
                  setPacienteDni(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Profesional Asignado *
              </label>
              <select
                value={profesionalId}
                onChange={(e) => setProfesionalId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                {MOCK_PROFESIONALES_FILTRO.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombre} ({prof.especialidad})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Horario de Inicio *
              </label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="08:00">08:00 hs</option>
                <option value="08:30">08:30 hs</option>
                <option value="09:00">09:00 hs</option>
                <option value="09:30">09:30 hs</option>
                <option value="10:00">10:00 hs</option>
                <option value="10:30">10:30 hs</option>
                <option value="11:00">11:00 hs</option>
                <option value="11:30">11:30 hs</option>
                <option value="12:00">12:00 hs</option>
                <option value="12:30">12:30 hs</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Tipo de Consulta
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoTurnoAgenda)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
            >
              <option value="Consulta">Consulta médica</option>
              <option value="Control">Control evolutivo</option>
              <option value="Primera consulta">Primera consulta</option>
              <option value="Procedimiento">Procedimiento ambulatorio</option>
              <option value="Electrocardiograma">Electrocardiograma</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Motivo del Turno
            </label>
            <input
              type="text"
              placeholder="Ej: Dolor torácico intermitente, control de presión..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Agendar Turno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
