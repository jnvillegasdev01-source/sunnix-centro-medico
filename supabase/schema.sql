-- ==========================================================
-- SUNNIX CENTRO MÉDICO - DDL & SEED CONSOLIDADO PARA SUPABASE
-- ==========================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE tipo_turno AS ENUM ('consulta', 'control', 'procedimiento', 'cirugia_menor', 'bloqueado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_turno AS ENUM ('pendiente', 'confirmado', 'asistio', 'no_asistio', 'reprogramado', 'cancelado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_cirugia AS ENUM ('programada', 'en_curso', 'finalizada', 'cancelada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tipo_membresia AS ENUM ('individual', 'familiar');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_membresia AS ENUM ('activa', 'vencida', 'suspendida');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE medio_pago AS ENUM ('efectivo', 'transferencia', 'tarjeta', 'cheque');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_factura AS ENUM ('al_dia', 'por_vencer', 'hoy_vence', 'vencida', 'cobrada', 'anulada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE estado_oc AS ENUM ('pendiente', 'en_transito', 'recepcionada', 'cancelada');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE categoria_insumo AS ENUM ('descartables', 'medicamentos', 'curaciones', 'higiene', 'soluciones', 'otros');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. TABLAS
CREATE TABLE IF NOT EXISTS consultorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    es_quirofano BOOLEAN DEFAULT FALSE,
    piso VARCHAR(50) DEFAULT 'Piso 1 - Ala Norte',
    equipamiento TEXT,
    habilitado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membresias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre_plan VARCHAR(100) NOT NULL,
    tipo tipo_membresia NOT NULL DEFAULT 'individual',
    estado estado_membresia NOT NULL DEFAULT 'activa',
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    beneficios TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo VARCHAR(150) NOT NULL,
    dni VARCHAR(30) UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    obra_social VARCHAR(100),
    numero_afiliado VARCHAR(100),
    grupo_sanguineo VARCHAR(10),
    alergias TEXT[],
    enfermedades_preexistentes TEXT[],
    medicamentos_habituales TEXT[],
    observaciones_medicas TEXT,
    contacto_emergencia_nombre VARCHAR(150),
    contacto_emergencia_telefono VARCHAR(50),
    membresia_id UUID REFERENCES membresias(id) ON DELETE SET NULL,
    parentesco_membresia VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profesionales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo VARCHAR(150) NOT NULL,
    dni VARCHAR(30) UNIQUE NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    consultorio_asignado_id UUID REFERENCES consultorios(id) ON DELETE SET NULL,
    monto_alquiler_mensual NUMERIC(12, 2) DEFAULT 0.00,
    alquiler_fecha_vencimiento DATE,
    servicios_prestados TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    profesional_id UUID NOT NULL REFERENCES profesionales(id) ON DELETE RESTRICT,
    consultorio_id UUID NOT NULL REFERENCES consultorios(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo tipo_turno NOT NULL DEFAULT 'consulta',
    estado estado_turno NOT NULL DEFAULT 'confirmado',
    motivo VARCHAR(255),
    notas TEXT,
    turno_origen_id UUID REFERENCES turnos(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cirugias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    cirujano_id UUID NOT NULL REFERENCES profesionales(id) ON DELETE RESTRICT,
    quirofano_id UUID NOT NULL REFERENCES consultorios(id) ON DELETE RESTRICT,
    procedimiento VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    duracion_estimada_horas NUMERIC(4, 2) NOT NULL,
    estado estado_cirugia NOT NULL DEFAULT 'programada',
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cuentas_financieras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    saldo_actual NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cuenta_financiera_id UUID NOT NULL REFERENCES cuentas_financieras(id),
    tipo_movimiento VARCHAR(10) NOT NULL CHECK (tipo_movimiento IN ('ingreso', 'egreso')),
    categoria VARCHAR(100) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    monto NUMERIC(12, 2) NOT NULL,
    medio_pago medio_pago NOT NULL,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    comprobante_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS facturas_cobro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id),
    especialidad VARCHAR(100),
    concepto VARCHAR(255) NOT NULL,
    monto_original NUMERIC(12, 2) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    tasa_interes_mensual NUMERIC(5, 2) DEFAULT 2.00,
    estado estado_factura NOT NULL DEFAULT 'al_dia',
    monto_pagado NUMERIC(12, 2) DEFAULT 0.00,
    fecha_pago TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proveedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    razon_social VARCHAR(150) NOT NULL,
    cuit VARCHAR(30) UNIQUE NOT NULL,
    rubro VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion TEXT,
    condicion_pago_dias INT DEFAULT 30,
    contacto_comercial VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS insumos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    categoria categoria_insumo NOT NULL,
    presentacion VARCHAR(100) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 10,
    ubicacion VARCHAR(100) DEFAULT 'Depósito Central',
    precio_compra_referencia NUMERIC(12, 2) DEFAULT 0.00,
    proveedor_habitual_id UUID REFERENCES proveedores(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id UUID NOT NULL REFERENCES proveedores(id),
    monto_total NUMERIC(12, 2) NOT NULL,
    fecha DATE NOT NULL,
    estado estado_oc NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
ALTER TABLE consultorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE membresias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cirugias ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuentas_financieras ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas_cobro ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_compra ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS RLS (Lectura y Escritura permitidas para la aplicación)
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public access for all operations" ON %I', t);
    EXECUTE format('CREATE POLICY "Public access for all operations" ON %I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- 6. DATOS INICIALES (SEED DATA)
INSERT INTO consultorios (id, numero, nombre, es_quirofano, piso, equipamiento, habilitado) VALUES
('11111111-1111-1111-1111-111111111101', '01', 'Consultorio 1', false, 'Piso 1 - Ala Norte', 'Camilla ergonómica, Otoscopio de pared, Computadora diagnóstica', true),
('11111111-1111-1111-1111-111111111102', '02', 'Consultorio 2', false, 'Piso 1 - Ala Norte', 'Electrocardiógrafo digital, Tensiómetro de mercurio, Negatoscopio LED', true),
('11111111-1111-1111-1111-111111111103', '03', 'Consultorio 3', false, 'Piso 1 - Ala Norte', 'Lámpara de hendidura, Cartel de Snellen digital, Oftalmoscopio', true),
('11111111-1111-1111-1111-111111111104', '04', 'Consultorio 4', false, 'Piso 1 - Ala Norte', 'Dermatoscopio polarizado, Camilla quirúrgica para biopsias', true),
('11111111-1111-1111-1111-111111111105', '05', 'Consultorio 5', false, 'Piso 1 - Ala Sur', 'Ecógrafo Doppler color, Transductores lineales y convexos', true),
('11111111-1111-1111-1111-111111111106', '06', 'Consultorio 6', false, 'Piso 1 - Ala Sur', 'Podoscopio, Pediluvio estéril, Instrumental podológico', true),
('11111111-1111-1111-1111-111111111107', 'Q1', 'Quirófano 1', true, 'Piso 2 - Centro Quirúrgico', 'Mesa de cirugía radiolúcida, Torre de laparoscopía 4K, Lámparas cialíticas', true),
('11111111-1111-1111-1111-111111111108', 'Q2', 'Quirófano 2', true, 'Piso 2 - Centro Quirúrgico', 'Equipo de anestesia multiparamétrico, Arco en C, Electrobisturí', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cuentas_financieras (id, nombre, saldo_actual) VALUES
('22222222-2222-2222-2222-222222222201', 'Caja principal', 2450000.00),
('22222222-2222-2222-2222-222222222202', 'Banco Santander', 8920500.00),
('22222222-2222-2222-2222-222222222203', 'Banco Macro', 1150000.00),
('22222222-2222-2222-2222-222222222204', 'Caja chica', 180000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO membresias (id, codigo, nombre_plan, tipo, estado, fecha_inicio, fecha_vencimiento, beneficios) VALUES
('33333333-3333-3333-3333-333333333301', 'FAM-000125', 'Plan Familiar', 'familiar', 'activa', '2024-01-01', '2026-12-31', ARRAY['Descuentos en farmacia (hasta 40%)', 'Sin ecoseguro en consultas', 'Atención prioritaria en guardia', '1 chequeo anual bonificado']),
('33333333-3333-3333-3333-333333333302', 'IND-000889', 'Plan Individual', 'individual', 'activa', '2024-05-01', '2026-10-15', ARRAY['Descuentos en farmacia (20%)', '1 chequeo preventivo anual'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO pacientes (id, nombre_completo, dni, fecha_nacimiento, telefono, email, direccion, obra_social, numero_afiliado, grupo_sanguineo, alergias, enfermedades_preexistentes, medicamentos_habituales, observaciones_medicas, membresia_id, parentesco_membresia) VALUES
('44444444-4444-4444-4444-444444444401', 'Ana Torres', '32.894.102', '1988-04-14', '+54 9 11 4455-8899', 'ana.torres@email.com', 'Av. Santa Fe 3421, 4° B, CABA', 'OSDE 310', '2-45892110-01', 'A+', ARRAY['Penicilina', 'AINES (Ibuprofeno)'], ARRAY['Asma leve intermitente', 'Hipotiroidismo'], ARRAY['Levotiroxina 50mcg', 'Salbutamol a demanda'], 'Controles clínicos regulares.', '33333333-3333-3333-3333-333333333301', 'Titular'),
('44444444-4444-4444-4444-444444444402', 'Carlos Mendoza', '28.341.982', '1981-08-22', '+54 9 11 6721-3345', 'cmendoza@email.com', 'Arenales 1890, CABA', 'Swiss Medical', 'SM-990123-0', '0+', ARRAY[]::text[], ARRAY['Hipertensión arterial'], ARRAY['Enalapril 10mg'], 'Seguimiento por cardiología.', '33333333-3333-3333-3333-333333333302', 'Titular'),
('44444444-4444-4444-4444-444444444403', 'Lucía Fernández', '40.119.854', '1997-11-03', '+54 9 11 3190-4455', 'lucia.f@email.com', 'Juncal 2280, 2° A, CABA', 'Particular', 'SIN-COBERTURA', 'B+', ARRAY['Látex'], ARRAY[]::text[], ARRAY[]::text[], 'Paciente joven sin antecedentes.', null, null),
('44444444-4444-4444-4444-444444444404', 'María Díaz', '29.876.543', '1983-02-17', '+54 9 11 5566-7788', 'maria.diaz@email.com', 'Callao 1120, CABA', 'Galeno Oro', 'GAL-887711-1', 'A-', ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], 'Alerta: 3 ausencias reiteradas sin aviso.', null, null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profesionales (id, nombre_completo, dni, matricula, especialidad, telefono, email, activo, consultorio_asignado_id, monto_alquiler_mensual, alquiler_fecha_vencimiento, servicios_prestados) VALUES
('55555555-5555-5555-5555-555555555501', 'Dra. Laura García', '28.450.912', 'MN 158.762', 'Cardiología', '+54 9 11 4589-2211', 'lgarcia@sunnix.com.ar', true, '11111111-1111-1111-1111-111111111101', 185000.00, '2025-05-15', ARRAY['Consulta cardiológica', 'Electrocardiograma (ECG)', 'Ecocardiograma Doppler', 'Ergometría']),
('55555555-5555-5555-5555-555555555502', 'Dr. Martín López', '25.334.810', 'MN 142.109', 'Pediatría', '+54 9 11 5522-3344', 'mlopez@sunnix.com.ar', true, '11111111-1111-1111-1111-111111111102', 170000.00, '2025-05-10', ARRAY['Control de niño sano', 'Vacunación', 'Atención de guardia']),
('55555555-5555-5555-5555-555555555503', 'Dra. Sofia Martínez', '31.220.445', 'MN 169.340', 'Dermatología', '+54 9 11 6611-9988', 'smartinez@sunnix.com.ar', true, '11111111-1111-1111-1111-111111111104', 190000.00, '2025-05-12', ARRAY['Consulta dermatológica', 'Biopsias cutáneas', 'Tratamiento de acné'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO proveedores (id, razon_social, cuit, rubro, telefono, email, direccion, condicion_pago_dias, contacto_comercial, activo) VALUES
('66666666-6666-6666-6666-666666666601', 'Droguería Médica Sur S.A.', '30-71234567-8', 'Descartables y Soluciones', '+54 11 4300-1122', 'ventas@drogueriasur.com.ar', 'Av. Vélez Sarsfield 1850, CABA', 30, 'Martín Balcarce', true),
('66666666-6666-6666-6666-666666666602', 'Insumos Hospitalarios Andina S.R.L.', '30-68991234-5', 'Material de Curación', '+54 11 4710-5566', 'pedidos@andina.com.ar', 'Parque Industrial Pilar, Lote 14', 15, 'Carla Funes', true),
('66666666-6666-6666-6666-666666666603', 'Biomédica Argentina S.A.', '33-59124870-9', 'Instrumental Quirúrgico', '+54 11 4980-3300', 'licitaciones@biomedica.com.ar', 'Av. Córdoba 4520, CABA', 45, 'Dr. Roberto Galán', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO insumos (id, codigo, nombre, categoria, presentacion, stock_actual, stock_minimo, precio_compra_referencia, proveedor_habitual_id) VALUES
('77777777-7777-7777-7777-777777777701', 'INS-001', 'Guantes de Látex Descartables Talle M', 'descartables', 'Caja x 100 unidades', 28, 50, 4850.00, '66666666-6666-6666-6666-666666666601'),
('77777777-7777-7777-7777-777777777702', 'INS-002', 'Jeringas Descartables 5ml con aguja', 'descartables', 'Caja x 100 unidades', 12, 40, 6200.00, '66666666-6666-6666-6666-666666666601'),
('77777777-7777-7777-7777-777777777703', 'INS-003', 'Solución Fisiológica 0.9% 500ml', 'soluciones', 'Sachet x 500 ml', 180, 60, 1850.00, '66666666-6666-6666-6666-666666666601'),
('77777777-7777-7777-7777-777777777704', 'INS-004', 'Alcohol en Gel Sanitizante 70%', 'higiene', 'Bidón x 5 Litros', 4, 15, 14200.00, '66666666-6666-6666-6666-666666666602'),
('77777777-7777-7777-7777-777777777705', 'INS-005', 'Gasas Estériles 10x10 cm', 'curaciones', 'Paquete x 50 sobres', 95, 30, 3950.00, '66666666-6666-6666-6666-666666666602')
ON CONFLICT (id) DO NOTHING;

INSERT INTO facturas_cobro (id, numero_factura, paciente_id, especialidad, concepto, monto_original, fecha_emision, fecha_vencimiento, tasa_interes_mensual, estado, monto_pagado) VALUES
('88888888-8888-8888-8888-888888888801', 'FAC-00123', '44444444-4444-4444-4444-444444444401', 'Cardiología', 'Consulta médica ambulatoria y ECG', 45000.00, '2025-05-01', '2025-05-15', 2.00, 'al_dia', 0.00),
('88888888-8888-8888-8888-888888888802', 'FAC-00124', '44444444-4444-4444-4444-444444444402', 'Clínica Médica', 'Chequeo preventivo de laboratorio', 32000.00, '2025-04-10', '2025-04-25', 2.00, 'vencida', 0.00),
('88888888-8888-8888-8888-888888888803', 'FAC-00125', '44444444-4444-4444-4444-444444444403', 'Dermatología', 'Crioterapia de lesión dérmica', 58000.00, '2025-05-02', '2025-05-12', 2.00, 'por_vencer', 0.00)
ON CONFLICT (id) DO NOTHING;
