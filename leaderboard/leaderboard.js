// === Poengregler ===
const MAIN_POINTS = [4,3,2,1];  // 4–3–2–1
const BONUS = 0.5;

function zeroObj(players){ return Object.fromEntries(players.map(p => [p,0])); }
function rankByValueDesc(players, obj){
  return [...players].sort((a,b)=>{
    const dv = (obj?.[b]??0) - (obj?.[a]??0);
    if (dv !== 0) return dv;
    return a.localeCompare(b);
  });
}

// --- Dag 1 ---
function computeDay1(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  const played = !!res;
  if (played) {
    (res.ranking||[]).forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
    if (res.closestToPin) bonus[res.closestToPin] += BONUS;
    if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  }
  return { pts, bonus, played };
}

// --- Dag 2 ---
function computeDay2(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  const played = !!res && (res.skins || res.closestToPin || res.longestDrive);
  if (played) {
    const order = rankByValueDesc(players, res.skins||{});
    order.forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
    if (res.closestToPin) bonus[res.closestToPin] += BONUS;
    if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  }
  return { pts, bonus, played };
}

// --- Dag 3 ---
function computeDay3(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players);
  const played = !!res && (res.winnerTeam || res.closestToPin || res.longestDrive);
  if (played) {
    const A = new Set(res.teamA||[]);
    const winnerA = (res.winnerTeam === "A");
    const winnerB = (res.winnerTeam === "B");
    players.forEach(p=>{
      const onA = A.has(p);
      pts[p] += (winnerA && onA) || (winnerB && !onA) ? 4 : 2;
    });
    if (res.closestToPin) bonus[res.closestToPin] += BONUS;
    if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  }
  return { pts, bonus, played };
}

function bonusStars(count){
  // 0.5 -> 1 stjerne, 1.0 -> 2 stjerner
  if (!count) return "";
  const n = Math.round(count / 0.5);
  return "★".repeat(n);
}

function fmtDayCell(points, bonus, played){
  if (!played) return "—";
  const val = (points + bonus).toFixed(1);
  const stars = bonusStars(bonus);
  return stars ? `${val} <span class="bonus">${stars}</span>` : val;
}

function compactRowHTML(code, name, d1, d2, d3, total){
  return `<tr>
    <td class="cb-col-player">
      <div class="player-cell">
        <div class="player-badge">${code}</div>
        <div>${name}</div>
      </div>
    </td>
    <td class="cb-col-d cell-day">${fmtDayCell(d1.pts, d1.bonus, d1.played)}</td>
    <td class="cb-col-d cell-day">${fmtDayCell(d2.pts, d2.bonus, d2.played)}</td>
    <td class="cb-col-d cell-day">${fmtDayCell(d3.pts, d3.bonus, d3.played)}</td>
    <td class="cb-col-total cell-total">${total.toFixed(1)}</td>
  </tr>`;
}

function renderCompactTable(players, names, d1, d2, d3){
  const tbody = document.querySelector('#compactTable tbody');
  tbody.innerHTML = "";

  const totals = {};
  players.forEach(p=>{
    const t1 = d1.played ? d1.pts[p] + d1.bonus[p] : 0;
    const t2 = d2.played ? d2.pts[p] + d2.bonus[p] : 0;
    const t3 = d3.played ? d3.pts[p] + d3.bonus[p] : 0;
    totals[p] = t1 + t2 + t3;
  });

  // Sorter så lederen vises øverst
  const order = [...players].sort((a,b)=> totals[b]-totals[a] || a.localeCompare(b));

  order.forEach((p)=>{
    tbody.insertAdjacentHTML("beforeend",
      compactRowHTML(
        p, names[p],
        {pts:d1.pts[p], bonus:d1.bonus[p], played:d1.played},
        {pts:d2.pts[p], bonus:d2.bonus[p], played:d2.played},
        {pts:d3.pts[p], bonus:d3.bonus[p], played:d3.played},
        totals[p]
      )
    );
  });

  // Marker leder (øverste rad)
  const firstRow = tbody.querySelector('tr');
  if (firstRow) firstRow.classList.add('leader');
}

function runLeaderboard(){
  // Disse kan være udefinert — håndteres i compute-funksjonene
  const d1 = computeDay1(PLAYERS, RESULTS.day1);
  const d2 = computeDay2(PLAYERS, RESULTS.day2);
  const d3 = computeDay3(PLAYERS, RESULTS.day3);
  renderCompactTable(PLAYERS, NAME, d1, d2, d3);
}
