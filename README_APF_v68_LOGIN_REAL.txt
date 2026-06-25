APF Web Real v68 - Login real Supabase

Esta versión agrega login real para Admin y Planillero usando Supabase Auth.

Archivos nuevos:
- api/apf-config.js: lee variables de Vercel y entrega config al navegador.
- js/apfAuthReal.js: reemplaza el acceso viejo por login real.
- sql/crear_admin_apf_v68.sql: script para convertir un usuario Auth en Admin.
- sql/crear_planillero_apf_v68.sql: script para convertir usuario Auth en Planillero.
- docs/PASOS_LOGIN_REAL_APF_v68.txt: guía paso a paso.

Variables necesarias en Vercel:
- SUPABASE_URL
- SUPABASE_ANON_KEY

Ruta de prueba:
- /admin
