APF Plataforma Web v60 - Conexión real base

Esta entrega prepara el salto del prototipo local a una plataforma online real.

Incluye:
- sistema_completo_v60.html: prototipo completo actualizado.
- rutas HTML base: index, admin, planillero, tv, publico, fixture, ranking y accesos.
- src/config: archivos para credenciales Firebase o Supabase.
- src/auth: estructura de permisos Admin / Planillero / Público.
- src/services: funciones base para guardar competencias, parejas, partidos, resultados y ranking.
- src/realtime: base para marcador en vivo sincronizado.
- database: estructuras orientativas para Firebase/Supabase.
- deploy: ejemplo de rutas para Vercel.

Próximo paso real:
1. Elegir Firebase o Supabase.
2. Crear el proyecto online.
3. Pegar credenciales en los archivos de configuración.
4. Crear login real para Admin y Planilleros.
5. Conectar marcador en vivo en tiempo real.
6. Subir a dominio o link público.

Notas:
El público será solo lectura. El planillero solo podrá manejar sus partidos asignados. El Admin APF tendrá acceso total.
