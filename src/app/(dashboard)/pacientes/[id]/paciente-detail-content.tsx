"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PacienteDetalle,
  FamiliarDependiente,
  TurnoPaciente,
  MembresiaDetalle,
} from "@/types/pacientes";
import { PACIENTE_ANA_TORRES, MOCK_PACIENTES } from "@/lib/data/mock-pacientes";
import { PacienteHeader } from "@/components/pacientes/paciente-header";
import { AlertaMedicaCards } from "@/components/pacientes/alerta-medica-cards";
import { DatosPersonalesCard } from "@/components/pacientes/datos-personales-card";
import { MembresiaFamiliaresCard } from "@/components/pacientes/membresia-familiares-card";
import { TurnosWidget } from "@/components/pacientes/turnos-widget";
import { EditarPacienteModal } from "@/components/pacientes/editar-paciente-modal";
import { AgregarFamiliarModal } from "@/components/pacientes/agregar-familiar-modal";
import { NuevoTurnoModal } from "@/components/pacientes/nuevo-turno-modal";
import {
  ChevronLeft,
  Info,
  Award,
  Calendar,
  FileHeart,
  FlaskConical,
  Pill,
  FolderOpen,
  Receipt,
  StickyNote,
  Download,
} from "lucide-react";

interface PacienteDetailContentProps {
  readonly id: string;
}

type TabKey =
  | "general"
  | "membresia"
  | "turnos"
  | "historia"
  | "estudios"
  | "recetas"
  | "documentos"
  | "facturacion"
  | "notas";

interface TabItem {
  readonly key: TabKey;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const TABS: readonly TabItem[] = [
  { key: "general", label: "Información general", icon: <Info className="w-4 h-4" /> },
  { key: "membresia", label: "Membresía", icon: <Award className="w-4 h-4" /> },
  { key: "turnos", label: "Turnos y cirugías", icon: <Calendar className="w-4 h-4" /> },
  { key: "historia", label: "Historia clínica", icon: <FileHeart className="w-4 h-4" /> },
  { key: "estudios", label: "Estudios", icon: <FlaskConical className="w-4 h-4" /> },
  { key: "recetas", label: "Recetas", icon: <Pill className="w-4 h-4" /> },
  { key: "documentos", label: "Documentos", icon: <FolderOpen className="w-4 h-4" /> },
  { key: "facturacion", label: "Facturación", icon: <Receipt className="w-4 h-4" /> },
  { key: "notas", label: "Notas", icon: <StickyNote className="w-4 h-4" /> },
];

export function PacienteDetailContent({ id }: PacienteDetailContentProps) {
  const initialPatient =
    MOCK_PACIENTES.find((p) => p.id === id) ?? PACIENTE_ANA_TORRES;

  const [paciente, setPaciente] = useState<PacienteDetalle>(initialPatient);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isFamiliarModalOpen, setIsFamiliarModalOpen] = useState<boolean>(false);
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sunnix_pacientes_list");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const found = list.find((p: PacienteDetalle) => p.id === id);
          if (found) {
            setPaciente(found);
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [id]);

  const syncPatientUpdate = (updated: PacienteDetalle) => {
    setPaciente(updated);
    try {
      const stored = localStorage.getItem("sunnix_pacientes_list");
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const index = list.findIndex((p: PacienteDetalle) => p.id === updated.id);
          if (index !== -1) {
            list[index] = updated;
          } else {
            list.unshift(updated);
          }
          localStorage.setItem("sunnix_pacientes_list", JSON.stringify(list));
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleSaveFamiliar = (nuevoFamiliar: FamiliarDependiente) => {
    if (!paciente.membresia) return;
    const updatedMembresia: MembresiaDetalle = {
      ...paciente.membresia,
      familiares: [...paciente.membresia.familiares, nuevoFamiliar],
    };
    syncPatientUpdate({
      ...paciente,
      membresia: updatedMembresia,
    });
  };

  const handleSaveTurno = (nuevoTurno: TurnoPaciente) => {
    const updatedTurnos = [nuevoTurno, ...(paciente.prosimosTurnos ?? [])];
    syncPatientUpdate({
      ...paciente,
      prosimosTurnos: updatedTurnos,
    });
  };

  const handleAfiliar = () => {
    const nuevaMembresia: MembresiaDetalle = {
      id: `mem-${paciente.id}`,
      codigo: `FAM-${Math.floor(100000 + Math.random() * 900000)}`,
      nombrePlan: "Plan Familiar",
      tipo: "familiar",
      estado: "activa",
      fechaVencimiento: "2026-12-31",
      beneficios: [
        "Descuentos en farmacia red Sunnix",
        "Sin copago en consultas ambulatorias",
        "1 chequeo preventivo anual por integrante",
      ],
      familiares: [
        {
          id: `fam-${paciente.id}-1`,
          nombreCompleto: paciente.nombreCompleto,
          dni: paciente.dni,
          parentesco: "Titular",
          estado: "Activo",
        },
      ],
    };
    syncPatientUpdate({
      ...paciente,
      membresia: nuevaMembresia,
    });
  };

  const handleDownloadEstudio = (titulo: string) => {
    const content = `SUNNIX CENTRO MÉDICO - INFORME CLÍNICO OFICIAL
=====================================================
Paciente: ${paciente.nombreCompleto}
DNI: ${paciente.dni} | Edad: ${paciente.edad} años
Obra Social: ${paciente.obraSocial} (Afiliado: ${paciente.numeroAfiliado})
Estudio: ${titulo}
Fecha de emisión: ${new Date().toLocaleDateString("es-AR")}
Firma Digital: Dr. Carlos Benítez (M.N. 98.412) - Validez Oficial Sunnix Salud
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${titulo.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center justify-between">
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Padrón de Pacientes</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          ID: {paciente.id} • Ficha Médica Digital
        </span>
      </div>

      {/* 1. Cabecera Integral del Paciente */}
      <PacienteHeader
        paciente={paciente}
        onEditar={() => setIsEditModalOpen(true)}
        onNuevoTurno={() => setIsTurnoModalOpen(true)}
      />

      {/* 2. Cuatro Tarjetas de Alerta y Resumen */}
      <AlertaMedicaCards
        paciente={paciente}
        onVerMembresia={() => setActiveTab("membresia")}
        onVerCredencial={() => setActiveTab("documentos")}
        onEditarGrupoSanguineo={() => setIsEditModalOpen(true)}
      />

      {/* 3. Navegación por Pestañas (Tabs) */}
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

      {/* 4. Contenido Dinámico según la Pestaña Activa */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <DatosPersonalesCard paciente={paciente} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TurnosWidget
              prosimosTurnos={paciente.prosimosTurnos}
              historialTurnos={paciente.historialTurnos}
            />
            <MembresiaFamiliaresCard
              membresia={paciente.membresia}
              onAgregarFamiliar={() => setIsFamiliarModalOpen(true)}
              onAfiliar={handleAfiliar}
            />
          </div>
        </div>
      )}

      {activeTab === "membresia" && (
        <div className="space-y-6">
          <MembresiaFamiliaresCard
            membresia={paciente.membresia}
            onAgregarFamiliar={() => setIsFamiliarModalOpen(true)}
            onAfiliar={handleAfiliar}
          />
        </div>
      )}

      {activeTab === "turnos" && (
        <div className="space-y-6">
          <TurnosWidget
            prosimosTurnos={paciente.prosimosTurnos}
            historialTurnos={paciente.historialTurnos}
          />
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              Historial y Registro Quirúrgico
            </h3>
            <p className="text-xs text-slate-500">
              No registra cirugías programadas en quirófano ambulatorio para los próximos 30 días.
            </p>
          </div>
        </div>
      )}

      {activeTab === "historia" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              Evolución Clínica y Diagnósticos CIE-10
            </h3>
            <span className="text-xs text-slate-500">
              Última actualización: 15/04/2025
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Control Clínico General & Perfil Tiroideo
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    CIE-10: E03.9
                  </span>
                </div>
                <span className="text-xs text-slate-400">15/04/2025 - 09:30 hs</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paciente asintomática. Examen físico normal. Tensión arterial 120/80 mmHg. Frecuencia cardíaca 72 lpm. Se solicita laboratorio de control TSH y T4 Libre con indicación de continuar Levotiroxina 50mcg.
              </p>
              <div className="pt-2 text-[11px] font-medium text-slate-500">
                Atendido por: <strong className="text-slate-700">Dr. Carlos Benítez (M.N. 98.412)</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Control Neumonológico Preventivo
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                    CIE-10: J45.0
                  </span>
                </div>
                <span className="text-xs text-slate-400">10/02/2025 - 17:00 hs</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sin crisis asmáticas recientes. Auscultación pulmonar con murmullo vesicular conservado sin ruidos agregados. Se reitera pauta de alarma y uso de Salbutamol sólo ante rescate.
              </p>
              <div className="pt-2 text-[11px] font-medium text-slate-500">
                Atendido por: <strong className="text-slate-700">Dr. Juan Paéz (M.N. 104.551)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "estudios" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Estudios Complementarios y Resultados
          </h3>
          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Laboratorio Bioquímico Completo (Perfil Tiroideo, Hemograma)
                </p>
                <p className="text-[11px] text-slate-500">
                  Fecha: 18/04/2025 • Laboratorio Central Sunnix
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDownloadEstudio(
                    "Laboratorio Bioquímico Completo (Perfil Tiroideo, Hemograma)"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Electrocardiograma con Informe
                </p>
                <p className="text-[11px] text-slate-500">
                  Fecha: 15/11/2024 • Servicio de Cardiología
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleDownloadEstudio("Electrocardiograma con Informe")
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "recetas" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Recetas Médicas Emitidas
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Levotiroxina 50 mcg x 50 comp.
                </p>
                <p className="text-[11px] text-slate-500">
                  Emitida por: Dr. Carlos Benítez • Vence: 15/07/2025
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Vigente
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Salbutamol Aerosol 100 mcg x 200 dosis
                </p>
                <p className="text-[11px] text-slate-500">
                  Emitida por: Dr. Juan Paéz • Vence: 10/05/2025
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Vigente
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "documentos" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Documentación y Credenciales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-sky-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Credencial OSDE Plan 310</p>
                  <p className="text-[11px] text-slate-500">Afiliado: 2-45892110-01</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verificada
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Consentimiento Quirúrgico General</p>
                  <p className="text-[11px] text-slate-500">Firmado digitalmente</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Archivo
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "facturacion" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Historial de Facturación y Copagos
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Comprobante</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Monto</th>
                  <th className="py-2.5 px-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold">REC-003891</td>
                  <td className="py-2.5 px-3">15/04/2025</td>
                  <td className="py-2.5 px-3">Copago Consulta Clínica Médica</td>
                  <td className="py-2.5 px-3 font-bold">$0,00 (100% Cobertura Plan)</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Al día
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "notas" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
            Notas de Seguimiento y Coordinación
          </h3>
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Nota de Admisión (Marisol - Admin):</strong> Paciente con alta adherencia a controles. Presenta carnet de membresía familiar al día. Recordar solicitar nueva orden médica en próximo turno de endocrinología.
          </div>
        </div>
      )}

      {/* Modal de Edición con Zod */}
      <EditarPacienteModal
        paciente={paciente}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => syncPatientUpdate(updated)}
      />

      {/* Modal de Agregar Familiar a Membresía */}
      <AgregarFamiliarModal
        isOpen={isFamiliarModalOpen}
        onClose={() => setIsFamiliarModalOpen(false)}
        onSave={handleSaveFamiliar}
        cantidadActual={paciente.membresia?.familiares.length ?? 0}
      />

      {/* Modal de Agendar Nuevo Turno */}
      <NuevoTurnoModal
        pacienteNombre={paciente.nombreCompleto}
        isOpen={isTurnoModalOpen}
        onClose={() => setIsTurnoModalOpen(false)}
        onSave={handleSaveTurno}
      />
    </div>
  );
}
