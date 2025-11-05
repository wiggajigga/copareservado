// Felles render + poengregler. Forventer at det finnes en global RESULTS med day1/day2/day3 + PLAYERS/NAME.
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

function computeDay1(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players), notes = {};
  res.ranking.forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  players.forEach(p=>{
    const s = res.stableford?.[p];
    notes[p] = (s!=null) ? `Stableford: ${s}` : "";
  });
  return { pts, bonus, notes };
}

function computeDay2(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players), notes = {};
  const order = rankByValueDesc(players, res.skins||{});
  order.forEach((p,idx)=>{ pts[p] += MAIN_POINTS[idx] || 0; });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  players.forEach(p=>{
    const s = res.skins?.[p] ?? 0;
    notes[p] = `Skins: ${s}`;
  });
  return { pts, bonus, notes };
}

function computeDay3(players, res){
  const pts = zeroObj(players), bonus = zeroObj(players), notes = {};
  const A = new Set(res.teamA||[]);
  const winnerA = (res.winnerTeam === "A");
  const winnerB = (res.winnerTeam === "B");
  players.forEach(p=>{
    const onA = A.has(p);
    pts[p] += (winnerA && onA) || (winnerB && !onA) ? 4 : 2; // 4 for vinnere, 2 for tapere
    notes[p] = onA ? "Lag: A" : "Lag: B";
  });
  if (res.closestToPin) bonus[res.closestToPin] += BONUS;
  if (res.longestDrive) bonus[res.longestDrive] += BONUS;
  return { pts, bonus, notes };
}

function rowHTML(name, note, bonus, pts){
  const b = (bonus||0); const p = (pts||0);
  const bonusStr = b ? `+${b.toFixed(1)}` : "";
  return `<tr>
    <td class="col-player">${name}</td>
    <td class="col-note">${note||""}</td>
    <td class="col-bonus">${bonusStr}</td>
    <td class="col-pts">${(p + b).toFixed(1)}</td>
  </tr>`;
}

function renderDay(tableId, players, names, resObj){
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  players.forEach(p=>{
    tbody.insertAdjacentHTML("beforeend", rowHTML(names[p], resObj.notes[p], resObj.bonus[p], resObj.pts[p]));
  });
}

function renderOverall(tableId, players, names, d1,d2,d3){
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  players.forEach(p=>{
    const day1 = d1.pts[p] + d1.bonus[p];
    const day2 = d2.pts[p] + d2.bonus[p];
    const day3 = d3.pts[p] + d3.bonus[p];
    const bonusTot = (d1.bonus[p] + d2.bonus[p] + d3.bonus[p]).toFixed(1);
    const sum = (day1 + day2 + day3).toFixed(1);
    const note = `${day1.toFixed(1)} / ${day2.toFixed(1)} / ${day3.toFixed(1)}`;
    tbody.insertAdjacentHTML("beforeend",
      `<tr>
        <td class="col-player">${names[p]}</td>
        <td class="col-note">${note}</td>
        <td class="col-bonus">+${bonusTot}</td>
        <td class="col-pts">${sum}</td>
      </tr>`
    );
  });
}

// Kjør side (forventer global RESULTS, PLAYERS, NAME)
function runLeaderboard(){
  const d1 = computeDay1(PLAYERS, RESULTS.day1);
  const d2 = computeDay2(PLAYERS, RESULTS.day2);
  const d3 = computeDay3(PLAYERS, RESULTS.day3);
  renderDay("day1Table", PLAYERS, NAME, d1);
  renderDay("day2Table", PLAYERS, NAME, d2);
  renderDay("day3Table", PLAYERS, NAME, d3);
  renderOverall("overallTable", PLAYERS, NAME, d1,d2,d3);
}
