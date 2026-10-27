"use client";

import React from "react";
import { PacienteDetalle } from "@/types/pacientes";
import {
  Edit3,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Printer,
  PlusCircle,
} from "lucide-react";

interface PacienteHeaderProps {
  readonly paciente: PacienteDetalle;
  readonly onEditar?: () => void;
  readonly onNuevoTurno?: () => void;
  readonly onImprimir?: () => void;
}

export function PacienteHeader({
  paciente,
  onEditar,
  onNuevoTurno,
  onImprimir,
}: PacienteHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Avatar, Name & Quick Meta */}
        <div className="flex items-start sm:items-center gap-4 md:gap-5">
          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-xl md:text-2xl shadow-inner">
                {paciente.nombreCompleto
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
              title="Estado: Activo"
            />
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {paciente.nombreCompleto}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Activo
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                {paciente.obraSocial}
              </span>
            </div>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>DNI: <strong className="text-slate-800">{paciente.dni}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {paciente.edad} años ({paciente.fechaNacimiento})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{paciente.telefono}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">{paciente.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={onEditar}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Editar paciente</span>
          </button>

          <button
            type="button"
            onClick={onNuevoTurno}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo turno</span>
          </button>

          <button
            type="button"
            onClick={onImprimir ?? (() => window.print())}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Imprimir resumen de ficha"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
