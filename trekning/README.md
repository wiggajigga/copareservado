<!-- /trekning/README.md -->
# Trekning – Golfbiler dag 1

En liten, statisk side som trekker **rettferdig** mellom de tre mulige 2-og-2-kombinasjonene for fire spillere. Støtter delbar, reproduserbar trekning via `seed` i URL.

## Bruk

- Gå til `/trekning/` på nettstedet. Navn er forhåndsutfylt: Mats, Fredrik, Trygve, Knut.
- Klikk **Trekk par** for å gjennomføre trekning (bruker URL-seed hvis satt, ellers genereres et nytt).
- Klikk **Trekk på nytt** for å ignorere eventuell seed i URL og gjøre en ny trekning.
- Klikk **Kopier delbar lenke** for å kopiere en URL som inneholder `seed` og navnene, slik at samme par kan gjenbrukes senere eller deles i chat.

**Valgfritt:** Legg til `?seed=YYYYMMDD` i URL (eller en annen streng) for å reprodusere samme par. Eksempel:  
`https://copareservado.com/trekning/?seed=20251102`

> Seed + navnene (som sendes i `names=`) gir deterministisk resultat. Hvis navn ikke oppgis i URL brukes feltet i siden (forhåndsutfylt med de fire spillerne).

## Rettferdighet

Algoritmen trekker uniformt mellom de tre unike par-kombinasjonene:  
1) A-B & C-D  
2) A-C & B-D  
3) A-D & B-C

I nettleserens konsoll kan du kjøre en enkel Monte Carlo-test:
```js
window.__fairnessTest(60000)
