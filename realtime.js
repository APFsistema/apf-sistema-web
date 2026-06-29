// APF - Tiempo real base
// Objetivo: planillero actualiza marcador y TV/público escuchan cambios.
export function escucharMarcador(partidoId, callback){
  console.log('Escuchando marcador', partidoId);
  // Conectar snapshot/subscription de Firebase o Supabase aquí.
}
export function publicarPunto(partidoId, payload){
  console.log('Publicar punto', partidoId, payload);
  // Actualizar documento/registro del marcador aquí.
}
