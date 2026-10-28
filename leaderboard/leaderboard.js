/**
 * Copa Reservado – leaderboard
 *
 * Leser årets data fra COPA-registeret (data/copa.js + data/<år>.js) og
 * rendrer OVERALL-tabellen. Ingen egen datakopi.
 *
 *   <script src="/data/copa.js"></script>
 *   <script src="/data/2025.js"></script>
 *   <script src="../leaderboard.js"></script>
 *   <script> runLeaderboard(2025); </script>
 *
 * Poeng per runde hentes slik, i prioritert rekkefølge:
 *   1. runde.poeng         – eksplisitt { KAS: 3.5, ... }, inkl. bonus
 *   2. runde.ranking       – ['MA', ['TR','FSA'], 'KAS']; delt plass deler poengene likt
 *   3. runde.lag/vinnerlag – { A: [...], B: [...] } + 'A' | 'B'
 * Bonus (longestDrive / closestToPin) er en kode, en liste av koder, eller null.
 */

var LB = {
  plassPoeng: [4, 3, 2, 1],
  bonus: 0.5,
  lag: { vinner: 3.5, taper: 1.5 },   // vinnerlaget deler 4+3, taperlaget deler 2+1
  ukedag: { 1: 'Torsdag', 2: 'Fredag', 3: 'Lørdag' }
};

function lbKoder(verdi) {
  if (!verdi) return [];
  return Array.isArray(verdi) ? verdi : [verdi];
}

function lbTom(koder) {
  var o = {};
  koder.forEach(function (k) { o[k] = 0; });
  return o;
}

/** Bonuspoeng per spiller for en runde. */
function lbBonus(koder, runde) {
  var b = lbTom(koder);
  lbKoder(runde.longestDrive).concat(lbKoder(runde.closestToPin)).forEach(function (k) {
    if (k in b) b[k] += LB.bonus;
  });
  return b;
}

/** Hovedpoeng per spiller for en runde, uten bonus. */
function lbHoved(koder, runde) {
  var p = lbTom(koder);
  var i;

  if (runde.ranking) {
    var plass = 0;
    runde.ranking.forEach(function (gruppe) {
      var g = lbKoder(gruppe);
      var sum = 0;
      for (i = 0; i < g.length; i++) sum += LB.plassPoeng[plass + i] || 0;
      g.forEach(function (k) { if (k in p) p[k] = sum / g.length; });
      plass += g.length;
    });
    return p;
  }

  if (runde.lag && runde.vinnerlag) {
    Object.keys(runde.lag).forEach(function (navn) {
      var verdi = navn === runde.vinnerlag ? LB.lag.vinner : LB.lag.taper;
      runde.lag[navn].forEach(function (k) { if (k in p) p[k] = verdi; });
    });
    return p;
  }

  return p;
}

/** { spilt, hoved, bonus, total } per runde. */
function lbRunde(koder, runde) {
  var bonus = lbBonus(koder, runde);
  var hoved, total = {};
  var spilt = !!(runde.poeng || runde.ranking || runde.vinnerlag);

  if (runde.poeng) {
    hoved = lbTom(koder);
    koder.forEach(function (k) {
      var sum = runde.poeng[k] || 0;
      total[k] = sum;
      hoved[k] = sum - bonus[k];
    });
  } else {
    hoved = lbHoved(koder, runde);
    koder.forEach(function (k) { total[k] = hoved[k] + bonus[k]; });
  }

  return { spilt: spilt, hoved: hoved, bonus: bonus, total: total };
}

function lbTall(n) {
  return n.toFixed(1).replace('.', ',');
}

function lbStjerner(bonus) {
  var n = Math.round(bonus / LB.bonus);
  return n > 0 ? '<span class="bonus">' + new Array(n + 1).join('★') + '</span>' : '';
}

function lbEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

function lbKolonne(runde) {
  var bane = runde.bane ? String(runde.bane).replace(/\s*\(.*$/, '') : null;   // kort navn i kolonnen
  var linje2 = [runde.format, bane].filter(Boolean).map(lbEsc).join('<br>');
  return '<th class="cb-col-d"><span class="dag">Dag ' + runde.dag + '</span>' +
         (linje2 ? '<span class="dag-info">' + linje2 + '</span>' : '') + '</th>';
}

function lbRegler(t) {
  var deler = [];
  deler.push('<p><b>Regler:</b> <b>4–3–2–1</b> poeng per dag etter plassering, delt plass deler poengene likt. ' +
             'Lagspill: vinnerlaget <b>' + lbTall(LB.lag.vinner) + '</b> pr. spiller, taperlaget <b>' + lbTall(LB.lag.taper) + '</b>. ' +
             '<span class="pill">Longest Drive</span> og <span class="pill">Closest to Pin</span> gir <b>+0,5</b> hver (vises som ★).</p>');
  var runder = (t.runder || []).map(function (r) {
    var s = '<b>Dag ' + r.dag;
    if (r.dato) s += ' · ' + LB.ukedag[r.dag];
    s += ':</b> ' + lbEsc([r.format, r.bane].filter(Boolean).join(' på '));
    if (r.beskrivelse) s += ', ' + lbEsc(r.beskrivelse);
    return s;
  });
  if (runder.length) deler.push('<p>' + runder.join('. ') + '.</p>');
  if (t.regler && t.regler.notat) deler.push('<p class="note">' + lbEsc(t.regler.notat) + '</p>');
  return deler.join('');
}

function runLeaderboard(aar) {
  var t = window.COPA && COPA.get(aar);
  if (!t) {
    document.querySelector('#compactTable tbody').innerHTML =
      '<tr><td colspan="5">Ingen data for ' + aar + '</td></tr>';
    return;
  }

  var koder = t.spillere.map(function (s) { return s.kode; });
  var navn = {};
  t.spillere.forEach(function (s) { navn[s.kode] = s.navn || s.kode; });
  var runder = (t.runder || []).map(function (r) { return lbRunde(koder, r); });

  var sum = lbTom(koder);
  runder.forEach(function (r) { koder.forEach(function (k) { sum[k] += r.total[k]; }); });

  var orden = koder.slice().sort(function (a, b) { return sum[b] - sum[a] || a.localeCompare(b); });
  var noeSpilt = runder.some(function (r) { return r.spilt; });

  var thead = document.querySelector('#compactTable thead tr');
  thead.innerHTML = '<th class="cb-col-player">Player</th>' +
    t.runder.map(lbKolonne).join('') +
    '<th class="cb-col-total">Total</th>';

  var tbody = document.querySelector('#compactTable tbody');
  tbody.innerHTML = orden.map(function (k, i) {
    var leder = noeSpilt && sum[k] === sum[orden[0]];
    var celler = runder.map(function (r) {
      if (!r.spilt) return '<td class="cb-col-d cell-day">—</td>';
      return '<td class="cb-col-d cell-day">' + lbTall(r.total[k]) + lbStjerner(r.bonus[k]) + '</td>';
    }).join('');
    return '<tr class="' + (leder ? 'leader' : '') + '">' +
      '<td class="cb-col-player"><div class="player-cell">' +
        '<div class="player-badge">' + lbEsc(k) + '</div>' +
        '<div class="player-name">' + lbEsc(navn[k]) + '</div>' +
        '<div class="player-code">' + lbEsc(k) + '</div></div></td>' +
      celler +
      '<td class="cb-col-total cell-total">' + lbTall(sum[k]) + '</td></tr>';
  }).join('');

  var sub = document.querySelector('.sub');
  if (sub) {
    if (t.status === 'ferdig' && t.vinner) {
      sub.innerHTML = 'El campeón ' + aar + ' <b>' + lbEsc(navn[t.vinner]) + '</b>';
    } else if (!noeSpilt) {
      sub.textContent = koder.join(' · ') + ' · ikke spilt ennå';
    } else {
      sub.textContent = koder.join(' · ');
    }
  }

  var regler = document.querySelector('.rules');
  if (regler) regler.innerHTML = lbRegler(t);
}
