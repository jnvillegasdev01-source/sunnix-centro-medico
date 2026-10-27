"use client";

import React from "react";
import { DocumentoProfesional } from "@/types/profesionales";
import {
  FileText,
  Download,
  Upload,
  Calendar,
  CheckCircle2,
  FileCheck,
  Shield,
  FileBadge,
} from "lucide-react";

interface DocumentosTableProps {
  readonly documentos: readonly DocumentoProfesional[];
  readonly onSubirDocumento?: () => void;
}

export function DocumentosTable({
  documentos,
  onSubirDocumento,
}: DocumentosTableProps) {
  const getDocumentIcon = (tipo: DocumentoProfesional["tipo"]) => {
    switch (tipo) {
      case "Titulo médico":
        return <FileBadge className="w-4 h-4 text-indigo-600" />;
      case "Matrícula":
        return <FileCheck className="w-4 h-4 text-sky-600" />;
      case "Seguro RC":
        return <Shield className="w-4 h-4 text-rose-600" />;
      case "Contrato de alquiler":
        return <FileText className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Legajo y Documentación Obligatoria
            </h3>
            <p className="text-xs text-slate-500">
              Certificaciones profesionales, seguro de mala praxis y contratos de locación.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubirDocumento}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Cargar documento</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">Tipo de Documento</th>
              <th className="py-3 px-4">Nombre de Archivo</th>
              <th className="py-3 px-4">Fecha de Carga</th>
              <th className="py-3 px-4">Vigencia</th>
              <th className="py-3 px-4 text-right">Descarga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {documentos.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <div className="p-1.5 rounded-lg bg-slate-100">
                      {getDocumentIcon(doc.tipo)}
                    </div>
                    <span>{doc.tipo}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">
                  {doc.nombreArchivo}
                </td>
                <td className="py-3 px-4 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.fechaSubida}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {doc.estado ?? "Vigente"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={doc.urlDescarga}
                    download
                    onClick={(e) => {
                      e.preventDefault();
                      const content = `SUNNIX CENTRO MÉDICO - LEGAJO PROFESIONAL\nDocumento: ${doc.nombreArchivo}\nTipo: ${doc.tipo}\nFecha de homologación: ${doc.fechaSubida}\nEstado: ${doc.estado ?? "Vigente"}\n`;
                      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = doc.nombreArchivo.endsWith(".pdf") ? doc.nombreArchivo.replace(".pdf", ".txt") : `${doc.nombreArchivo}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
