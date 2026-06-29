const STORAGE_KEY = 'apf_scoreboard_v3';
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('apf_scoreboard_channel_v3') : null;

function defaultState() {
  return {
    eventName: 'TORNEO APERTURA APF',
    category: 'SUMA 11 MASCULINO',
    court: 'CANCHA 1',
    matchState: 'EN JUEGO',
    goldenPoint: true,
    serve: 'A',
    logoData: '',
    teamAName: 'PAREJA A',
    teamBName: 'PAREJA B',
    a1: 'Jugador A1',
    a2: 'Jugador A2',
    b1: 'Jugador B1',
    b2: 'Jugador B2',
    a1Photo: '',
    a2Photo: '',
    b1Photo: '',
    b2Photo: '',
    pointsA: 0,
    pointsB: 0,
    gamesA: [0,0,0],
    gamesB: [0,0,0],
    currentSet: 0,
    winner: ''
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch (e) {
    return defaultState();
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (channel) channel.postMessage(state);
}

function resetState() {
  state = defaultState();
  saveState();
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.readAsDataURL(file);
  });
}

function scoreLabel(p, other, goldenPoint = true) {
  if (goldenPoint) {
    if (p <= 0) return '0';
    if (p === 1) return '15';
    if (p === 2) return '30';
    if (p === 3 && other < 3) return '40';
    if (p >= 3 && other >= 3) return 'ORO';
    return '40';
  }

  const map = ['0','15','30','40'];
  if (p <= 3 && other <= 3 && !(p === 3 && other === 3)) return map[p];
  if (p === 3 && other === 3) return '40';
  if (p > other && p >= 4) return 'AD';
  return '40';
}

function currentSetIndex() {
  return Math.min(state.currentSet, 2);
}

function setsWon(side) {
  const my = side === 'A' ? state.gamesA : state.gamesB;
  const opp = side === 'A' ? state.gamesB : state.gamesA;
  let won = 0;
  for (let i=0;i<3;i++) {
    const a = my[i], b = opp[i];
    if ((a >= 6 && a - b >= 2) || (a === 7 && (b === 5 || b === 6))) won++;
  }
  return won;
}

function setWonForCurrentSet() {
  const i = currentSetIndex();
  const a = state.gamesA[i];
  const b = state.gamesB[i];
  if ((a >= 6 && a - b >= 2) || (a === 7 && (b === 5 || b === 6))) return 'A';
  if ((b >= 6 && b - a >= 2) || (b === 7 && (a === 5 || a === 6))) return 'B';
  return '';
}

function advanceGame(side) {
  const i = currentSetIndex();
  if (side === 'A') state.gamesA[i] += 1;
  else state.gamesB[i] += 1;

  state.pointsA = 0;
  state.pointsB = 0;

  const setWinner = setWonForCurrentSet();
  if (setWinner) {
    if (setsWon(setWinner) >= 2) {
      state.winner = setWinner;
      state.matchState = 'FINALIZADO';
    } else if (state.currentSet < 2) {
      state.currentSet += 1;
    }
  }
}

function pointTo(side) {
  if (state.matchState === 'FINALIZADO') return;

  if (state.goldenPoint) {
    if (state.pointsA >= 3 && state.pointsB >= 3) {
      advanceGame(side);
      return;
    }
    if (side === 'A') state.pointsA += 1;
    else state.pointsB += 1;
    if (state.pointsA >= 4 && state.pointsB <= 2) advanceGame('A');
    if (state.pointsB >= 4 && state.pointsA <= 2) advanceGame('B');
  } else {
    if (side === 'A') state.pointsA += 1;
    else state.pointsB += 1;

    if (state.pointsA >= 4 || state.pointsB >= 4) {
      const diff = state.pointsA - state.pointsB;
      if (diff >= 2) advanceGame('A');
      if (diff <= -2) advanceGame('B');
    }
  }
  saveState();
}

function undoPoint(side) {
  if (side === 'A') state.pointsA = Math.max(0, state.pointsA - 1);
  else state.pointsB = Math.max(0, state.pointsB - 1);
  state.winner = '';
  if (state.matchState === 'FINALIZADO') state.matchState = 'EN JUEGO';
  saveState();
}

function addGame(side, delta) {
  const i = currentSetIndex();
  if (side === 'A') state.gamesA[i] = Math.max(0, state.gamesA[i] + delta);
  else state.gamesB[i] = Math.max(0, state.gamesB[i] + delta);
  state.winner = '';
  if (state.matchState === 'FINALIZADO') state.matchState = 'EN JUEGO';
  saveState();
}

function resetPoints() {
  state.pointsA = 0;
  state.pointsB = 0;
  saveState();
}

function swapSides() {
  const keys = [
    ['teamAName','teamBName'],['a1','b1'],['a2','b2'],['a1Photo','b1Photo'],['a2Photo','b2Photo']
  ];
  keys.forEach(([k1,k2]) => {
    const tmp = state[k1];
    state[k1] = state[k2];
    state[k2] = tmp;
  });
  const ga = state.gamesA; state.gamesA = state.gamesB; state.gamesB = ga;
  const pa = state.pointsA; state.pointsA = state.pointsB; state.pointsB = pa;
  if (state.serve === 'A') state.serve = 'B'; else if (state.serve === 'B') state.serve = 'A';
  if (state.winner === 'A') state.winner = 'B'; else if (state.winner === 'B') state.winner = 'A';
  saveState();
}

function saveSetupFromForm() {
  const ids = ['eventName','category','court','matchState','teamAName','teamBName','a1','a2','b1','b2'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) state[id] = (el.value || '').toUpperCase();
  });
  const golden = document.getElementById('goldenPoint');
  if (golden) state.goldenPoint = golden.checked;
  saveState();
}

async function saveFilesFromForm() {
  const map = [
    ['logoFile','logoData'],['a1Photo','a1Photo'],['a2Photo','a2Photo'],['b1Photo','b1Photo'],['b2Photo','b2Photo']
  ];
  for (const [inputId, stateKey] of map) {
    const input = document.getElementById(inputId);
    if (input && input.files && input.files[0]) {
      state[stateKey] = await readFileAsDataURL(input.files[0]);
    }
  }
  saveState();
}

function renderScoreboard(target) {
  const sA = setsWon('A');
  const sB = setsWon('B');
  const pointA = scoreLabel(state.pointsA, state.pointsB, state.goldenPoint);
  const pointB = scoreLabel(state.pointsB, state.pointsA, state.goldenPoint);

  const card = `
    <section class="scoreboard-screen">
      <header class="screen-top">
        <div class="brand-wrap">
          <div class="logo-holder">${state.logoData ? `<img src="${state.logoData}" alt="Logo APF" />` : `<div class="logo-fallback">APF</div>`}</div>
          <div class="brand-meta">
            <div class="small">${escapeHtml(state.category)} · ${escapeHtml(state.court)}</div>
            <div class="title">${escapeHtml(state.eventName)}</div>
          </div>
        </div>
        <div class="match-badges">
          <div class="match-badge">Estado: ${escapeHtml(state.matchState)}</div>
          ${state.goldenPoint ? `<div class="match-badge">Punto de oro</div>` : ``}
        </div>
      </header>

      <div class="screen-main">
        ${teamMarkup('A', state.teamAName, state.a1, state.a2, state.a1Photo, state.a2Photo, pointA, state.serve === 'A')}

        <div class="center-board">
          <div>
            <div class="sets-label">Sets</div>
            <div class="sets-total">${sA} - ${sB}</div>
          </div>
          <div class="versus">VS</div>
          <table class="mini-table">
            <thead>
              <tr><th></th><th>S1</th><th>S2</th><th>S3</th></tr>
            </thead>
            <tbody>
              <tr><td class="row-head">A</td><td>${state.gamesA[0]}</td><td>${state.gamesA[1]}</td><td>${state.gamesA[2]}</td></tr>
              <tr><td class="row-head">B</td><td>${state.gamesB[0]}</td><td>${state.gamesB[1]}</td><td>${state.gamesB[2]}</td></tr>
            </tbody>
          </table>
          <div class="center-footer">
            <div class="status-pill ${state.matchState === 'FINALIZADO' ? 'finish' : ''}">${escapeHtml(state.matchState)}</div>
            ${state.goldenPoint ? `<div class="golden-pill">Si llegan a 40-40, se juega punto de oro</div>` : ``}
          </div>
        </div>

        ${teamMarkup('B', state.teamBName, state.b1, state.b2, state.b1Photo, state.b2Photo, pointB, state.serve === 'B')}
      </div>

      <footer class="bottom-bar">
        <div class="bottom-chip">Saque: ${state.serve === 'A' ? escapeHtml(state.teamAName) : escapeHtml(state.teamBName)}</div>
        ${state.winner ? `<div class="bottom-chip">Ganador: ${state.winner === 'A' ? escapeHtml(state.teamAName) : escapeHtml(state.teamBName)}</div>` : `<div class="bottom-chip">Marcador APF en vivo</div>`}
      </footer>
    </section>
  `;
  target.innerHTML = card;
}

function teamMarkup(side, teamName, p1, p2, photo1, photo2, point, serving) {
  return `
    <article class="team-card ${serving ? 'serving' : ''}">
      <div class="team-header">
        <div class="team-name">${escapeHtml(teamName)}</div>
        <div class="serve-indicator">Saque</div>
      </div>
      <div class="players-row">
        ${playerMarkup(p1, photo1)}
        ${playerMarkup(p2, photo2)}
      </div>
      <div class="score-box">
        <div class="point-value">${point}</div>
      </div>
    </article>
  `;
}

function playerMarkup(name, photo) {
  const initials = getInitials(name || 'J');
  return `
    <div class="player-box">
      <div class="player-photo">${photo ? `<img src="${photo}" alt="${escapeHtml(name)}" />` : `<div class="player-fallback">${initials}</div>`}</div>
      <div class="player-name">${escapeHtml(name)}</div>
    </div>
  `;
}

function getInitials(name) {
  return (name || 'J').split(' ').filter(Boolean).slice(0,2).map(v => v[0]).join('').toUpperCase();
}

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

function syncFormFromState() {
  const ids = ['eventName','category','court','matchState','teamAName','teamBName','a1','a2','b1','b2'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = state[id] || '';
  });
  const golden = document.getElementById('goldenPoint');
  if (golden) golden.checked = !!state.goldenPoint;
  const status = document.getElementById('summaryStatus');
  if (status) status.textContent = `${state.teamAName} ${displayPoints('A')} · ${displayPoints('B')} ${state.teamBName}`;
}

function displayPoints(side) {
  return side === 'A' ? scoreLabel(state.pointsA, state.pointsB, state.goldenPoint) : scoreLabel(state.pointsB, state.pointsA, state.goldenPoint);
}

function connectSync(onUpdate) {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = loadState();
      onUpdate();
    }
  });
  if (channel) {
    channel.onmessage = (ev) => {
      state = { ...defaultState(), ...ev.data };
      onUpdate();
    };
  }
}

function bindOperatorEvents() {
  document.getElementById('saveSetup')?.addEventListener('click', async () => {
    saveSetupFromForm();
    await saveFilesFromForm();
    refreshOperator();
  });
  document.getElementById('resetAll')?.addEventListener('click', () => {
    if (confirm('¿Reiniciar todo el marcador?')) {
      resetState();
      refreshOperator();
    }
  });
  document.getElementById('resetPoints')?.addEventListener('click', () => {
    resetPoints();
    refreshOperator();
  });
  document.getElementById('swapSides')?.addEventListener('click', () => {
    swapSides();
    refreshOperator();
  });
  document.getElementById('finishMatch')?.addEventListener('click', () => {
    state.matchState = 'FINALIZADO';
    const sa = setsWon('A');
    const sb = setsWon('B');
    state.winner = sa > sb ? 'A' : sb > sa ? 'B' : state.winner;
    saveState();
    refreshOperator();
  });
  document.getElementById('fullscreenPublic')?.addEventListener('click', () => window.open('publico.html', '_blank'));

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'pointA') pointTo('A');
      if (action === 'pointB') pointTo('B');
      if (action === 'undoA') undoPoint('A');
      if (action === 'undoB') undoPoint('B');
      if (action === 'gamePlusA') addGame('A', 1);
      if (action === 'gamePlusB') addGame('B', 1);
      if (action === 'gameMinusA') addGame('A', -1);
      if (action === 'gameMinusB') addGame('B', -1);
      if (action === 'serveA') { state.serve = 'A'; saveState(); }
      if (action === 'serveB') { state.serve = 'B'; saveState(); }
      refreshOperator();
    });
  });

  ['eventName','category','court','matchState','teamAName','teamBName','a1','a2','b1','b2','goldenPoint'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
      saveSetupFromForm();
      refreshOperator();
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    if (key === 'q') pointTo('A');
    if (key === 'p') pointTo('B');
    if (key === 'a') undoPoint('A');
    if (key === 'l') undoPoint('B');
    if (key === 's') { state.serve = 'A'; saveState(); }
    if (key === 'k') { state.serve = 'B'; saveState(); }
    if (key === '1') addGame('A', 1);
    if (key === '2') addGame('B', 1);
    if (key === '7') addGame('A', -1);
    if (key === '8') addGame('B', -1);
    refreshOperator();
  });
}

function refreshOperator() {
  syncFormFromState();
  const preview = document.getElementById('publicPreview');
  if (preview) renderScoreboard(preview);
}

function initOperator() {
  refreshOperator();
  bindOperatorEvents();
  connectSync(refreshOperator);
}

function initPublic() {
  const stage = document.getElementById('publicStage');
  const render = () => renderScoreboard(stage);
  render();
  connectSync(render);
}

window.initOperator = initOperator;
window.initPublic = initPublic;
