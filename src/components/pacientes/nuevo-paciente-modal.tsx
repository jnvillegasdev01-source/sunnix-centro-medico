"use client";

import React, { useState } from "react";
import { PacienteDetalle, TipoMembresia } from "@/types/pacientes";
import { pacienteFormSchema, PacienteFormData } from "@/lib/data/mock-pacientes";
import { X, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

interface NuevoPacienteModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevoPaciente: PacienteDetalle) => void;
}

export function NuevoPacienteModal({
  isOpen,
  onClose,
  onSave,
}: NuevoPacienteModalProps) {
  const [formData, setFormData] = useState<PacienteFormData>({
    nombreCompleto: "",
    dni: "",
    fechaNacimiento: "1995-05-10",
    telefono: "",
    email: "",
    direccion: "",
    obraSocial: "OSDE",
    numeroAfiliado: "",
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    grupoSanguineo: "0+",
  });

  const [alergiasInput, setAlergiasInput] = useState<string>("");
  const [planMembresia, setPlanMembresia] = useState<"sin-membresia" | TipoMembresia>("familiar");
  const [errors, setErrors] = useState<Partial<Record<keyof PacienteFormData, string>>>({});
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof PacienteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateAge = (birthDateString: string): number => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = pacienteFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PacienteFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof PacienteFormData;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const newId = `p-${Date.now().toString().slice(-4)}`;
    const parsedAlergias = alergiasInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const edad = calculateAge(result.data.fechaNacimiento);

    let membresiaObj = undefined;
    if (planMembresia === "familiar") {
      membresiaObj = {
        id: `mem-${newId}`,
        codigo: `FAM-${Math.floor(100000 + Math.random() * 900000)}`,
        nombrePlan: "Plan Familiar",
        tipo: "familiar" as const,
        estado: "activa" as const,
        fechaVencimiento: "2026-12-31",
        beneficios: [
          "Descuentos en farmacia red Sunnix",
          "Sin copago en consultas de clínica médica",
          "1 chequeo preventivo anual por integrante",
        ],
        familiares: [
          {
            id: `fam-${newId}-1`,
            nombreCompleto: result.data.nombreCompleto,
            dni: result.data.dni,
            parentesco: "Titular" as const,
            estado: "Activo" as const,
          },
        ],
      };
    } else if (planMembresia === "individual") {
      membresiaObj = {
        id: `mem-${newId}`,
        codigo: `IND-${Math.floor(100000 + Math.random() * 900000)}`,
        nombrePlan: "Plan Individual",
        tipo: "individual" as const,
        estado: "activa" as const,
        fechaVencimiento: "2026-12-31",
        beneficios: [
          "Descuentos en farmacia red Sunnix",
          "Sin copago en consultas de clínica médica",
        ],
        familiares: [
          {
            id: `fam-${newId}-1`,
            nombreCompleto: result.data.nombreCompleto,
            dni: result.data.dni,
            parentesco: "Titular" as const,
            estado: "Activo" as const,
          },
        ],
      };
    }

    const nuevoPaciente: PacienteDetalle = {
      id: newId,
      nombreCompleto: result.data.nombreCompleto,
      dni: result.data.dni,
      edad: edad > 0 ? edad : 30,
      fechaNacimiento: result.data.fechaNacimiento,
      telefono: result.data.telefono,
      email: result.data.email,
      direccion: result.data.direccion,
      obraSocial: result.data.obraSocial,
      numeroAfiliado: result.data.numeroAfiliado,
      contactoEmergenciaNombre: result.data.contactoEmergenciaNombre,
      contactoEmergenciaTelefono: result.data.contactoEmergenciaTelefono,
      estado: "activo",
      alertaMedica: {
        alergias: parsedAlergias,
        enfermedadesPreexistentes: [],
        medicamentosHabituales: [],
        grupoSanguineo: result.data.grupoSanguineo,
        observaciones: "Paciente ingresado recientemente al padrón clínico Sunnix.",
      },
      membresia: membresiaObj,
      prosimosTurnos: [],
      historialTurnos: [],
    };

    onSave(nuevoPaciente);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
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
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-sky-600" />
              <span>Alta de Nuevo Paciente</span>
            </h3>
            <p className="text-xs text-slate-500">
              Registra los datos filiatorios, cobertura y alertas médicas en el padrón central.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success message */}
        {showSuccessToast && (
          <div className="m-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡Paciente registrado con éxito! Incorporándolo al padrón...</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nombre Completo *
              </label>
              <input
                type="text"
                placeholder="Ej: Marcos D'Alessandro"
                value={formData.nombreCompleto}
                onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.nombreCompleto
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.nombreCompleto && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.nombreCompleto}
                </p>
              )}
            </div>

            {/* DNI */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                DNI / Documento *
              </label>
              <input
                type="text"
                placeholder="Ej: 38.450.912"
                value={formData.dni}
                onChange={(e) => handleChange("dni", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.dni
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.dni && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.dni}
                </p>
              )}
            </div>

            {/* Fecha Nacimiento */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.fechaNacimiento
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.fechaNacimiento && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.fechaNacimiento}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                placeholder="Ej: +54 9 11 4123-8899"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.telefono
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.telefono && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.telefono}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="Ej: marcos@correo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.email
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Domicilio / Dirección *
              </label>
              <input
                type="text"
                placeholder="Ej: Av. Callao 1520, Piso 3, CABA"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.direccion
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.direccion && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.direccion}
                </p>
              )}
            </div>

            {/* Obra Social */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Obra Social / Prepaga *
              </label>
              <input
                type="text"
                placeholder="Ej: OSDE, Swiss Medical, Particular"
                value={formData.obraSocial}
                onChange={(e) => handleChange("obraSocial", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.obraSocial
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.obraSocial && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.obraSocial}
                </p>
              )}
            </div>

            {/* Número de Afiliado */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Número de Afiliado / Credencial *
              </label>
              <input
                type="text"
                placeholder="Ej: 3-5819022-01 o SIN-COBERTURA"
                value={formData.numeroAfiliado}
                onChange={(e) => handleChange("numeroAfiliado", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.numeroAfiliado
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.numeroAfiliado && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.numeroAfiliado}
                </p>
              )}
            </div>

            {/* Grupo Sanguíneo */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Grupo Sanguíneo y Factor Rh *
              </label>
              <select
                value={formData.grupoSanguineo}
                onChange={(e) => handleChange("grupoSanguineo", e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="0+">0+ (Cero Positivo)</option>
                <option value="0-">0- (Cero Negativo)</option>
                <option value="A+">A+ (A Positivo)</option>
                <option value="A-">A- (A Negativo)</option>
                <option value="B+">B+ (B Positivo)</option>
                <option value="B-">B- (B Negativo)</option>
                <option value="AB+">AB+ (AB Positivo)</option>
                <option value="AB-">AB- (AB Negativo)</option>
              </select>
            </div>

            {/* Plan de Membresía */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Plan de Salud Sunnix
              </label>
              <select
                value={planMembresia}
                onChange={(e) => setPlanMembresia(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-white"
              >
                <option value="familiar">Plan Familiar (Hasta 4 integrantes)</option>
                <option value="individual">Plan Individual</option>
                <option value="sin-membresia">Particular (Sin membresía)</option>
              </select>
            </div>

            {/* Contacto Emergencia Nombre */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Contacto de Emergencia (Nombre) *
              </label>
              <input
                type="text"
                placeholder="Ej: Laura D'Alessandro (Hermana)"
                value={formData.contactoEmergenciaNombre}
                onChange={(e) => handleChange("contactoEmergenciaNombre", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.contactoEmergenciaNombre
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.contactoEmergenciaNombre && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.contactoEmergenciaNombre}
                </p>
              )}
            </div>

            {/* Contacto Emergencia Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Contacto de Emergencia (Teléfono) *
              </label>
              <input
                type="tel"
                placeholder="Ej: +54 9 11 9988-7766"
                value={formData.contactoEmergenciaTelefono}
                onChange={(e) => handleChange("contactoEmergenciaTelefono", e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  errors.contactoEmergenciaTelefono
                    ? "border-rose-400 bg-rose-50/50"
                    : "border-slate-300 focus:border-sky-500"
                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
              />
              {errors.contactoEmergenciaTelefono && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.contactoEmergenciaTelefono}
                </p>
              )}
            </div>
          </div>

          {/* Alergias críticas */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Alergias Críticas (Opcional, separadas por coma)
            </label>
            <input
              type="text"
              placeholder="Ej: Penicilina, Dipirona, Mariscos"
              value={alergiasInput}
              onChange={(e) => setAlergiasInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            <p className="text-[11px] text-slate-400">
              Estas alertas se mostrarán destacadas en color rojo en la cabecera médica y quirófanos.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <UserPlus className="w-4 h-4" />
              <span>Guardar y Dar de Alta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
