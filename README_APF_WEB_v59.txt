APF - Plataforma Web v59

Contenido:
- index.html: inicio público / portal APF
- admin.html: panel administrador
- planillero.html: acceso limitado para tablero
- tv.html: marcador en modo TV
- publico.html: marcadores en vivo
- fixture.html: fixture y resultados
- ranking.html: rankings y tablas
- accesos.html: ingreso por roles
- _redirects: rutas para hosting tipo Netlify
- FIREBASE_ESTRUCTURA_APF.json: esquema orientativo de colecciones
- SUPABASE_ESTRUCTURA_APF.sql: esquema orientativo de tablas
- ENV_EJEMPLO.txt: variables que se necesitarían en una web real

Estado:
Esta versión es la base final del prototipo web. Todavía no tiene base de datos real ni login real conectado. Sirve como estructura para pasar a una implementación online real.

Próximo paso técnico:
Elegir backend (Firebase o Supabase), conectar autenticación, base de datos y actualización en tiempo real para marcador, portal público y TV.
