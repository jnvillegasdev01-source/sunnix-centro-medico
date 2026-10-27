"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProfesionalDetalle } from "@/types/profesionales";
import { DRA_LAURA_GARCIA, MOCK_PROFESIONALES } from "@/lib/data/mock-profesionales";
import { ProfesionalHeader } from "@/components/profesionales/profesional-header";
import { AgendaSemanalTable } from "@/components/profesionales/agenda-semanal-table";
import { DocumentosTable } from "@/components/profesionales/documentos-table";
import {
  ChevronLeft,
  Info,
  Calendar,
  Building2,
  DollarSign,
  Receipt,
  BarChart3,
  FileText,
  StickyNote,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ProfesionalDetailContentProps {
  readonly id: string;
}

type TabKey =
  | "general"
  | "agenda"
  | "consultorios"
  | "alquiler"
  | "facturacion"
  | "estadisticas"
  | "documentos"
  | "notas";

interface TabItem {
  readonly key: TabKey;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TABS: readonly TabItem[] = [
  { key: "general", label: "Información general", icon: <Info className="w-4 h-4" /> },
  { key: "agenda", label: "Agenda y disponibilidad", icon: <Calendar className="w-4 h-4" /> },
  { key: "consultorios", label: "Consultorios", icon: <Building2 className="w-4 h-4" /> },
  { key: "alquiler", label: "Alquiler / Servicios", icon: <DollarSign className="w-4 h-4" /> },
  { key: "facturacion", label: "Facturación médica", icon: <Receipt className="w-4 h-4" /> },
  { key: "estadisticas", label: "Estadísticas", icon: <BarChart3 className="w-4 h-4" /> },
  { key: "documentos", label: "Documentos", icon: <FileText className="w-4 h-4" /> },
  { key: "notas", label: "Notas", icon: <StickyNote className="w-4 h-4" /> },
];

export function ProfesionalDetailContent({ id }: ProfesionalDetailContentProps) {
  const initialDoctor =
    MOCK_PROFESIONALES.find((p) => p.id === id) ?? DRA_LAURA_GARCIA;

  const [profesional] = useState<ProfesionalDetalle>(initialDoctor);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [editBanner, setEditBanner] = useState<boolean>(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center justify-between">
        <Link
          href="/profesionales"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Directorio de Profesionales</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          ID: {profesional.id} • Legajo Profesional Sunnix
        </span>
      </div>

      {editBanner && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between text-xs font-medium text-sky-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Ficha del profesional {profesional.nombreCompleto} abierta para edición y actualización de matrícula/contrato.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEditBanner(false)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 px-2 py-1 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* 1. Cabecera con datos y 3 KPICards */}
      <ProfesionalHeader
        profesional={profesional}
        onVerAlquiler={() => setActiveTab("alquiler")}
        onEditar={() => setEditBanner(true)}
      />

      {/* 2. Navegación por pestañas (Tabs) */}
      <div className="border-b border-slate-200 overflow-x-auto custom-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 min-w-max pb-px" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "border-sky-600 text-sky-600 bg-sky-50/40 rounded-t-lg"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Contenido de las pestañas */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <AgendaSemanalTable agenda={profesional.agendaSemanal} />
          <DocumentosTable documentos={profesional.documentos} />

          {/* Biografía y Resumen Clínico */}
          {profesional.biografia && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Perfil Profesional y Trayectoria
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profesional.biografia}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "agenda" && (
        <div className="space-y-6">
          <AgendaSemanalTable agenda={profesional.agendaSemanal} />
        </div>
      )}

      {activeTab === "consultorios" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Consultorio Fijo Asignado: {profesional.consultorioAsignadoNombre}
              </h3>
              <p className="text-xs text-slate-500">
                Piso 1 - Ala Médica • Consultorio totalmente equipado.
              </p>
            </div>
            <Link
              href="/consultorios"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-xl transition-colors"
            >
              <span>Ver Matriz de Ocupación</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <span className="font-bold text-slate-800 block">Equipamiento Incluido:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Camilla articulada hidráulica con cabezal regulable</li>
                <li>Dermatoscopio digital con luz polarizada y aumento 10x</li>
                <li>Lámpara de examen LED dermatológica rodante</li>
                <li>Mobiliario médico completo y negatoscopio</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <span className="font-bold text-slate-800 block">Servicios de Soporte:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Secretaría y recepción de pacientes incluida</li>
                <li>Sistema de turnos online y recordatorios por WhatsApp</li>
                <li>Servicio de limpieza y desinfección entre turnos</li>
                <li>Internet fibra simétrica y climatización central</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "alquiler" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Convenio de Locación y Canon Mensual de Consultorio
              </h3>
              <p className="text-xs text-slate-500">
                Contrato vigente anual con vencimiento de cuota el día 10 de cada mes.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Estado: Al día
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Canon Fijo Mensual</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                $ {profesional.montoAlquilerMensual.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Próximo Vencimiento</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {profesional.proximoVencimientoAlquiler}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Modalidad de Pago</span>
              <span className="text-sm font-bold text-slate-900">
                Transferencia bancaria / Débito
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "facturacion" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              Facturación Producida y Liquidaciones
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Mes actual: $ {profesional.facturacionMesActual.toLocaleString("es-AR")}
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Período</th>
                  <th className="py-2.5 px-3">Turnos Atendidos</th>
                  <th className="py-2.5 px-3">Monto Facturado</th>
                  <th className="py-2.5 px-3">Canon Alquiler</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Mayo 2025 (En curso)</td>
                  <td className="py-2.5 px-3 font-mono">120 turnos</td>
                  <td className="py-2.5 px-3 font-mono font-bold">$ 2.800.000</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">$ 60.000</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      En proceso
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Abril 2025</td>
                  <td className="py-2.5 px-3 font-mono">114 turnos</td>
                  <td className="py-2.5 px-3 font-mono font-bold">$ 2.450.000</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">$ 60.000</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Liquidado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "estadisticas" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Métricas de Rendimiento y Ocupación de Agenda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Ocupación de Slots</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">92%</span>
              <p className="text-[11px] text-slate-400 mt-1">Slots contratados vs turnos tomados</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Tasa de Asistencia</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono">95.8%</span>
              <p className="text-[11px] text-slate-400 mt-1">Ausentismo de pacientes: 4.2%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Satisfacción de Pacientes</span>
              <span className="text-2xl font-bold text-sky-600 font-mono">4.9 / 5.0</span>
              <p className="text-[11px] text-slate-400 mt-1">Evaluaciones en encuestas post-consulta</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documentos" && (
        <div className="space-y-6">
          <DocumentosTable documentos={profesional.documentos} />
        </div>
      )}

      {activeTab === "notas" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Notas de Coordinación y Convivencia
          </h3>
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-sky-900 leading-relaxed">
            <strong>Coordinación Médica:</strong> La Dra. Laura García solicita mantener disponibilidad del gabinete dermatológico los días viernes por la tarde para procedimientos estéticos con láser. Coordinado con Dirección Médica.
          </div>
        </div>
      )}
    </div>
  );
}
