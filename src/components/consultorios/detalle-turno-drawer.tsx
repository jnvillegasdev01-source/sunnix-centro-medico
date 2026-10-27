"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { SlotConsultorio, TipoSlotAgenda } from "@/types/profesionales";
import {
  X,
  CreditCard,
  Clock,
  Building2,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Lock,
  ExternalLink,
} from "lucide-react";

interface DetalleTurnoDrawerProps {
  readonly slot: SlotConsultorio | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function DetalleTurnoDrawer({
  slot,
  isOpen,
  onClose,
}: DetalleTurnoDrawerProps) {
  const [checkInDone, setCheckInDone] = React.useState<boolean>(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !slot) return null;

  const isBloqueado = slot.tipo === "bloqueado";

  const getTipoBadge = (tipo: TipoSlotAgenda) => {
    switch (tipo) {
      case "consulta":
        return {
          label: "Consulta Médica",
          classes: "bg-emerald-50 text-emerald-800 border-emerald-300",
        };
      case "control":
        return {
          label: "Control de Evolución",
          classes: "bg-purple-50 text-purple-800 border-purple-300",
        };
      case "procedimiento":
        return {
          label: "Procedimiento Ambulatorio",
          classes: "bg-sky-50 text-sky-800 border-sky-300",
        };
      case "cirugia_menor":
        return {
          label: "Cirugía Menor / Qx",
          classes: "bg-amber-50 text-amber-800 border-amber-300",
        };
      case "bloqueado":
        return {
          label: "Espacio Bloqueado",
          classes: "bg-slate-100 text-slate-700 border-slate-300",
        };
    }
  };

  const tipoBadge = getTipoBadge(slot.tipo);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide mb-1 ${tipoBadge.classes}`}
              >
                {isBloqueado ? (
                  <Lock className="w-3 h-3 text-slate-500" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-current" />
                )}
                {tipoBadge.label}
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {isBloqueado ? slot.motivo : slot.pacienteNombre}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs">
            {/* Horario y Consultorio */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  Horario Asignado
                </span>
                <p className="text-sm font-bold text-slate-800 font-mono">
                  {slot.horaInicio} - {slot.horaFin} hs
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  Ubicación
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {slot.consultorioNombre ?? `Consultorio ${slot.consultorioNumero}`}
                </p>
              </div>
            </div>

            {!isBloqueado && (
              <>
                {/* Paciente y DNI */}
                <div className="space-y-2 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Información del Paciente
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {slot.pacienteNombre}
                    </p>
                    {slot.pacienteDni && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>DNI: {slot.pacienteDni}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/pacientes/p-001"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      <span>Abrir Ficha 360 del Paciente</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Profesional Asignado */}
                <div className="space-y-2 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Profesional Médico
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {slot.profesionalNombre}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {slot.especialidad ?? "Especialista"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Motivo de Consulta */}
                {slot.motivo && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Motivo del Turno
                    </span>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 leading-relaxed">
                      {slot.motivo}
                    </div>
                  </div>
                )}

                {/* Notas Clínicas / Operativas */}
                {slot.notas && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Notas de Coordinación / Alertas
                    </span>
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 leading-relaxed flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{slot.notas}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {isBloqueado && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Motivo del Bloqueo Operativo</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {slot.motivo}
                </p>
                {slot.notas && (
                  <p className="text-[11px] text-slate-500 italic">
                    &ldquo;{slot.notas}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
            {checkInDone && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Check-in confirmado. Notificando a consultorio...</span>
              </div>
            )}
            {!isBloqueado ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCheckInDone(true);
                    setTimeout(() => {
                      setCheckInDone(false);
                      onClose();
                    }, 800);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check-in / Iniciar Atención</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                  Cerrar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
              >
                Cerrar Detalle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
