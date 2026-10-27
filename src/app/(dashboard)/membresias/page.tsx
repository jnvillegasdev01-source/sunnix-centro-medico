"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_PACIENTES } from "@/lib/data/mock-pacientes";
import { PacienteDetalle } from "@/types/pacientes";
import { NuevaMembresiaModal } from "@/components/membresias/nueva-membresia-modal";
import {
  Award,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  CreditCard,
  UserCheck,
} from "lucide-react";

const STORAGE_KEY = "sunnix_pacientes_list";

export default function MembresiasPage() {
  const [pacientes, setPacientes] = useState<PacienteDetalle[]>(() => [...MOCK_PACIENTES]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      // Ignore
    }
  }, []);

  const handleCrearMembresia = (nuevoPaciente: PacienteDetalle) => {
    const updated = [nuevoPaciente, ...pacientes];
    setPacientes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Pacientes con membresía activa en el sistema
  const pacientesConMembresia = pacientes.filter(
    (p) => Boolean(p.membresia)
  );

  const membresiasFiltradas = pacientesConMembresia.filter((p) => {
    if (!p.membresia) return false;
    if (filtroTipo !== "todos" && p.membresia.tipo !== filtroTipo) {
      return false;
    }
    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase().trim();
      const matchTitular = p.nombreCompleto.toLowerCase().includes(q);
      const matchCodigo = p.membresia.codigo.toLowerCase().includes(q);
      const matchPlan = p.membresia.nombrePlan.toLowerCase().includes(q);
      return matchTitular || matchCodigo || matchPlan;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Cabecera principal */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Programa de Salud Sunnix
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
            Membresías Familiares e Individuales
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Gestión integral de planes de cobertura propia, titulares y familiares adherentes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Membresía</span>
          </button>
        </div>
      </div>

      {/* 2. KPIs Consolidados del Programa de Membresías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Titulares Activos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">184</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span>↑ +12 este mes</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Adherentes Familiares
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">412</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Promedio: 2.2 por titular
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tasa de Retención
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">96.4%</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Baja rotación anual
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Plan Más Contratado
            </p>
            <p className="text-xl font-bold text-slate-900 mt-1">Familiar Plus</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              68% de la cartera total
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Filtros y Búsqueda */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por titular, código de carnet o plan..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setFiltroTipo("todos")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filtroTipo === "todos"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Todos los planes
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("familiar")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filtroTipo === "familiar"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Planes Familiares
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("individual")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filtroTipo === "individual"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Planes Individuales
          </button>
        </div>
      </div>

      {/* 4. Lista de Membresías Activas con Detalle de Familiares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {membresiasFiltradas.map((paciente) => {
          const mem = paciente.membresia;
          if (!mem) return null;

          return (
            <div
              key={mem.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {mem.nombrePlan}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {mem.estado}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {paciente.nombreCompleto} (Titular)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Carnet: {mem.codigo} • DNI: {paciente.dni}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Vigencia y Cupo */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Vigencia hasta:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {mem.fechaVencimiento}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Grupo familiar:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {mem.familiares.length} integrantes cargados
                    </span>
                  </div>
                </div>

                {/* Nómina de Integrantes */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Integrantes cubiertos:
                  </p>
                  <div className="space-y-1.5">
                    {mem.familiares.map((fam) => (
                      <div
                        key={fam.id}
                        className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-slate-800">
                            {fam.nombreCompleto}
                          </span>
                          <span className="text-2xs text-slate-400">({fam.parentesco})</span>
                        </div>
                        <span className="text-2xs font-mono text-slate-500">
                          DNI {fam.dni}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Beneficios Clave */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Beneficios del plan:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {mem.beneficios.slice(0, 3).map((ben, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="line-clamp-1">{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botón de acceso a Ficha 360 */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/pacientes/${paciente.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Ver Ficha 360 del Titular</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Catálogo de Planes Institucionales */}
      <div className="bg-linear-to-r from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Planes Sunnix Salud</span>
            </div>
            <h2 className="text-lg font-bold mt-1">
              Estructura de Cuotas y Coberturas
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Los afiliados a planes propios acceden a descuentos en farmacia del 40%, atención preferencial sin copago en guardia ambulatoria y chequeos preventivos anuales bonificados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/reportes"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold transition-all text-white"
            >
              Ver Reporte de Membresías
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Membresía */}
      <NuevaMembresiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCrearMembresia}
      />
    </div>
  );
}
