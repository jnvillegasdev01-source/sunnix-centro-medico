"use client";

import React, { useState } from "react";
import { ProveedorItem } from "@/types/stock";
import { X, Building2, CheckCircle2, AlertCircle } from "lucide-react";

interface NuevoProveedorModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (nuevo: ProveedorItem) => void;
}

export function NuevoProveedorModal({
  isOpen,
  onClose,
  onSave,
}: NuevoProveedorModalProps) {
  const [razonSocial, setRazonSocial] = useState<string>("");
  const [cuit, setCuit] = useState<string>("");
  const [rubro, setRubro] = useState<string>("Descartables");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [condicionPagoDias, setCondicionPagoDias] = useState<number>(30);
  const [contactoComercial, setContactoComercial] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!razonSocial.trim()) {
      setError("La razón social es obligatoria.");
      return;
    }
    if (!cuit.trim()) {
      setError("El CUIT es obligatorio.");
      return;
    }

    const newId = `prov-${Date.now().toString().slice(-4)}`;

    const nuevoProveedor: ProveedorItem = {
      id: newId,
      razonSocial: razonSocial.trim(),
      cuit: cuit.trim(),
      rubro,
      telefono: telefono.trim() || "+54 11 4455-8899",
      email: email.trim() || "contacto@proveedor.com",
      direccion: direccion.trim() || "Av. Industrial 1230, CABA",
      condicionPagoDias: condicionPagoDias || 30,
      contactoComercial: contactoComercial.trim() || "Dpto. Ventas",
      activo: true,
      totalComprasMes: 0,
    };

    onSave(nuevoProveedor);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 700);
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Alta de Nuevo Proveedor Homologado</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Registra una nueva entidad comercial para la emisión de Órdenes de Compra.
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
            <span>Proveedor homologado e incorporado con éxito.</span>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Razón Social / Nombre Comercial *
            </label>
            <input
              type="text"
              placeholder="Ej: Droguería Continental S.A."
              value={razonSocial}
              onChange={(e) => {
                setRazonSocial(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                CUIT *
              </label>
              <input
                type="text"
                placeholder="Ej: 30-71123456-9"
                value={cuit}
                onChange={(e) => {
                  setCuit(e.target.value);
                  setError(null);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Rubro *
              </label>
              <select
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
              >
                <option value="Descartables">Descartables y Soluciones</option>
                <option value="Medicamentos">Medicamentos y Farmacia</option>
                <option value="Curación">Material de Curación</option>
                <option value="Higiene">Higiene y Desinfección</option>
                <option value="Instrumental">Instrumental Quirúrgico</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                placeholder="Ej: +54 11 4789-0011"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="Ej: pedidos@continental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Dirección / Depósito
              </label>
              <input
                type="text"
                placeholder="Ej: Parque Industrial Pilar, Lote 12"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Condición de Pago (Días)
              </label>
              <input
                type="number"
                value={condicionPagoDias}
                onChange={(e) => setCondicionPagoDias(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Contacto Comercial / Ejecutivo de Cuenta
            </label>
            <input
              type="text"
              placeholder="Ej: Lic. Esteban Romero"
              value={contactoComercial}
              onChange={(e) => setContactoComercial(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Homologar Proveedor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
