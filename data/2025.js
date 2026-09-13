COPA.register({
  aar: 2025, utgave: 5, status: 'ferdig',
  datoer: { fra: null, til: null },   // TODO
  base: null,                         // TODO
  spillere: [
    { kode: 'MA', navn: null, hcp: null },
    { kode: 'TR', navn: null, hcp: null },
    { kode: 'KAS', navn: null, hcp: null },
    { kode: 'FSA', navn: 'Fredrik Sagen Andersen', hcp: null }
  ],
  runder: [
    { dag: 1, dato: null, format: 'Stableford', bane: 'Santa Clara',  tee: null, greenfee: null,
      ranking: ['MA', 'KAS', 'FSA', 'TR'], longestDrive: 'TR', closestToPin: null },
    { dag: 2, dato: null, format: 'Skins',      bane: 'Alferini',     tee: null, greenfee: null,
      skins: null, longestDrive: null, closestToPin: null },        // TODO
    { dag: 3, dato: null, format: 'Lagmatch',   bane: 'Marbella Club', tee: null, greenfee: null,
      lag: null, vinnerlag: null, longestDrive: null, closestToPin: null }  // TODO
  ],
  resultat: null,     // TODO: sluttpoeng
  vinner: 'FSA',
  notat: 'Vinner hentet fra honour board. Dag 2 og 3 ble aldri ført inn i leaderboard/data/2025.js, ' +
         'så sluttpoengene mangler.'
});
