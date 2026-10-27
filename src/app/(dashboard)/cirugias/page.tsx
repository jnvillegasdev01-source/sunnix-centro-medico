"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CIRUGIAS } from "@/lib/data/mock-agenda";
import { VistaAgenda, CirugiaItem } from "@/types/agenda";
import { AgendaHeader } from "@/components/agenda/agenda-header";
import { CirugiasPanel } from "@/components/agenda/cirugias-panel";
import { NuevaCirugiaModal } from "@/components/agenda/nueva-cirugia-modal";

export default function CirugiasPage() {
  const router = useRouter();
  const [cirugias, setCirugias] = useState<CirugiaItem[]>([...MOCK_CIRUGIAS]);
  const [vista, setVista] = useState<VistaAgenda>("dia");
  const [fechaTexto] = useState<string>("Lunes, 12 de mayo de 2025");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddCirugia = (nueva: CirugiaItem) => {
    setCirugias((prev) => [nueva, ...prev]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AgendaHeader
        pestanaPrincipal="cirugias"
        onPestanaChange={(pestana) => {
          if (pestana === "turnos") {
            router.push("/agenda");
          }
        }}
        fechaTexto={fechaTexto}
        vista={vista}
        onVistaChange={setVista}
        onNuevaCirugia={() => setIsModalOpen(true)}
      />

      <CirugiasPanel
        cirugias={cirugias}
        fechaTexto={fechaTexto}
        onNuevaCirugia={() => setIsModalOpen(true)}
      />

      <NuevaCirugiaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCirugia}
      />
    </div>
  );
}
