-- APF estructura orientativa para Supabase/PostgreSQL
-- Es una base guía para la futura web real.

create table competencias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text check (tipo in ('Liga','Torneo','Americano','Relampago')),
  rama text check (rama in ('Masculino','Femenino','Mixto')),
  categoria text,
  formato text,
  estado text,
  reglas jsonb default '{}',
  created_at timestamptz default now()
);

create table jugadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text,
  rama text,
  categoria text,
  lado text,
  foto_url text,
  telefono text,
  created_at timestamptz default now()
);

create table parejas (
  id uuid primary key default gen_random_uuid(),
  competencia_id uuid references competencias(id),
  jugador1_id uuid references jugadores(id),
  jugador2_id uuid references jugadores(id),
  estado_inscripcion text,
  pago numeric default 0,
  observaciones text,
  created_at timestamptz default now()
);

create table usuarios_apf (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text unique,
  rol text check (rol in ('admin','planillero')),
  activo boolean default true,
  permisos jsonb default '{}'
);

create table partidos (
  id uuid primary key default gen_random_uuid(),
  competencia_id uuid references competencias(id),
  pareja1_id uuid references parejas(id),
  pareja2_id uuid references parejas(id),
  fecha date,
  hora time,
  cancha text,
  estado text,
  planillero_id uuid references usuarios_apf(id),
  created_at timestamptz default now()
);

create table marcadores (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid references partidos(id),
  sets jsonb default '[]',
  puntos jsonb default '{}',
  sacador text,
  estado text,
  live boolean default false,
  updated_at timestamptz default now()
);

create table resultados (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid references partidos(id),
  ganador_pareja_id uuid references parejas(id),
  detalle jsonb default '{}',
  publicado boolean default false,
  finalizado_at timestamptz default now()
);

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text,
  logo_url text,
  ubicaciones jsonb default '[]',
  activo boolean default true
);

create table historial (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid,
  accion text,
  modulo text,
  detalle jsonb default '{}',
  created_at timestamptz default now()
);
