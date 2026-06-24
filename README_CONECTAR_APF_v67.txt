APF Web Real v67 - Conectable Final

Esta carpeta contiene la base final conectable de la plataforma APF.

OBJETIVO
- Admin APF con acceso total.
- Planillero con acceso solo al marcador/partidos asignados.
- Público sin contraseña y solo lectura.
- Datos guardados en Supabase.
- Publicación en Vercel.

PASOS FINALES
1) Crear proyecto en Supabase.
2) Ejecutar sql/supabase_schema_final_apf.sql en SQL Editor.
3) Crear usuarios desde Supabase Auth.
4) Crear perfiles en la tabla profiles con role = admin o planillero.
5) Copiar js/config.example.js como js/config.js y completar URL + ANON KEY.
6) Subir esta carpeta a Vercel.
7) Probar rutas:
   /, /admin, /planillero, /tv, /publico, /fixture, /ranking, /accesos
8) Hacer prueba piloto con una competencia chica.

IMPORTANTE
Esta versión queda lista para conectar. Para que funcione con datos reales hay que cargar credenciales reales de Supabase y publicar en Vercel.
