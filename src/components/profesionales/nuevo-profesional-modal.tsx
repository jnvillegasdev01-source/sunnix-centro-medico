"use client";

import React, { useState } from "react";
import { ProfesionalDetalle } from "@/types/profesionales";
import { X, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

interface NuevoProfesionalModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevo: ProfesionalDetalle) => void;
}

export function NuevoProfesionalModal({
  isOpen,
  onClose,
  onSave,
}: NuevoProfesionalModalProps) {
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [matricula, setMatricula] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [especialidad, setEspecialidad] = useState<string>("Clínica Médica");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [consultorio, setConsultorio] = useState<string>("Consultorio 1");
  const [canon, setCanon] = useState<number>(65000);
  const [biografia, setBiografia] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim() || nombreCompleto.length < 3) {
      setError("El nombre completo debe tener al menos 3 caracteres.");
      return;
    }

    if (!matricula.trim()) {
      setError("La matrícula nacional o provincial es requerida.");
      return;
    }

    if (!telefono.trim() || !email.trim()) {
      setError("El teléfono y correo electrónico son requeridos.");
      return;
    }

    const newId = `med-${Date.now().toString().slice(-4)}`;

    const nuevoProfesional: ProfesionalDetalle = {
      id: newId,
      nombreCompleto: nombreCompleto.trim(),
      matricula: matricula.trim(),
      dni: dni.trim() || "30.000.000",
      especialidad,
      telefono: telefono.trim(),
      email: email.trim(),
      consultorioAsignadoNombre: consultorio,
      montoAlquilerMensual: canon > 0 ? canon : 60000,
      proximoVencimientoAlquiler: "10 del próximo mes",
      facturacionMesActual: 0,
      turnosMesActual: 0,
      estado: "activo",
      biografia: biografia.trim() || `Especialista en ${especialidad} del equipo médico Sunnix.`,
      agendaSemanal: [
        { dia: "Lunes", horario: "08:00 - 13:00", consultorioNombre: consultorio, activo: true },
        { dia: "Martes", horario: "-", consultorioNombre: consultorio, activo: false },
        { dia: "Miércoles", horario: "08:00 - 13:00", consultorioNombre: consultorio, activo: true },
        { dia: "Jueves", horario: "-", consultorioNombre: consultorio, activo: false },
        { dia: "Viernes", horario: "14:00 - 18:00", consultorioNombre: consultorio, activo: true },
        { dia: "Sábado", horario: "-", consultorioNombre: "-", activo: false },
      ],
      documentos: [
        {
          id: `doc-${newId}-1`,
          nombreArchivo: "Titulo_Grado_Legalizado.pdf",
          tipo: "Titulo médico",
          fechaSubida: new Date().toLocaleDateString("es-AR"),
          urlDescarga: "#",
          estado: "Vigente",
        },
      ],
    };

    onSave(nuevoProfesional);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
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
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>Alta de Nuevo Profesional Médico</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Registra un especialista, asigna consultorio y canon mensual.
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
            <span>Profesional dado de alta exitosamente.</span>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nombre Completo *
              </label>
              <input
                type="text"
                placeholder="Ej: Dr. Gustavo Morales"
                value={nombreCompleto}
                onChange={(e) => {
                  setNombreCompleto(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Matrícula Profesional *
              </label>
              <input
                type="text"
                placeholder="Ej: MN 142.890"
                value={matricula}
                onChange={(e) => {
                  setMatricula(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Especialidad Principal *
              </label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="Clínica Médica">Clínica Médica</option>
                <option value="Dermatología y Estética Médica">Dermatología y Estética Médica</option>
                <option value="Cardiología y Arritmias">Cardiología y Arritmias</option>
                <option value="Ginecología y Obstetricia">Ginecología y Obstetricia</option>
                <option value="Traumatología y Ortopedia">Traumatología y Ortopedia</option>
                <option value="Endocrinología">Endocrinología</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                DNI / Documento
              </label>
              <input
                type="text"
                placeholder="Ej: 29.800.123"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                placeholder="Ej: +54 9 11 4982-5500"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Correo Institucional *
              </label>
              <input
                type="email"
                placeholder="Ej: gustavo.morales@sunnix.med"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Consultorio Fijo Asignado *
              </label>
              <select
                value={consultorio}
                onChange={(e) => setConsultorio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="Consultorio 1">Consultorio 1</option>
                <option value="Consultorio 2">Consultorio 2</option>
                <option value="Consultorio 3">Consultorio 3</option>
                <option value="Consultorio 4">Consultorio 4</option>
                <option value="Consultorio 5">Consultorio 5</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Canon de Alquiler Mensual ($ ARS) *
              </label>
              <input
                type="number"
                value={canon}
                onChange={(e) => setCanon(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Perfil Profesional / Biografía Resumida
            </label>
            <textarea
              rows={2}
              placeholder="Breve reseña de antecedentes académicos y trayectoria..."
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Guardar Profesional</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
