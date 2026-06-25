APF WEB REAL v81 - Público transparente y marcadores visibles

Objetivo:
- Que el marcador creado en Admin se publique realmente en Supabase.
- Que el link público y los celulares lean marcadores desde Supabase, no solo desde la memoria del navegador de la computadora.

Cambios:
- Agrega publicación online reforzada al crear marcador.
- Agrega botón en Admin: Publicar marcadores en el link público.
- El público actualiza marcadores cada 5 segundos.
- Si no hay marcador publicado, muestra un mensaje claro para la gente.
- Agrega vercel.json para que /publico, /admin, /tv, /fixture y /ranking funcionen sin .html y sin caché vieja.

Prueba recomendada:
1. Subir TODOS los archivos del ZIP a GitHub.
2. Esperar Vercel Ready.
3. Entrar en /admin y crear un marcador de prueba.
4. Tocar “Publicar marcadores en el link público” si hace falta.
5. Abrir /publico desde otro celular con datos móviles.
