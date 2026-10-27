"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_PACIENTES } from "@/lib/data/mock-pacientes";
import { PacienteDetalle } from "@/types/pacientes";
import { NuevoPacienteModal } from "@/components/pacientes/nuevo-paciente-modal";
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Filter,
  CreditCard,
  Phone,
  ShieldAlert,
  Award,
} from "lucide-react";

const STORAGE_KEY = "sunnix_pacientes_list";

export default function PacientesListPage() {
  const [pacientes, setPacientes] = useState<PacienteDetalle[]>(() => [...MOCK_PACIENTES]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterPlan, setFilterPlan] = useState<string>("todos");
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPacientes(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleCrearPaciente = (nuevo: PacienteDetalle) => {
    const updated = [nuevo, ...pacientes];
    setPacientes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch =
      paciente.nombreCompleto
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      paciente.dni.includes(searchTerm) ||
      paciente.obraSocial.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterPlan === "familiar") {
      return matchesSearch && paciente.membresia?.tipo === "familiar";
    }
    if (filterPlan === "individual") {
      return matchesSearch && paciente.membresia?.tipo === "individual";
    }
    if (filterPlan === "sin-membresia") {
      return matchesSearch && !paciente.membresia;
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
              <Users className="w-3.5 h-3.5" />
              Padrón de Pacientes
            </span>
            <span className="text-xs text-slate-400 font-mono">SPEC-002</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Gestión Clínica de Pacientes & Membresías
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta el padrón integral, historial médico, alertas clínicas y planes familiares.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNuevoModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nombre, DNI u Obra Social..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Filtros Rápidos */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Plan:</span>
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="todos">Todos los planes</option>
            <option value="familiar">Plan Familiar</option>
            <option value="individual">Plan Individual</option>
            <option value="sin-membresia">Particular (Sin membresía)</option>
          </select>
        </div>
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">DNI / Edad</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Cobertura / Prepaga</th>
                <th className="py-3 px-4">Membresía</th>
                <th className="py-3 px-4">Alertas</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPacientes.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Paciente con Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                        {paciente.nombreCompleto
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <Link
                          href={`/pacientes/${paciente.id}`}
                          className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors"
                        >
                          {paciente.nombreCompleto}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {paciente.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* DNI & Edad */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-800 font-semibold">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paciente.dni}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {paciente.edad} años ({paciente.fechaNacimiento})
                    </span>
                  </td>

                  {/* Teléfono & Email */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paciente.telefono}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-normal truncate block max-w-[150px]">
                      {paciente.email}
                    </span>
                  </td>

                  {/* Obra Social */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">
                      {paciente.obraSocial}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {paciente.numeroAfiliado}
                    </p>
                  </td>

                  {/* Membresía */}
                  <td className="py-3.5 px-4">
                    {paciente.membresia ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                          <Award className="w-3 h-3 text-teal-600" />
                          {paciente.membresia.nombrePlan}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {paciente.membresia.familiares.length} integrantes
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Particular
                      </span>
                    )}
                  </td>

                  {/* Alertas Médicas */}
                  <td className="py-3.5 px-4">
                    {paciente.alertaMedica.alergias.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {paciente.alertaMedica.alergias.map((alergia) => (
                          <span
                            key={alergia}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                          >
                            <ShieldAlert className="w-3 h-3 text-rose-500" />
                            {alergia}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Sin alertas
                      </span>
                    )}
                  </td>

                  {/* Acción */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/pacientes/${paciente.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-all shadow-2xs"
                    >
                      <span>Ver Ficha 360</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Alta de Paciente */}
      <NuevoPacienteModal
        isOpen={isNuevoModalOpen}
        onClose={() => setIsNuevoModalOpen(false)}
        onSave={handleCrearPaciente}
      />
    </div>
  );
}
