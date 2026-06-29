# APF Manager V1

Sistema online inicial para Agrupación Pádel Friense.

## Qué trae esta versión

- Panel principal con resumen.
- Carga de torneos.
- Carga de parejas con fotos por URL.
- Carga de partidos.
- Marcador en vivo con puntos, games y sets.
- Vista pública para fixture, resultados y sponsors.
- Módulo de sponsors.
- Guardado local con `localStorage`.

## Cómo usarlo

1. Abrir `index.html` en el navegador.
2. Tocar **Cargar ejemplo APF** para probar rápido.
3. Cargar torneos, parejas, partidos y sponsors.
4. Ir a **Marcador** y manejar el partido.
5. Ir a **Vista pública** para ver lo que vería la gente.

## Cómo subirlo a GitHub Pages

1. Crear un repositorio nuevo en GitHub.
2. Subir estos archivos en la raíz del repositorio:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. Entrar en Settings > Pages.
4. Elegir Branch `main` y carpeta `/root`.
5. Guardar y abrir el link que genera GitHub.

## Importante

Esta es una V1 de prueba. Los datos se guardan en el navegador de la computadora o celular donde se usa.
Para una versión profesional online con usuarios reales, base de datos y acceso desde varios dispositivos, la siguiente etapa debería usar Firebase o Supabase.
