-- APF tablas base Supabase
create table if not exists usuarios (id uuid primary key, nombre text, rol text, activo boolean default true);
create table if not exists competencias (id uuid primary key, nombre text, tipo text, rama text, categoria text, estado text);
create table if not exists jugadores (id uuid primary key, nombre text, rama text, categoria text);
create table if not exists parejas (id uuid primary key, competencia_id uuid, jugador1 text, jugador2 text, estado text);
create table if not exists partidos (id uuid primary key, competencia_id uuid, pareja_a text, pareja_b text, fecha text, hora text, cancha text, estado text, planillero_id uuid);
create table if not exists marcadores (id uuid primary key, partido_id uuid, data jsonb, updated_at timestamptz default now());
create table if not exists resultados (id uuid primary key, partido_id uuid, ganador text, resultado jsonb, publicado boolean default false);
create table if not exists rankings (id uuid primary key, competencia_id uuid, data jsonb);
create table if not exists sponsors (id uuid primary key, nombre text, ubicacion text, activo boolean default true);
create table if not exists historial (id uuid primary key, usuario_id uuid, accion text, detalle jsonb, created_at timestamptz default now());
