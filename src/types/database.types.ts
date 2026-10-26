export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TipoTurno = "consulta" | "control" | "procedimiento" | "cirugia_menor" | "bloqueado";
export type EstadoTurno = "pendiente" | "confirmado" | "asistio" | "no_asistio" | "reprogramado" | "cancelado";
export type EstadoCirugia = "programada" | "en_curso" | "finalizada" | "cancelada";
export type TipoMembresia = "individual" | "familiar";
export type EstadoMembresia = "activa" | "vencida" | "suspendida";
export type MedioPago = "efectivo" | "transferencia" | "tarjeta" | "cheque";
export type EstadoFactura = "al_dia" | "por_vencer" | "hoy_vence" | "vencida" | "cobrada" | "anulada";
export type EstadoOC = "pendiente" | "en_transito" | "recepcionada" | "cancelada";
export type CategoriaInsumo = "descartables" | "medicamentos" | "curaciones" | "higiene" | "soluciones" | "otros";

export interface Database {
  public: {
    Tables: {
      consultorios: {
        Row: {
          id: string;
          numero: string;
          nombre: string;
          es_quirofano: boolean;
          piso: string;
          equipamiento: string | null;
          habilitado: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero: string;
          nombre: string;
          es_quirofano?: boolean;
          piso?: string;
          equipamiento?: string | null;
          habilitado?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero?: string;
          nombre?: string;
          es_quirofano?: boolean;
          piso?: string;
          equipamiento?: string | null;
          habilitado?: boolean;
          created_at?: string;
        };
      };
      membresias: {
        Row: {
          id: string;
          codigo: string;
          nombre_plan: string;
          tipo: TipoMembresia;
          estado: EstadoMembresia;
          fecha_inicio: string;
          fecha_vencimiento: string;
          beneficios: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          nombre_plan: string;
          tipo?: TipoMembresia;
          estado?: EstadoMembresia;
          fecha_inicio: string;
          fecha_vencimiento: string;
          beneficios?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          nombre_plan?: string;
          tipo?: TipoMembresia;
          estado?: EstadoMembresia;
          fecha_inicio?: string;
          fecha_vencimiento?: string;
          beneficios?: string[] | null;
          created_at?: string;
        };
      };
      pacientes: {
        Row: {
          id: string;
          nombre_completo: string;
          dni: string;
          fecha_nacimiento: string | null;
          telefono: string | null;
          email: string | null;
          direccion: string | null;
          obra_social: string | null;
          numero_afiliado: string | null;
          grupo_sanguineo: string | null;
          alergias: string[] | null;
          enfermedades_preexistentes: string[] | null;
          medicamentos_habituales: string[] | null;
          observaciones_medicas: string | null;
          contacto_emergencia_nombre: string | null;
          contacto_emergencia_telefono: string | null;
          membresia_id: string | null;
          parentesco_membresia: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre_completo: string;
          dni: string;
          fecha_nacimiento?: string | null;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          obra_social?: string | null;
          numero_afiliado?: string | null;
          grupo_sanguineo?: string | null;
          alergias?: string[] | null;
          enfermedades_preexistentes?: string[] | null;
          medicamentos_habituales?: string[] | null;
          observaciones_medicas?: string | null;
          contacto_emergencia_nombre?: string | null;
          contacto_emergencia_telefono?: string | null;
          membresia_id?: string | null;
          parentesco_membresia?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          dni?: string;
          fecha_nacimiento?: string | null;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          obra_social?: string | null;
          numero_afiliado?: string | null;
          grupo_sanguineo?: string | null;
          alergias?: string[] | null;
          enfermedades_preexistentes?: string[] | null;
          medicamentos_habituales?: string[] | null;
          observaciones_medicas?: string | null;
          contacto_emergencia_nombre?: string | null;
          contacto_emergencia_telefono?: string | null;
          membresia_id?: string | null;
          parentesco_membresia?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profesionales: {
        Row: {
          id: string;
          nombre_completo: string;
          dni: string;
          matricula: string;
          especialidad: string;
          telefono: string | null;
          email: string | null;
          activo: boolean;
          consultorio_asignado_id: string | null;
          monto_alquiler_mensual: number;
          alquiler_fecha_vencimiento: string | null;
          servicios_prestados: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre_completo: string;
          dni: string;
          matricula: string;
          especialidad: string;
          telefono?: string | null;
          email?: string | null;
          activo?: boolean;
          consultorio_asignado_id?: string | null;
          monto_alquiler_mensual?: number;
          alquiler_fecha_vencimiento?: string | null;
          servicios_prestados?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          dni?: string;
          matricula?: string;
          especialidad?: string;
          telefono?: string | null;
          email?: string | null;
          activo?: boolean;
          consultorio_asignado_id?: string | null;
          monto_alquiler_mensual?: number;
          alquiler_fecha_vencimiento?: string | null;
          servicios_prestados?: string[] | null;
          created_at?: string;
        };
      };
      turnos: {
        Row: {
          id: string;
          paciente_id: string;
          profesional_id: string;
          consultorio_id: string;
          fecha: string;
          hora_inicio: string;
          hora_fin: string;
          tipo: TipoTurno;
          estado: EstadoTurno;
          motivo: string | null;
          notas: string | null;
          turno_origen_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          profesional_id: string;
          consultorio_id: string;
          fecha: string;
          hora_inicio: string;
          hora_fin: string;
          tipo?: TipoTurno;
          estado?: EstadoTurno;
          motivo?: string | null;
          notas?: string | null;
          turno_origen_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          profesional_id?: string;
          consultorio_id?: string;
          fecha?: string;
          hora_inicio?: string;
          hora_fin?: string;
          tipo?: TipoTurno;
          estado?: EstadoTurno;
          motivo?: string | null;
          notas?: string | null;
          turno_origen_id?: string | null;
          created_at?: string;
        };
      };
      cirugias: {
        Row: {
          id: string;
          paciente_id: string;
          cirujano_id: string;
          quirofano_id: string;
          procedimiento: string;
          fecha: string;
          hora_inicio: string;
          duracion_estimada_horas: number;
          estado: EstadoCirugia;
          observaciones: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          cirujano_id: string;
          quirofano_id: string;
          procedimiento: string;
          fecha: string;
          hora_inicio: string;
          duracion_estimada_horas: number;
          estado?: EstadoCirugia;
          observaciones?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          cirujano_id?: string;
          quirofano_id?: string;
          procedimiento?: string;
          fecha?: string;
          hora_inicio?: string;
          duracion_estimada_horas?: number;
          estado?: EstadoCirugia;
          observaciones?: string | null;
          created_at?: string;
        };
      };
      cuentas_financieras: {
        Row: {
          id: string;
          nombre: string;
          saldo_actual: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          saldo_actual?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          saldo_actual?: number;
          created_at?: string;
        };
      };
      movimientos_caja: {
        Row: {
          id: string;
          cuenta_financiera_id: string;
          tipo_movimiento: "ingreso" | "egreso";
          categoria: string;
          concepto: string;
          monto: number;
          medio_pago: MedioPago;
          fecha: string;
          comprobante_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cuenta_financiera_id: string;
          tipo_movimiento: "ingreso" | "egreso";
          categoria: string;
          concepto: string;
          monto: number;
          medio_pago: MedioPago;
          fecha?: string;
          comprobante_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cuenta_financiera_id?: string;
          tipo_movimiento?: "ingreso" | "egreso";
          categoria?: string;
          concepto?: string;
          monto?: number;
          medio_pago?: MedioPago;
          fecha?: string;
          comprobante_url?: string | null;
          created_at?: string;
        };
      };
      facturas_cobro: {
        Row: {
          id: string;
          numero_factura: string;
          paciente_id: string;
          especialidad: string | null;
          concepto: string;
          monto_original: number;
          fecha_emision: string;
          fecha_vencimiento: string;
          tasa_interes_mensual: number;
          estado: EstadoFactura;
          monto_pagado: number;
          fecha_pago: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero_factura: string;
          paciente_id: string;
          especialidad?: string | null;
          concepto: string;
          monto_original: number;
          fecha_emision: string;
          fecha_vencimiento: string;
          tasa_interes_mensual?: number;
          estado?: EstadoFactura;
          monto_pagado?: number;
          fecha_pago?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero_factura?: string;
          paciente_id?: string;
          especialidad?: string | null;
          concepto?: string;
          monto_original?: number;
          fecha_emision?: string;
          fecha_vencimiento?: string;
          tasa_interes_mensual?: number;
          estado?: EstadoFactura;
          monto_pagado?: number;
          fecha_pago?: string | null;
          created_at?: string;
        };
      };
      proveedores: {
        Row: {
          id: string;
          razon_social: string;
          cuit: string;
          rubro: string;
          telefono: string | null;
          email: string | null;
          direccion: string | null;
          condicion_pago_dias: number;
          contacto_comercial: string | null;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          razon_social: string;
          cuit: string;
          rubro: string;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          condicion_pago_dias?: number;
          contacto_comercial?: string | null;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          razon_social?: string;
          cuit?: string;
          rubro?: string;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          condicion_pago_dias?: number;
          contacto_comercial?: string | null;
          activo?: boolean;
          created_at?: string;
        };
      };
      insumos: {
        Row: {
          id: string;
          codigo: string;
          nombre: string;
          categoria: CategoriaInsumo;
          presentacion: string;
          stock_actual: number;
          stock_minimo: number;
          ubicacion: string | null;
          precio_compra_referencia: number;
          proveedor_habitual_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          nombre: string;
          categoria: CategoriaInsumo;
          presentacion: string;
          stock_actual?: number;
          stock_minimo?: number;
          ubicacion?: string | null;
          precio_compra_referencia?: number;
          proveedor_habitual_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          nombre?: string;
          categoria?: CategoriaInsumo;
          presentacion?: string;
          stock_actual?: number;
          stock_minimo?: number;
          ubicacion?: string | null;
          precio_compra_referencia?: number;
          proveedor_habitual_id?: string | null;
          created_at?: string;
        };
      };
      ordenes_compra: {
        Row: {
          id: string;
          numero_orden: string;
          proveedor_id: string;
          monto_total: number;
          fecha: string;
          estado: EstadoOC;
          created_at: string;
        };
        Insert: {
          id?: string;
          numero_orden: string;
          proveedor_id: string;
          monto_total: number;
          fecha: string;
          estado?: EstadoOC;
          created_at?: string;
        };
        Update: {
          id?: string;
          numero_orden?: string;
          proveedor_id?: string;
          monto_total?: number;
          fecha?: string;
          estado?: EstadoOC;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      tipo_turno: TipoTurno;
      estado_turno: EstadoTurno;
      estado_cirugia: EstadoCirugia;
      tipo_membresia: TipoMembresia;
      estado_membresia: EstadoMembresia;
      medio_pago: MedioPago;
      estado_factura: EstadoFactura;
      estado_oc: EstadoOC;
      categoria_insumo: CategoriaInsumo;
    };
  };
}
