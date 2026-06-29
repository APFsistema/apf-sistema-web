// APF - Autenticación base
// Roles previstos: admin, planillero, publico.
export function canEdit(role){ return role === 'admin'; }
export function canScore(role){ return role === 'admin' || role === 'planillero'; }
export function canView(role){ return ['admin','planillero','publico'].includes(role); }
export function nextRouteForRole(role){
  if(role === 'admin') return '/admin';
  if(role === 'planillero') return '/planillero';
  return '/';
}
