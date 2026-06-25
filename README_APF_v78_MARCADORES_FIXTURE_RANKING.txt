APF WEB REAL v78 - Marcadores, Fixture y Ranking conectados

Cambios:
- Crear marcador ya no depende de fotos y aparece inmediatamente en Marcadores en vivo.
- Cada marcador creado genera/actualiza un registro en Fixture / Resultados.
- Al finalizar un partido, el resultado pasa al fixture y queda publicado.
- Se mantiene la sincronización con Supabase cuando está disponible.
- Se refuerza el ranking automático usando partidos finalizados cuando hay jugadores cargados.
- Se mantienen los textos públicos corregidos de v77.

Prueba recomendada:
1. Subir a GitHub y esperar Vercel Ready.
2. Entrar a /admin.
3. Crear marcador sin fotos.
4. Revisar /publico, Marcadores en vivo y /tv.
5. Finalizar el partido y revisar Fixture / Resultados y Ranking.
