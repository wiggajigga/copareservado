COPA.register({
  aar: 2025, utgave: 5, status: 'ferdig',
  datoer: { fra: '2025-11-06', til: null },   // start fra nedtellingen på forsiden; hjemreise ikke registrert
  base: 'Elviria, Marbella (egen leilighet)',
  spillere: [
    { kode: 'MA',  navn: null, hcp: 33 },
    { kode: 'TR',  navn: null, hcp: 19 },
    { kode: 'KAS', navn: null, hcp: 17.5 },
    { kode: 'FSA', navn: 'Fredrik Sagen Andersen', hcp: 21 }
  ],

  // Poeng: 4–3–2–1 per dag etter plassering, delt plass deles likt
  // (lagmatch: vinnerlag deler 4+3, taperlag deler 2+1).
  // Én longest drive og én closest to pin per dag, +0,5 hver. Ingen closest to pin ble vunnet i 2025.
  runder: [
    { dag: 1, dato: '2025-11-06', format: 'Stableford', bane: 'Santa Clara', tee: null, greenfee: null,
      ranking: ['MA', 'KAS', 'FSA', 'TR'],
      longestDrive: 'TR', closestToPin: null,
      poeng: { MA: 4, KAS: 3, FSA: 2, TR: 1.5 } },

    { dag: 2, dato: '2025-11-07', format: 'Skins', bane: 'Alferini (Villa Padierna)', tee: null, greenfee: null,
      // Individuelle skins. TR og FSA delte seieren.
      ranking: [['TR', 'FSA'], 'MA', 'KAS'],
      skins: null,                                   // antall skins per spiller ikke registrert
      longestDrive: 'TR', closestToPin: null,
      poeng: { TR: 4, FSA: 3.5, MA: 2, KAS: 1 } },

    { dag: 3, dato: '2025-11-08', format: 'Lagmatch', bane: 'Marbella Club', tee: null, greenfee: null,
      // Beste individuelle stableford per hull.
      lag: { A: ['TR', 'FSA'], B: ['MA', 'KAS'] },
      vinnerlag: 'A',
      longestDrive: 'FSA', closestToPin: null,
      poeng: { FSA: 4, TR: 3.5, MA: 1.5, KAS: 1.5 } }
  ],

  resultat: { poeng: { FSA: 9.5, TR: 9, MA: 7.5, KAS: 5.5 } },
  vinner: 'FSA',
  notat: 'Dag 2 og 3 rekonstruert av KAS og FSA i oktober 2026. Skins-antall dag 2 ikke registrert.'
});
