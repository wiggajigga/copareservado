COPA.register({
  aar: 2024, utgave: 4, status: 'ferdig',
  datoer: { fra: null, til: null },   // TODO
  base: 'Elviria, Marbella (egen leilighet)',
  spillere: [
    { kode: 'MA',  navn: null, hcp: 33 },
    { kode: 'TR',  navn: null, hcp: 25.1 },
    { kode: 'KAS', navn: null, hcp: 19.2 },
    { kode: 'FSA', navn: 'Fredrik Sagen Andersen', hcp: 22 }
  ],

  // Poeng: 4–3–2–1 per dag etter plassering. To longest drive og to closest to pin per dag, +0,5 hver.
  // Dag 3 (scramble): vinnerlag deler 4+3, taperlag deler 2+1, som i 2025.
  runder: [
    { dag: 1, dato: null, format: 'Stableford', bane: 'Santana', tee: null, greenfee: null,
      ranking: ['KAS', 'TR', 'FSA', 'MA'],
      longestDrive: ['KAS', 'TR'], closestToPin: ['KAS', 'TR'],
      poeng: { KAS: 5, TR: 4, FSA: 2, MA: 1 } },

    { dag: 2, dato: null, format: 'Skins', bane: 'Santa Clara', tee: null, greenfee: null,
      ranking: ['KAS', 'FSA', 'TR', 'MA'],
      skins: null,                                   // antall skins per spiller ikke registrert
      longestDrive: ['TR'], closestToPin: null,      // ingen closest to pin vunnet
      poeng: { KAS: 4, FSA: 3, TR: 2.5, MA: 1 } },

    { dag: 3, dato: null, format: 'Scramble', bane: 'Rio Real', tee: null, greenfee: null,
      lag: { A: ['KAS', 'MA'], B: ['TR', 'FSA'] },
      vinnerlag: 'A',
      longestDrive: ['TR'], closestToPin: null,      // ingen closest to pin vunnet
      poeng: { KAS: 3.5, MA: 3.5, TR: 2, FSA: 1.5 } }
  ],

  resultat: { poeng: { KAS: 12.5, TR: 8.5, FSA: 6.5, MA: 5.5 } },
  vinner: 'KAS',
  notat: 'Rekonstruert av KAS i oktober 2026. Datoer og skins-antall ikke registrert. ' +
         'Dag 3-poengene bruker 2025-fordelingen (3,5 / 1,5); ikke bekreftet hvordan det ble telt i 2024.'
});
