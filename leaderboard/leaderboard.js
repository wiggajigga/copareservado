// === Felles poengregler ===
const MAIN_POINTS = [4,3,2,1];  // 4–3–2–1
const BONUS = 0.5;

function zeroObj(players){ return Object.fromEntries(players.map(p => [p,0])); }
function rankByValueDesc(players, obj){
  return [...players].sort((a,b)=>{
    const dv = (obj[b]??0) - (obj[a]??0);
    if (dv !== 0) return dv;
    return a.localeCompare(b);
  });
}

// --- Dag 1 ---
function computeDay1(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  res.ranking.forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  return { pts, bonus };
}

// --- Dag 2 ---
function computeDay2(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  const order = rankByValueDesc(players, res.skins||{});
  order.forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  return { pts, bonus };
}

// --- Dag 3 ---
function computeDay3(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  const A = new Set(res.teamA||[]);
  const winnerA = (res.winnerTeam === "A");
  const winnerB = (res.winnerTeam === "B");
  players.forEach(p=>{
    const onA = A.has(p);
    pts[p] += (winnerA && onA) || (winnerB && !onA) ? 4 : 2;
  });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  return { pts, bonus };
}

function bonusStars(count){
  // 0.5 -> 1 stjerne, 1.0 -> 2 stjerner
  if (!count) return "";
  const n = Math.round(count / 0.5);
  return "★".repeat(n);
}

function compactRowHTML(code, name, d1p, d1b, d2p, d2b, d3p, d3b, total){
  // Dag-celle: poeng + bonus-stjerner (gull)
  const d1 = (d1p + d1b).toFixed(1);
  const d2 = (d2p + d2b).toFixed(1);
  const d3 = (d3p + d3b).toFixed(1);
  const b1 = bonusStars(d1b);
  const b2 = bonusStars(d2b);
  const b3 = bonusStars(d3b);

  return `<tr>
    <td class="cb-col-player">
      <div class="player-cell">
        <div class="player-badge">${code}</div>
        <div>${name}</div>
      </div>
    </td>
    <td class="cb-col-d cell-day">${d1}${b1?` <span class="bonus">${b1}</span>`:""}</td>
    <td class="cb-col-d cell-day">${d2}${b2?` <span class="bonus">${b2}</span>`:""}</td>
    <td class="cb-col-d cell-day">${d3}${b3?` <span class="bonus">${b3}</span>`:""}</td>
    <td class="cb-col-total cell-total">${total.toFixed(1)}</td>
  </tr>`;
}

function renderCompactTable(players, names, d1, d2, d3){
  const tbody = document.querySelector('#compactTable tbody');
  tbody.innerHTML = "";

  const totals = {};
  players.forEach(p=>{
    const t1 = d1.pts[p] + d1.bonus[p];
    const t2 = d2.pts[p] + d2.bonus[p];
    const t3 = d3.pts[p] + d3.bonus[p];
    totals[p] = t1 + t2 + t3;
  });

  // Sorter etter totals (desc), men vis fast rekkefølge om du ønsker – her sorterer vi.
  const order = [...players].sort((a,b)=> totals[b]-totals[a] || a.localeCompare(b));

  order.forEach((p, idx)=>{
    tbody.insertAdjacentHTML("beforeend",
      compactRowHTML(
        p, names[p],
        d1.pts[p], d1.bonus[p],
        d2.pts[p], d2.bonus[p],
        d3.pts[p], d3.bonus[p],
        totals[p]
      )
    );
  });

  // Marker leder (øverste rad)
  const firstRow = tbody.querySelector('tr');
  if (firstRow) firstRow.classList.add('leader');
}

function runLeaderboard(){
  // Forventer globale PLAYERS, NAME, RESULTS (fra data/ÅÅÅÅ.js)
  const d1 = computeDay1(PLAYERS, RESULTS.day1);
  const d2 = computeDay2(PLAYERS, RESULTS.day2);
  const d3 = computeDay3(PLAYERS, RESULTS.day3);
  renderCompactTable(PLAYERS, NAME, d1, d2, d3);
}
