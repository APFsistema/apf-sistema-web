APF Web Real v71 - Marcadores en Vivo Reales

Cambios principales:
- Los marcadores nuevos usan ID UUID compatible con Supabase.
- Al crear un marcador desde Admin se guarda en Supabase en tablas partidos y marcadores.
- Marcadores en vivo, público y TV leen marcadores online de Supabase.
- Sincronización automática cada pocos segundos y canal realtime cuando está disponible.
- Botón/estado visual de conexión: conectado, sincronizado o error.

Importante:
- Para crear o modificar marcadores online, el usuario Admin debe estar logueado.
- Los marcadores viejos creados antes de v71 pueden quedar solo locales si no tienen ID UUID. Creá marcadores nuevos para probar la conexión real.
- No hace falta crear nuevas tablas si ya ejecutaste el schema APF anterior con partidos y marcadores.
