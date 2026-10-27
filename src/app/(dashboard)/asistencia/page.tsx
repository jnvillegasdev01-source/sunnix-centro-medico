"use client";

import React, { useState, useMemo } from "react";
import {
  TurnoAsistenciaFila,
  EstadoAsistencia,
} from "@/types/asistencia";
import { MOCK_TURNOS_ASISTENCIA } from "@/lib/data/mock-asistencia";
import { AsistenciaKpisHeader } from "@/components/asistencia/asistencia-kpis-header";
import { AsistenciaFiltrosBar } from "@/components/asistencia/asistencia-filtros-bar";
import { AsistenciaTabla } from "@/components/asistencia/asistencia-tabla";
import { PacienteAsistenciaDrawer } from "@/components/asistencia/paciente-asistencia-drawer";
import { AsistenciaMetricasPanel } from "@/components/asistencia/asistencia-metricas-panel";
import { ShieldCheck, RefreshCw } from "lucide-react";

export default function AsistenciaPage() {
  const [turnos, setTurnos] = useState<readonly TurnoAsistenciaFila[]>(
    () => [...MOCK_TURNOS_ASISTENCIA]
  );
  const [fecha, setFecha] = useState<string>("12/05/2025");
  const [profesionalSeleccionado, setProfesionalSeleccionado] =
    useState<string>("Todos los profesionales");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] =
    useState<string>("Todas las especialidades");
  const [tabSeleccionada, setTabSeleccionada] = useState<"turnos" | "cirugias">("turnos");

  const [selectedTurno, setSelectedTurno] = useState<TurnoAsistenciaFila | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Filtrado reactivo de turnos
  const turnosFiltrados = useMemo(() => {
    return turnos.filter((turno) => {
      // Filtro por tab (Turnos vs Cirugías)
      if (tabSeleccionada === "cirugias" && turno.tipo !== "Procedimiento") {
        return false;
      }

      // Filtro por Profesional
      if (
        profesionalSeleccionado !== "Todos los profesionales" &&
        turno.profesionalNombre !== profesionalSeleccionado
      ) {
        return false;
      }

      // Filtro por Especialidad
      if (
        especialidadSeleccionada !== "Todas las especialidades" &&
        turno.especialidad !== especialidadSeleccionada
      ) {
        return false;
      }

      return true;
    });
  }, [turnos, tabSeleccionada, profesionalSeleccionado, especialidadSeleccionada]);

  // Actualización de estado en tiempo real (recalcula los KPIs instantáneamente)
  const handleUpdateEstado = (
    turnoId: string,
    nuevoEstado: EstadoAsistencia,
    nota?: string
  ) => {
    setTurnos((prev) =>
      prev.map((t) =>
        t.id === turnoId
          ? {
              ...t,
              estado: nuevoEstado,
              notaEstado: nota ?? t.notaEstado,
            }
          : t
      )
    );

    if (selectedTurno?.id === turnoId) {
      setSelectedTurno((prev) =>
        prev
          ? {
              ...prev,
              estado: nuevoEstado,
              notaEstado: nota ?? prev.notaEstado,
            }
          : null
      );
    }
  };

  const handleSelectTurno = (turno: TurnoAsistenciaFila) => {
    setSelectedTurno(turno);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSelectPacienteInasistencia = (pacienteId: string) => {
    const matchingTurno = turnos.find((t) => t.pacienteId === pacienteId);
    if (matchingTurno) {
      handleSelectTurno(matchingTurno);
    } else {
      // Si el paciente de top inasistencias es María Díaz
      const maria = turnos.find((t) => t.pacienteNombre === "María Díaz");
      if (maria) {
        handleSelectTurno(maria);
      }
    }
  };

  const handleResetFiltros = () => {
    setProfesionalSeleccionado("Todos los profesionales");
    setEspecialidadSeleccionada("Todas las especialidades");
    setTabSeleccionada("turnos");
  };

  const handleExportarAsistencia = () => {
    const headers = "ID,Hora,Paciente,DNI,Profesional,Especialidad,Estado\n";
    const rows = turnosFiltrados.map((t) => `"${t.id}","${t.hora}","${t.pacienteNombre}","${t.pacienteDni}","${t.profesionalNombre}","${t.especialidad}","${t.estado}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Asistencia_Diaria_Sunnix_${fecha}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header del Módulo con Breadcrumb y Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Agenda</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Control de asistencia</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Control de asistencia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoreo en tiempo real de asistencia diaria, check-in de pacientes y prevención de ausentismo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Monitoreo Activo</span>
          </div>

          <button
            type="button"
            onClick={handleResetFiltros}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Restablecer filtros"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. KPIs Superiores con Recálculo en Vivo */}
      <section aria-label="Resumen de asistencia del día">
        <AsistenciaKpisHeader turnos={turnos} />
      </section>

      {/* 2. Barra de Filtros y Acciones */}
      <section aria-label="Filtros de control de asistencia">
        <AsistenciaFiltrosBar
          fecha={fecha}
          onFechaChange={setFecha}
          profesionalSeleccionado={profesionalSeleccionado}
          onProfesionalChange={setProfesionalSeleccionado}
          especialidadSeleccionada={especialidadSeleccionada}
          onEspecialidadChange={setEspecialidadSeleccionada}
          tabSeleccionada={tabSeleccionada}
          onTabChange={setTabSeleccionada}
          onExportar={handleExportarAsistencia}
        />
      </section>

      {/* 3. Tabla Principal de Asistencia */}
      <section aria-label="Tabla de turnos y control de asistencia">
        <AsistenciaTabla
          turnos={turnosFiltrados}
          onSelectTurno={handleSelectTurno}
          onUpdateEstado={handleUpdateEstado}
          turnoSeleccionadoId={selectedTurno?.id}
        />
      </section>

      {/* 4. Panel Inferior de Métricas y Analítica */}
      <section aria-label="Analítica de ausentismo y desempeño">
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900">
            Analítica de ausentismo y desempeño
          </h2>
          <p className="text-xs text-slate-500">
            Métricas de adherencia institucional y pacientes con riesgo de inasistencia recurrente.
          </p>
        </div>

        <AsistenciaMetricasPanel
          onSelectPacienteInasistencia={handleSelectPacienteInasistencia}
        />
      </section>

      {/* 5. Drawer Lateral de Paciente */}
      <PacienteAsistenciaDrawer
        turno={selectedTurno}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onReprogramar={(id) => {
          handleUpdateEstado(id, "reprogramado", "Reprogramado para 16/05");
          handleCloseDrawer();
        }}
        onJustificar={(id) => {
          handleUpdateEstado(id, "asistio", "Inasistencia justificada por certificado");
          handleCloseDrawer();
        }}
      />
    </div>
  );
}
