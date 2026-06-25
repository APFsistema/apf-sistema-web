APF v69 - Admin login corregido

Cambios:
- /admin y /administrador apuntan al panel Admin.
- Se elimina el prompt viejo de clave APF2026.
- Admin y planillero abren modal de email y contraseña real con Supabase.
- Incluye configuración directa de Supabase para evitar depender de carpetas /api y /js.

Después de subir estos archivos a GitHub, Vercel actualiza la web.
Luego crear el usuario en Supabase Authentication y en la tabla profiles con role=admin.
