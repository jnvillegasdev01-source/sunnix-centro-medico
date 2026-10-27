"use client";

import React, { useState } from "react";
import { ProveedorItem } from "@/types/stock";
import {
  Building2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Phone,
  Mail,
  ShoppingCart,
  Eye,
  FileText,
} from "lucide-react";

interface ProveedoresDataTableProps {
  readonly proveedores: readonly ProveedorItem[];
  readonly onSelectProveedor: (proveedor: ProveedorItem) => void;
  readonly proveedorSeleccionadoId?: string;
  readonly onCrearOC?: (proveedor: ProveedorItem) => void;
}

export function ProveedoresDataTable({
  proveedores,
  onSelectProveedor,
  proveedorSeleccionadoId,
  onCrearOC,
}: ProveedoresDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.size === proveedores.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(proveedores.map((p) => p.id)));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleAction = (action: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action();
    setOpenMenuId(null);
  };

  const allSelected =
    proveedores.length > 0 && selectedIds.size === proveedores.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Seleccionar todos los proveedores"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="py-3 px-4">Razón Social</th>
              <th className="py-3 px-3">CUIT</th>
              <th className="py-3 px-4">Rubro Comercial</th>
              <th className="py-3 px-4">Contacto</th>
              <th className="py-3 px-3">Condición Pago</th>
              <th className="py-3 px-4 text-right">Compras Mes</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-3 w-16 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {proveedores.map((prov) => {
              const isSelected = selectedIds.has(prov.id);
              const isRowActive = proveedorSeleccionadoId === prov.id;
              const isMenuOpen = openMenuId === prov.id;

              return (
                <tr
                  key={prov.id}
                  onClick={() => onSelectProveedor(prov)}
                  className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${
                    isRowActive ? "bg-blue-50/80 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td
                    className="py-3.5 px-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        toggleSelectRow(prov.id, e as unknown as React.MouseEvent)
                      }
                      aria-label={`Seleccionar ${prov.razonSocial}`}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                    />
                  </td>

                  {/* Razón Social */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-snug">
                          {prov.razonSocial}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {prov.contactoComercial}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* CUIT */}
                  <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {prov.cuit}
                  </td>

                  {/* Rubro */}
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {prov.rubro}
                    </span>
                  </td>

                  {/* Contacto (Tel / Email) */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{prov.telefono}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{prov.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Condición Pago */}
                  <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {prov.condicionPagoDias} días
                  </td>

                  {/* Compras Mes */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                    ${(prov.totalComprasMes ?? 0).toLocaleString("es-AR")}
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {prov.activo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Activo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Inactivo</span>
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td
                    className="py-3.5 px-3 text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : prov.id)
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Acciones de proveedor"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Menú Desplegable */}
                    {isMenuOpen && (
                      <div className="absolute right-3 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                        <button
                          type="button"
                          onClick={(e) =>
                            handleAction(() => onSelectProveedor(prov), e)
                          }
                          className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ver legajo / Ficha</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleAction(() => onCrearOC?.(prov), e)
                          }
                          className="w-full px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition-colors border-t border-slate-100"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Nueva Orden Compra</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleAction(() => {
                              const content = `ADMINISTRACIÓN FEDERAL DE INGRESOS PÚBLICOS (AFIP / ARCA)\nCONSTANCIA DE INSCRIPCIÓN Y HOMOLOGACIÓN\n==================================================\nRazón Social: ${prov.razonSocial}\nCUIT: ${prov.cuit}\nRubro: ${prov.rubro}\nCondición de Pago: ${prov.condicionPagoDias} días\nEstado: PROVEEDOR HOMOLOGADO SUNNIX\nFecha: ${new Date().toLocaleDateString("es-AR")}\n==================================================`;
                              const blob = new Blob([content], {
                                type: "text/plain;charset=utf-8",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `Constancia_Fiscal_${prov.cuit}.txt`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }, e)
                          }
                          className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Constancia CUIT</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div>
          Mostrando <span className="font-semibold text-slate-800">{proveedores.length}</span> proveedores registrados
        </div>
        <div className="text-[11px] text-slate-400">
          Haz clic en cualquier fila para inspeccionar el legajo comercial y las condiciones de entrega
        </div>
      </div>
    </div>
  );
}
