# Dataskjema

Én fil per år, `data/<år>.js`, som kaller `COPA.register({...})`.
Ingen byggesteg, ingen avhengigheter. Last `copa.js` først, så årsfilene.

```js
COPA.register({
  aar: 2026,              // tall
  utgave: 6,              // 2021 = 1
  status: 'planlegging',  // 'planlegging' | 'spilles' | 'ferdig'

  datoer: { fra: '2026-11-05', til: '2026-11-08' },
  base: 'Elviria, Marbella',

  spillere: [
    { kode: 'KAS', navn: null, hcp: 17.4 }   // navn: null = ikke registrert
  ],

  // Én per runde. bane: null så lenge den ikke er bestemt.
  runder: [
    {
      dag: 1,
      dato: '2026-11-05',
      format: 'Stableford',
      bane: null,
      tee: null,              // '13:10'
      greenfee: null,         // euro per spiller, inkl. delt buggy
      kandidater: [ /* se under, kun i planleggingsfasen */ ]
    }
  ],

  // Fylles når turneringen er spilt.
  resultat: null,           // { poeng: { KAS: 12.5, ... } }
  vinner: null,             // spillerkode
  notat: ''
});
```

## Kandidater

Brukes bare mens banene velges. Hver kandidat:

```js
{
  bane: 'Rio Real',
  arkitekt: 'Javier Arana',
  aapnet: 1965,
  beskrivelse: 'flat, bred, gåbar',
  tee: '11.20 / 12.30 / 13.10 / 13.50',
  pris: 166,              // euro per spiller, inkl. delt buggy
  kjoretid: 12,           // minutter fra Elviria
  status: 'ok',           // 'ok' | 'warn' | 'stop'
  merknad: 'Fire firerball-tider'
}
```

## Regler

- Priser er per spiller og inkluderer delt buggy. Der banen ikke selger buggy
  i greenfeen, er to buggyer til fire spillere lagt til.
- `status: 'ferdig'` er det som får året inn på honour board.
- Stjerner på honour board regnes ut av `COPA.honourBoard()`, ikke hardkodet.
- Mangler et felt, skal det stå `null`. Ikke gjett.
