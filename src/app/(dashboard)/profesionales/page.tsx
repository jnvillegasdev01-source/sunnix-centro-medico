"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_PROFESIONALES } from "@/lib/data/mock-profesionales";
import { ProfesionalDetalle } from "@/types/profesionales";
import { NuevoProfesionalModal } from "@/components/profesionales/nuevo-profesional-modal";
import {
  Stethoscope,
  Search,
  Plus,
  ArrowRight,
  Filter,
  Building2,
} from "lucide-react";

const STORAGE_KEY_MEDICOS = "sunnix_profesionales_list";

export default function ProfesionalesListPage() {
  const [profesionales, setProfesionales] = useState<ProfesionalDetalle[]>(() => [...MOCK_PROFESIONALES]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterEspecialidad, setFilterEspecialidad] = useState<string>("todas");
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MEDICOS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProfesionales(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleCrearProfesional = (nuevo: ProfesionalDetalle) => {
    const updated = [nuevo, ...profesionales];
    setProfesionales(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MEDICOS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const filtered = profesionales.filter((med) => {
    const matchesSearch =
      med.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.consultorioAsignadoNombre.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterEspecialidad !== "todas") {
      return matchesSearch && med.especialidad.toLowerCase().includes(filterEspecialidad);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Stethoscope className="w-3.5 h-3.5" />
              Cuerpo Médico
            </span>
            <span className="text-xs text-slate-400 font-mono">SPEC-003</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Gestión de Profesionales Médicos & Especialistas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administración de legajos, canon de alquiler de consultorios y horarios fijos semanales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNuevoModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Profesional</span>
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nombre, Matrícula, Especialidad o Consultorio..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Especialidad:</span>
          </div>
          <select
            value={filterEspecialidad}
            onChange={(e) => setFilterEspecialidad(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="todas">Todas las especialidades</option>
            <option value="dermatología">Dermatología</option>
            <option value="cardiología">Cardiología</option>
            <option value="clínica">Clínica Médica</option>
            <option value="ginecología">Ginecología</option>
            <option value="traumatología">Traumatología</option>
          </select>
        </div>
      </div>

      {/* Tabla de Profesionales */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Profesional</th>
                <th className="py-3 px-4">Matrícula / DNI</th>
                <th className="py-3 px-4">Especialidad</th>
                <th className="py-3 px-4">Consultorio Fijo</th>
                <th className="py-3 px-4">Canon Alquiler</th>
                <th className="py-3 px-4">Facturación Mes</th>
                <th className="py-3 px-4">Turnos</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((med) => (
                <tr
                  key={med.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                        {med.nombreCompleto
                          .split(" ")
                          .filter((p) => !p.startsWith("Dr"))
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <Link
                          href={`/profesionales/${med.id}`}
                          className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors"
                        >
                          {med.nombreCompleto}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {med.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800 block">
                      {med.matricula}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      DNI: {med.dni}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      {med.especialidad}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{med.consultorioAsignadoNombre}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900">
                      $ {med.montoAlquilerMensual.toLocaleString("es-AR")}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Vence: {med.proximoVencimientoAlquiler}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-emerald-700">
                      $ {med.facturacionMesActual.toLocaleString("es-AR")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800">
                      {med.turnosMesActual}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      pacientes
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/profesionales/${med.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-all shadow-2xs"
                    >
                      <span>Ver Legajo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nuevo Profesional */}
      <NuevoProfesionalModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleCrearProfesional}
      />
    </div>
  );
}
