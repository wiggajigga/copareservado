/**
 * Copa Reservado – felles dataregister
 *
 * Hvert år ligger i data/<år>.js og registrerer seg selv her.
 * Last copa.js først, deretter årsfilene, deretter siden som bruker dem.
 *
 *   <script src="/data/copa.js"></script>
 *   <script src="/data/2021.js"></script>
 *   ...
 *
 * Skjema per år, se data/README.md.
 */
window.COPA = window.COPA || {
  _aar: {},

  register: function (turnering) {
    this._aar[turnering.aar] = turnering;
    return turnering;
  },

  /** Ett år. */
  get: function (aar) {
    return this._aar[aar] || null;
  },

  /** Alle år, nyeste først. */
  alle: function () {
    return Object.keys(this._aar)
      .map(Number)
      .sort(function (a, b) { return b - a; })
      .map(function (a) { return window.COPA._aar[a]; });
  },

  /** Ferdigspilte år, nyeste først. */
  spilte: function () {
    return this.alle().filter(function (t) { return t.status === 'ferdig'; });
  },

  /**
   * Honour board: ett innslag per ferdigspilt år, nyeste først,
   * med antall titler spilleren hadde til og med det året.
   */
  honourBoard: function () {
    var teller = {};
    var rader = this.spilte()
      .slice()
      .sort(function (a, b) { return a.aar - b.aar; })
      .map(function (t) {
        teller[t.vinner] = (teller[t.vinner] || 0) + 1;
        return { aar: t.aar, vinner: t.vinner, titler: teller[t.vinner] };
      });
    return rader.reverse();
  },

  /** Alle spillerkoder som har deltatt, alfabetisk. */
  spillere: function () {
    var sett = {};
    this.alle().forEach(function (t) {
      (t.spillere || []).forEach(function (s) { sett[s.kode] = s; });
    });
    return Object.keys(sett).sort().map(function (k) { return sett[k]; });
  }
};
