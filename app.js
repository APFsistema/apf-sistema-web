const DEFAULT_PHOTO = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%231f2937"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="52" fill="%2300e5ff" font-family="Arial">APF</text></svg>';
const pointSteps = ['0','15','30','40','ORO'];
let state = loadState();
let liveMatchId = state.liveMatchId || null;
let serve = 'A';

function loadState(){
  const saved = localStorage.getItem('apfManagerV1');
  if(saved) return JSON.parse(saved);
  return { tournaments:[], pairs:[], matches:[], sponsors:[], liveMatchId:null };
}
function saveState(){
  state.liveMatchId = liveMatchId;
  localStorage.setItem('apfManagerV1', JSON.stringify(state));
  renderAll();
}
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function $(id){ return document.getElementById(id); }

function goView(viewId){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  $(viewId).classList.add('active');
  document.querySelector(`.tab[data-view="${viewId}"]`)?.classList.add('active');
  renderAll();
}
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>goView(btn.dataset.view)));

$('tournamentForm').addEventListener('submit', e=>{
  e.preventDefault();
  state.tournaments.push({ id:uid(), name:$('tName').value, category:$('tCategory').value, format:$('tFormat').value, date:$('tDate').value, prize:$('tPrize').value });
  e.target.reset(); saveState();
});
$('pairForm').addEventListener('submit', e=>{
  e.preventDefault();
  state.pairs.push({ id:uid(), p1:$('p1').value, p2:$('p2').value, category:$('pairCategory').value, photo1:$('photo1').value || DEFAULT_PHOTO, photo2:$('photo2').value || DEFAULT_PHOTO });
  e.target.reset(); saveState();
});
$('matchForm').addEventListener('submit', e=>{
  e.preventDefault();
  const match = { id:uid(), tournamentId:$('matchTournament').value, pairA:$('matchA').value, pairB:$('matchB').value, date:$('matchDate').value, time:$('matchTime').value, court:$('matchCourt').value || 'Cancha', status:'Pendiente', score:initScore() };
  state.matches.push(match); liveMatchId = match.id; e.target.reset(); saveState();
});
$('sponsorForm').addEventListener('submit', e=>{
  e.preventDefault();
  state.sponsors.push({ id:uid(), name:$('sName').value, logo:$('sLogo').value, instagram:$('sInstagram').value, plan:$('sPlan').value });
  e.target.reset(); saveState();
});
function initScore(){ return { A:{points:0,games:0,sets:0}, B:{points:0,games:0,sets:0}, history:[] }; }
function pairName(pair){ return pair ? `${pair.p1} / ${pair.p2}` : 'Pareja eliminada'; }
function getPair(id){ return state.pairs.find(p=>p.id===id); }
function getTournament(id){ return state.tournaments.find(t=>t.id===id); }
function getLiveMatch(){ return state.matches.find(m=>m.id===liveMatchId) || state.matches[0]; }
function snapshot(match){ match.score.history.push(JSON.stringify({score:{A:{...match.score.A},B:{...match.score.B}},status:match.status,serve})); if(match.score.history.length>30) match.score.history.shift(); }

function renderAll(){
  renderStats(); renderTournaments(); renderPairs(); renderSelects(); renderMatches(); renderSponsors(); renderScoreboard(); renderPublic();
}
function renderStats(){
  $('statTorneos').textContent = state.tournaments.length;
  $('statParejas').textContent = state.pairs.length;
  $('statPartidos').textContent = state.matches.length;
  $('statSponsors').textContent = state.sponsors.length;
  const upcoming = state.matches.slice(-5).reverse();
  $('dashboardMatches').innerHTML = upcoming.length ? upcoming.map(matchItemHtml).join('') : '<p class="muted">Todavía no hay partidos cargados.</p>';
}
function renderTournaments(){
  $('tournamentList').innerHTML = state.tournaments.map(t=>`<article class="mini-card"><span class="chip">${t.category}</span><h4>${t.name}</h4><p>Formato: ${t.format}</p><p>Fecha: ${t.date || 'Sin fecha'}</p><p>Premio: ${t.prize || 'A definir'}</p><button onclick="deleteTournament('${t.id}')">Eliminar</button></article>`).join('') || empty('No hay torneos cargados.');
}
function renderPairs(){
  $('pairList').innerHTML = state.pairs.map(p=>`<article class="mini-card"><div class="photos"><img src="${p.photo1}"/><img src="${p.photo2}"/></div><h4>${pairName(p)}</h4><p>Categoría: ${p.category || 'Sin categoría'}</p><button onclick="deletePair('${p.id}')">Eliminar</button></article>`).join('') || empty('No hay parejas cargadas.');
}
function renderSelects(){
  $('matchTournament').innerHTML = state.tournaments.map(t=>`<option value="${t.id}">${t.name} · ${t.category}</option>`).join('');
  ['matchA','matchB'].forEach(id=> $(id).innerHTML = state.pairs.map(p=>`<option value="${p.id}">${pairName(p)}</option>`).join(''));
  $('liveMatchSelect').innerHTML = state.matches.map(m=>`<option value="${m.id}" ${m.id===liveMatchId?'selected':''}>${pairName(getPair(m.pairA))} vs ${pairName(getPair(m.pairB))}</option>`).join('');
}
function renderMatches(){
  $('matchList').innerHTML = state.matches.map(m=>`<article class="mini-card"><span class="chip">${getTournament(m.tournamentId)?.category || 'Sin torneo'}</span><h4>${pairName(getPair(m.pairA))}</h4><p>vs</p><h4>${pairName(getPair(m.pairB))}</h4><p>${m.date || 'Sin fecha'} ${m.time || ''} · ${m.court || ''}</p><p>Estado: <b class="${m.status==='Finalizado'?'finished':''}">${m.status}</b></p><p>Resultado: ${m.score.A.sets}-${m.score.B.sets} sets · ${m.score.A.games}-${m.score.B.games} games</p><button onclick="setLive('${m.id}')">Abrir en marcador</button> <button onclick="deleteMatch('${m.id}')">Eliminar</button></article>`).join('') || empty('No hay partidos creados.');
}
function renderSponsors(){
  $('sponsorList').innerHTML = state.sponsors.map(s=>`<article class="mini-card"><h4>${s.name}</h4>${s.logo?`<img src="${s.logo}" style="max-width:100%;height:90px;object-fit:contain;background:white;border-radius:12px;padding:8px">`:''}<p>Plan: ${s.plan}</p><p>${s.instagram || ''}</p><button onclick="deleteSponsor('${s.id}')">Eliminar</button></article>`).join('') || empty('No hay sponsors cargados.');
}
function renderScoreboard(){
  const match = getLiveMatch();
  if(!match){
    ['aName','bName'].forEach(id=>$(id).textContent='Cargá un partido');
    return;
  }
  liveMatchId = match.id;
  const a = getPair(match.pairA), b = getPair(match.pairB), t = getTournament(match.tournamentId);
  $('scoreTournament').textContent = t ? `${t.name} · ${t.category}` : 'APF Manager';
  $('scoreCourt').textContent = `${match.court || 'Cancha'} · ${match.status}`;
  $('aName').textContent = pairName(a); $('bName').textContent = pairName(b);
  $('aPhoto1').src = a?.photo1 || DEFAULT_PHOTO; $('aPhoto2').src = a?.photo2 || DEFAULT_PHOTO;
  $('bPhoto1').src = b?.photo1 || DEFAULT_PHOTO; $('bPhoto2').src = b?.photo2 || DEFAULT_PHOTO;
  $('aPoints').textContent = pointSteps[match.score.A.points] || 'GAME'; $('bPoints').textContent = pointSteps[match.score.B.points] || 'GAME';
  $('aGames').textContent = match.score.A.games; $('bGames').textContent = match.score.B.games;
  $('aSets').textContent = match.score.A.sets; $('bSets').textContent = match.score.B.sets;
  $('teamABox').classList.toggle('serving', serve==='A'); $('teamBBox').classList.toggle('serving', serve==='B');
  $('liveSponsors').innerHTML = state.sponsors.slice(0,8).map(s=>`<span class="sponsor-badge">${s.name}</span>`).join('');
}
function renderPublic(){
  $('publicMatches').innerHTML = state.matches.map(matchItemHtml).join('') || empty('Todavía no hay fixture público.');
  $('publicSponsors').innerHTML = state.sponsors.map(s=>`<div class="sponsor-card">${s.logo?`<img src="${s.logo}">`:''}<b>${s.name}</b><p>${s.plan}</p></div>`).join('') || empty('Sin sponsors cargados.');
}
function matchItemHtml(m){
  return `<div class="list-item"><div><b>${pairName(getPair(m.pairA))}</b><br><span>vs ${pairName(getPair(m.pairB))}</span><br><small>${m.date || 'Sin fecha'} ${m.time || ''} · ${m.court || ''}</small></div><div><span class="chip">${m.status}</span><br><b>${m.score.A.sets}-${m.score.B.sets}</b></div></div>`;
}
function empty(text){ return `<p style="color:#9ca3af">${text}</p>`; }

function selectLiveMatch(){ liveMatchId = $('liveMatchSelect').value; saveState(); }
function setLive(id){ liveMatchId=id; goView('marcador'); saveState(); }
function addPoint(team){ const m=getLiveMatch(); if(!m)return; snapshot(m); m.status='En juego'; m.score[team].points++; if(m.score[team].points>=5){ newGame(team,false); return; } saveState(); }
function removePoint(team){ const m=getLiveMatch(); if(!m)return; snapshot(m); m.score[team].points=Math.max(0,m.score[team].points-1); saveState(); }
function newGame(team, takeSnap=true){ const m=getLiveMatch(); if(!m)return; if(takeSnap) snapshot(m); m.status='En juego'; m.score[team].games++; m.score.A.points=0; m.score.B.points=0; serve = serve==='A'?'B':'A'; if(m.score[team].games>=6 && Math.abs(m.score.A.games-m.score.B.games)>=2) newSet(team,false); else saveState(); }
function newSet(team, takeSnap=true){ const m=getLiveMatch(); if(!m)return; if(takeSnap) snapshot(m); m.score[team].sets++; m.score.A.games=0; m.score.B.games=0; m.score.A.points=0; m.score.B.points=0; saveState(); }
function toggleServe(){ serve = serve==='A'?'B':'A'; saveState(); }
function finishMatch(){ const m=getLiveMatch(); if(!m)return; snapshot(m); m.status='Finalizado'; saveState(); }
function resetScore(){ const m=getLiveMatch(); if(!m)return; snapshot(m); m.score=initScore(); m.status='Pendiente'; saveState(); }

function deleteTournament(id){ state.tournaments = state.tournaments.filter(x=>x.id!==id); saveState(); }
function deletePair(id){ state.pairs = state.pairs.filter(x=>x.id!==id); saveState(); }
function deleteMatch(id){ state.matches = state.matches.filter(x=>x.id!==id); if(liveMatchId===id) liveMatchId = state.matches[0]?.id || null; saveState(); }
function deleteSponsor(id){ state.sponsors = state.sponsors.filter(x=>x.id!==id); saveState(); }

function seedDemo(){
  const t = {id:uid(), name:'Torneo Apertura APF', category:'Suma 11 Masculino', format:'Zonas + Playoffs', date:'2026-07-02', prize:'$400.000'};
  const t2 = {id:uid(), name:'Torneo Apertura APF', category:'Suma 15 Femenino', format:'Zonas + Playoffs', date:'2026-07-02', prize:'$400.000'};
  const pairs = [
    {id:uid(),p1:'Sebastián Peñaflor',p2:'Jeremías Ávila',category:'Suma 11',photo1:DEFAULT_PHOTO,photo2:DEFAULT_PHOTO},
    {id:uid(),p1:'Maximiliano Paz',p2:'Esteban Sabagh',category:'Suma 11',photo1:DEFAULT_PHOTO,photo2:DEFAULT_PHOTO},
    {id:uid(),p1:'Lorena Picco',p2:'Emiliano Manzanelli',category:'Suma 15',photo1:DEFAULT_PHOTO,photo2:DEFAULT_PHOTO},
    {id:uid(),p1:'Jose Vergara',p2:'Gastón Llapur',category:'Suma 11',photo1:DEFAULT_PHOTO,photo2:DEFAULT_PHOTO}
  ];
  const m1 = {id:uid(), tournamentId:t.id, pairA:pairs[0].id, pairB:pairs[1].id, date:'2026-07-02', time:'20:00', court:'Cancha 1', status:'Pendiente', score:initScore()};
  const m2 = {id:uid(), tournamentId:t2.id, pairA:pairs[2].id, pairB:pairs[3].id, date:'2026-07-02', time:'21:00', court:'Cancha 2', status:'Pendiente', score:initScore()};
  state.tournaments=[t,t2]; state.pairs=pairs; state.matches=[m1,m2]; liveMatchId=m1.id;
  state.sponsors=[{id:uid(),name:'Sponsor Principal',logo:'',instagram:'@sponsor',plan:'Principal'},{id:uid(),name:'Kiosco Roma',logo:'',instagram:'',plan:'Marcador'},{id:uid(),name:'Buenas Migas',logo:'',instagram:'',plan:'Fixture'}];
  saveState();
}

renderAll();
