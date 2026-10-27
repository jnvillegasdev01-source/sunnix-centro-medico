"use client";

import React, { useState } from "react";
import { ProveedorItem } from "@/types/stock";
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileCheck2,
  DollarSign,
  ShoppingCart,
  CreditCard,
  FileText,
} from "lucide-react";

interface ProveedorDrawerDetalleProps {
  readonly proveedor: ProveedorItem | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCrearOC?: (proveedor: ProveedorItem) => void;
}

export function ProveedorDrawerDetalle({
  proveedor,
  isOpen,
  onClose,
  onCrearOC,
}: ProveedorDrawerDetalleProps) {
  const [activeTab, setActiveTab] = useState<"comercial" | "ordenes" | "pagos">("comercial");
  const [mensajeFeedback, setMensajeFeedback] = useState<string | null>(null);

  if (!isOpen || !proveedor) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs shrink-0">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">
                    CUIT {proveedor.cuit}
                  </span>
                  {proveedor.activo ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                      Inactivo
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {proveedor.razonSocial}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {proveedor.rubro}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Tarjeta de Volumen de Compras */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Compras Facturadas (Mes)
                </span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                  ${(proveedor.totalComprasMes ?? 0).toLocaleString("es-AR")}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("comercial")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "comercial"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Datos comerciales</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ordenes")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "ordenes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Órdenes emitidas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pagos")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "pagos"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Condición de pago</span>
              </button>
            </div>

            {/* TAB: Comercial */}
            {activeTab === "comercial" && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Teléfono de contacto
                      </span>
                      <span className="font-semibold text-slate-800">
                        {proveedor.telefono}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Email para pedidos y facturas
                      </span>
                      <span className="font-semibold text-slate-800">
                        {proveedor.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Domicilio fiscal y depósito
                      </span>
                      <span className="font-medium text-slate-800">
                        {proveedor.direccion}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 block">
                    Ejecutivo de Cuenta Comercial
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {proveedor.contactoComercial}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Atención de lunes a viernes de 08:00 a 17:00 hs para urgencias quirúrgicas.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Órdenes */}
            {activeTab === "ordenes" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        OC-00023
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Recepcionada
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      10/05/2025 • 25 artículos
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    $450.000
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        OC-00019
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Recepcionada
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      24/04/2025 • 40 artículos
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    $700.000
                  </span>
                </div>
              </div>
            )}

            {/* TAB: Pagos */}
            {activeTab === "pagos" && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Plazo financiero:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {proveedor.condicionPagoDias} días fecha de factura
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Medio de pago pactado:</span>
                    <span className="font-semibold text-slate-800">
                      Transferencia bancaria / eCheq
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Estado de cuenta corriente:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Al día sin deuda vencida
                    </span>
                  </div>
                </div>
              </div>
            )}

            {mensajeFeedback && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{mensajeFeedback}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMensajeFeedback(`Ficha de ${proveedor.razonSocial} habilitada para edición comercial.`);
                setTimeout(() => setMensajeFeedback(null), 3000);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Editar ficha
            </button>

            <button
              type="button"
              onClick={() => onCrearOC?.(proveedor)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Crear Orden de Compra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
