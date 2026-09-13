COPA.register({
  aar: 2026, utgave: 6, status: 'planlegging',

  datoer: { fra: '2026-11-05', til: '2026-11-08' },
  base: 'Elviria, Marbella (egen leilighet)',

  spillere: [
    { kode: 'MA',  navn: null, hcp: null },
    { kode: 'TR',  navn: null, hcp: null },
    { kode: 'KAS', navn: null, hcp: null },
    { kode: 'FSA', navn: 'Fredrik Sagen Andersen', hcp: null }
  ],
  // Handicapene er kjent, men ikke fordelt på spiller ennå.
  hcpListe: [17.4, 20.5, 20.9, 24],

  rammer: {
    ankomst: 'Lander 11.00 torsdag',
    maksKjoretid: 120,            // minutter
    solnedgang: '18.18',          // 7. november, vintertid
    sisteLys: '18.45',            // borgerlig skumring
    sisteStart: '14.00',
    beachclub: 'Lunsj og premieutdeling på Nosso kl. 15, Playa El Rosario (sesongen slutter 13. november)'
  },

  runder: [
    {
      dag: 1,
      dato: '2026-11-05',
      format: 'Stableford',
      vindu: 'Start mellom 12 og 14, nær Elviria',
      bane: null, tee: null, greenfee: null,
      kandidater: [
        { bane: 'Rio Real',     arkitekt: 'Javier Arana', aapnet: 1965, beskrivelse: 'flat, bred, gåbar',
          tee: '11.20 / 12.30 / 13.10 / 13.50', pris: 166, kjoretid: 12, status: 'ok',   merknad: 'Fire firerball-tider' },
        { bane: 'Santa María',  arkitekt: null, aapnet: 1991, beskrivelse: 'ligger i Elviria',
          tee: '13.10 til 13.50',               pris: 130, kjoretid: 2,  status: 'ok',   merknad: 'Fem tider' },
        { bane: 'Cabopino',     arkitekt: null, aapnet: 1999, beskrivelse: 'kort, kupert, trang',
          tee: '13.30',                          pris: 108, kjoretid: 8,  status: 'ok',   merknad: 'Ledig' },
        { bane: 'Santa Clara',  arkitekt: 'Enrique Canales', aapnet: 2001, beskrivelse: 'buggy inkludert',
          tee: '13.30',                          pris: 190, kjoretid: 10, status: 'ok',   merknad: 'Ledig' },
        { bane: 'Calanova',     arkitekt: null, aapnet: null, beskrivelse: 'brede fairwayer, buggy inkludert',
          tee: '08.10 eller 14.50',              pris: 135, kjoretid: 18, status: 'warn', merknad: 'Ingen firerball 12 til 14' },
        { bane: 'El Chaparral', arkitekt: null, aapnet: null, beskrivelse: 'kort par 72 i pinjeskog, buggy inkludert',
          tee: '08.00 eller fra 14.30',          pris: 123, kjoretid: 21, status: 'warn', merknad: 'Ingen firerball 12 til 14' },
        { bane: 'Santana',           arkitekt: 'Cabell B. Robinson', aapnet: 2004, beskrivelse: 'flat, brede fairwayer, mest gåbare bane i utvalget',
          tee: 'etter avtale',       pris: 135,   kjoretid: 22, status: 'warn', merknad: 'Ingen tider på nett 1. til 15. nov' }
      ]
    },
    {
      dag: 2,
      dato: '2026-11-06',
      format: 'Skins',
      vindu: 'Fri tid, inntil to timers kjøring',
      bane: null, tee: null, greenfee: null,
      kandidater: [
        { bane: 'Guadalmina Sur',   arkitekt: 'Javier Arana', aapnet: 1959, beskrivelse: 'smal, gammel pinje',
          tee: 'etter avtale',       pris: 202.5, kjoretid: 28, status: 'warn', merknad: 'Må ringes' },
        { bane: 'Alferini',         arkitekt: null, aapnet: null, beskrivelse: 'Villa Padierna, spilt i 2025',
          tee: '14.00',              pris: 166,   kjoretid: 40, status: 'warn', merknad: 'To plasser på nett' },
        { bane: 'Atalaya Old',      arkitekt: 'Bernhard von Limburger', aapnet: 1968, beskrivelse: 'flat parkland',
          tee: '08.00 / 11.09 / 11.45', pris: 153, kjoretid: 30, status: 'ok',  merknad: '11 tider' },
        { bane: 'Atalaya New',      arkitekt: 'Paul Krings', aapnet: 1990, beskrivelse: 'buggy i pakkeprisen',
          tee: '13.33',              pris: 85,    kjoretid: 30, status: 'ok',   merknad: '13 tider' },
        { bane: 'Guadalmina Norte', arkitekt: 'Folco Nardi', aapnet: null, beskrivelse: 'kort og vennlig, samme klubbhus som Sur',
          tee: 'etter avtale',       pris: 137.5, kjoretid: 28, status: 'warn', merknad: 'Må ringes' },
        { bane: 'Rio Real',         arkitekt: 'Javier Arana', aapnet: 1965, beskrivelse: 'flat, bred, gåbar',
          tee: '08.00',              pris: 171,   kjoretid: 12, status: 'ok',   merknad: 'Ledig' },
        { bane: 'El Paraíso',       arkitekt: 'Gary Player', aapnet: 1973, beskrivelse: 'flat dalbane',
          tee: 'etter avtale',       pris: 145,   kjoretid: 38, status: 'warn', merknad: 'November ikke åpnet' },
        { bane: 'Finca Cortesín',   arkitekt: 'Cabell Robinson', aapnet: 2006, beskrivelse: 'Solheim Cup, buggy inkludert',
          tee: '10.00 til 15.00',    pris: 382,   kjoretid: 40, status: 'ok',   merknad: '16 firerball-tider' },
        { bane: 'La Hacienda Links', arkitekt: null, aapnet: null, beskrivelse: 'tidl. Alcaidesa, eneste ekte links på kysten, buggy inkludert',
          tee: '08.00 eller 13.24',  pris: 289,   kjoretid: 58, status: 'ok',   merknad: 'Ni tider' },
        { bane: 'San Roque Old',    arkitekt: 'Dave Thomas', aapnet: 1990, beskrivelse: 'bunkere omtegnet av Seve',
          tee: '12.50 og utover',    pris: 300,   kjoretid: 65, status: 'ok',   merknad: '18 tider, buggy kommer i tillegg' },
        { bane: 'Santana',           arkitekt: 'Cabell B. Robinson', aapnet: 2004, beskrivelse: 'flat, brede fairwayer, mest gåbare bane i utvalget',
          tee: 'etter avtale',       pris: 135,   kjoretid: 22, status: 'warn', merknad: 'Ingen tider på nett 1. til 15. nov' }
      ]
    },
    {
      dag: 3,
      dato: '2026-11-07',
      format: 'Lagmatch',
      vindu: 'Start senest 09.30, lunsj og premieutdeling på Nosso kl. 15',
      bane: null, tee: null, greenfee: null,
      kandidater: [
        { bane: 'Santa María',       arkitekt: null, aapnet: 1991, beskrivelse: 'i Elviria, early bird',
          tee: '08.00 til 09.20',      pris: 107.5, kjoretid: 2,  status: 'ok',   merknad: 'Sju tider, dyrere fra 09.00' },
        { bane: 'Higuerón Marbella', arkitekt: null, aapnet: null, beskrivelse: 'tidl. Marbella Golf & Country Club, buggy i parprisen',
          tee: '08.10 til 09.20',      pris: 122.5, kjoretid: 8,  status: 'ok',   merknad: 'Sju tider' },
        { bane: 'Cabopino',          arkitekt: null, aapnet: 1999, beskrivelse: 'buggy inkludert',
          tee: '08.10 / 08.20',        pris: 108,   kjoretid: 8,  status: 'warn', merknad: 'Bare to firerball' },
        { bane: 'Santa Clara',       arkitekt: 'Enrique Canales', aapnet: 2001, beskrivelse: 'buggy inkludert',
          tee: '08.10 / 08.20 / 08.30', pris: 190,  kjoretid: 10, status: 'warn', merknad: 'Bare tre firerball' },
        { bane: 'Rio Real',          arkitekt: 'Javier Arana', aapnet: 1965, beskrivelse: 'flat, bred, gåbar',
          tee: '08.00 / 08.50 / 09.00 / 09.50', pris: 171, kjoretid: 12, status: 'ok', merknad: 'Fire tider, dyrere fra 09.00' },
        { bane: 'Miraflores',        arkitekt: null, aapnet: null, beskrivelse: 'kort og kupert, flere blindslag, buggy kommer i tillegg',
          tee: '08.00 / 08.18 / 09.03', pris: 92,   kjoretid: 17, status: 'warn', merknad: 'Buggypris ikke publisert' },
        { bane: 'Calanova',          arkitekt: null, aapnet: null, beskrivelse: 'brede fairwayer, buggy inkludert',
          tee: '08.00',                pris: 135,   kjoretid: 18, status: 'warn', merknad: 'Bare én firerball' },
        { bane: 'Santana',           arkitekt: 'Cabell B. Robinson', aapnet: 2004, beskrivelse: 'flat, brede fairwayer, mest gåbare bane i utvalget',
          tee: 'etter avtale',         pris: 135,   kjoretid: 22, status: 'warn', merknad: 'Ingen tider på nett 1. til 15. nov' },
        { bane: 'Los Naranjos',      arkitekt: 'Robert Trent Jones Sr.', aapnet: 1977, beskrivelse: 'buggy kommer i tillegg',
          tee: '08.00',                pris: 204,   kjoretid: 25, status: 'warn', merknad: 'Bare én firerball' },
        { bane: 'Guadalmina Sur',    arkitekt: 'Javier Arana', aapnet: 1959, beskrivelse: 'smal, gammel pinje',
          tee: 'etter avtale',         pris: 202.5, kjoretid: 28, status: 'warn', merknad: 'Må ringes' },
        { bane: 'Atalaya New',       arkitekt: 'Paul Krings', aapnet: 1990, beskrivelse: 'buggy i pakkeprisen',
          tee: '08.00 til 08.27',      pris: 85,    kjoretid: 30, status: 'ok',   merknad: 'Fire tider, beste kjøp' },
        { bane: 'Atalaya Old',       arkitekt: 'Bernhard von Limburger', aapnet: 1968, beskrivelse: 'flat parkland',
          tee: '08.00 til 08.54',      pris: 153,   kjoretid: 30, status: 'ok',   merknad: 'Seks tider' },
        { bane: 'La Quinta',         arkitekt: null, aapnet: null, beskrivelse: '27 hull, buggy selges ikke på nett',
          tee: '08.30 / 09.20 / 09.30', pris: 130,  kjoretid: 30, status: 'warn', merknad: 'Buggypris ikke publisert' },
        { bane: 'VP Tramores',       arkitekt: null, aapnet: null, beskrivelse: 'Villa Padierna, ingen hcp-grense, buggy i parprisen',
          tee: '08.20 til 09.40',      pris: 80.5,  kjoretid: 40, status: 'ok',   merknad: 'Fem tider, billigst' },
        { bane: 'La Hacienda Heathland', arkitekt: null, aapnet: null, beskrivelse: 'tidl. Alcaidesa, buggy og GPS inkludert',
          tee: '08.00 til 09.30',      pris: 150,   kjoretid: 65, status: 'ok',   merknad: 'Sju tider, best tilgang' },
        { bane: 'La Hacienda Links', arkitekt: null, aapnet: null, beskrivelse: 'eneste ekte links på kysten, buggy og GPS inkludert',
          tee: '08.00 til 08.36',      pris: 289,   kjoretid: 65, status: 'ok',   merknad: 'Fire tider' }
      ]
    }
  ],

  resultat: null,
  vinner: null,
  notat: 'Priser er per spiller inkludert delt buggy, hentet fra banenes egne bookingsystemer ' +
         '13. september 2026 for de faktiske datoene.'
});
