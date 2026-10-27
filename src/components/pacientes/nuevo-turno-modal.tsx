"use client";

import React, { useState } from "react";
import { TurnoPaciente } from "@/types/pacientes";
import { X, CalendarPlus, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevoTurnoModalProps {
  readonly pacienteNombre: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevoTurno: TurnoPaciente) => void;
}

const ESPECIALIDADES = [
  { nombre: "Clínica Médica", profesional: "Dr. Carlos Benítez", consultorio: "Consultorio 1" },
  { nombre: "Cardiología", profesional: "Dr. Roberto Rossi", consultorio: "Consultorio 3" },
  { nombre: "Neumonología", profesional: "Dr. Juan Paéz", consultorio: "Consultorio 2" },
  { nombre: "Endocrinología", profesional: "Dra. Silvina Morales", consultorio: "Consultorio 4" },
  { nombre: "Traumatología", profesional: "Dr. Marcos Albarracín", consultorio: "Consultorio 5" },
];

export function NuevoTurnoModal({
  pacienteNombre,
  isOpen,
  onClose,
  onSave,
}: NuevoTurnoModalProps) {
  const [especialidadIndex, setEspecialidadIndex] = useState<number>(0);
  const [fecha, setFecha] = useState<string>("2025-06-12");
  const [hora, setHora] = useState<string>("10:30 hs");
  const [motivo, setMotivo] = useState<string>("Control clínico de rutina");
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fecha) {
      setError("Por favor seleccione la fecha del turno.");
      return;
    }

    const esp = ESPECIALIDADES[especialidadIndex];
    // Format date nicely DD/MM/YYYY
    const parts = fecha.split("-");
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : fecha;

    const nuevoTurno: TurnoPaciente = {
      id: `tur-${Date.now().toString().slice(-4)}`,
      fecha: formattedDate,
      hora,
      especialidad: esp.nombre,
      profesional: esp.profesional,
      consultorio: esp.consultorio,
      estado: "confirmado",
      motivo: motivo.trim() || "Consulta médica general",
    };

    onSave(nuevoTurno);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 800);
  };

  const currentEsp = ESPECIALIDADES[especialidadIndex];

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
              <span>Agendar Nuevo Turno Médico</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Paciente: <strong className="text-slate-700">{pacienteNombre}</strong>
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
            <span>Turno agendado exitosamente en el cronograma.</span>
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
          {/* Especialidad */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Especialidad Médica *
            </label>
            <select
              value={especialidadIndex}
              onChange={(e) => setEspecialidadIndex(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
            >
              {ESPECIALIDADES.map((esp, idx) => (
                <option key={esp.nombre} value={idx}>
                  {esp.nombre} — {esp.profesional} ({esp.consultorio})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="text-slate-500">
              Profesional asignado: <strong className="text-slate-800">{currentEsp.profesional}</strong>
            </div>
            <div className="text-slate-500">
              Espacio físico: <strong className="text-slate-800">{currentEsp.consultorio}</strong>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Fecha del Turno *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Horario Disponible *
              </label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="09:00 hs">09:00 hs</option>
                <option value="09:30 hs">09:30 hs</option>
                <option value="10:00 hs">10:00 hs</option>
                <option value="10:30 hs">10:30 hs</option>
                <option value="11:00 hs">11:00 hs</option>
                <option value="11:30 hs">11:30 hs</option>
                <option value="15:00 hs">15:00 hs</option>
                <option value="15:30 hs">15:30 hs</option>
                <option value="16:00 hs">16:00 hs</option>
                <option value="16:30 hs">16:30 hs</option>
              </select>
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Motivo de Consulta / Observación
            </label>
            <input
              type="text"
              placeholder="Ej: Control de rutina, chequeo de presión, etc."
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
              <span>Confirmar y Agendar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
