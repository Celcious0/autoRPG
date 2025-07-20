export default class User {
  #uid; #nickname; #gold; #exp; #level;
  #hp; #maxHp; #mp; #maxMp;
  #currentExp; #expToNext; #statsPoints;

  constructor({
    uid, nickname, gold, exp, level,
    hp, maxHp,
    mp              = 0,
    maxMp           = 0,
    currentExp      = 0,
    expToNext       = 1,   // 0 방지
    statsPoints
  }) {
    this.#uid        = uid;
    this.#nickname   = nickname;
    this.#gold       = gold;
    this.#exp        = exp;
    this.#level      = level;
    this.#hp         = hp;
    this.#maxHp      = maxHp;
    this.#mp         = mp;
    this.#maxMp      = maxMp;
    this.#currentExp = currentExp;
    this.#expToNext  = expToNext || 1;
    this.#statsPoints = statsPoints;
  }

  /* ── Getter ─────────────────────────────── */
  get uid()         { return this.#uid; }
  get nickname()    { return this.#nickname; }
  get gold()        { return this.#gold; }
  get exp()         { return this.#exp; }
  get level()       { return this.#level; }
  get hp()          { return this.#hp; }
  get maxHp()       { return this.#maxHp; }
  get mp()          { return this.#mp; }
  get maxMp()       { return this.#maxMp; }
  get currentExp()  { return this.#currentExp; }
  get expToNext()   { return this.#expToNext; }
  get statsPoints() { return this.#statsPoints; }

  /**
   * 안전한 필드 갱신 (화이트리스트)
   */
  update(d = {}) {
    if (typeof d !== 'object' || d === null) return;
    if (Object.hasOwn(d, 'uid')         && d.uid         !== undefined) this.#uid         = d.uid;
    if (Object.hasOwn(d, 'nickname')    && d.nickname    !== undefined) this.#nickname    = d.nickname;
    if (Object.hasOwn(d, 'gold')        && d.gold        !== undefined) this.#gold        = d.gold;
    if (Object.hasOwn(d, 'exp')         && d.exp         !== undefined) this.#exp         = d.exp;
    if (Object.hasOwn(d, 'level')       && d.level       !== undefined) this.#level       = d.level;
    if (Object.hasOwn(d, 'hp')          && d.hp          !== undefined) this.#hp          = d.hp;
    if (Object.hasOwn(d, 'maxHp')       && d.maxHp       !== undefined) this.#maxHp       = d.maxHp;
    if (Object.hasOwn(d, 'mp')          && d.mp          !== undefined) this.#mp          = d.mp;
    if (Object.hasOwn(d, 'maxMp')       && d.maxMp       !== undefined) this.#maxMp       = d.maxMp;
    if (Object.hasOwn(d, 'currentExp')  && d.currentExp  !== undefined) this.#currentExp  = d.currentExp;
    if (Object.hasOwn(d, 'expToNext')   && d.expToNext   !== undefined) this.#expToNext   = d.expToNext || 1;
    if (Object.hasOwn(d, 'statsPoints') && d.statsPoints !== undefined) this.#statsPoints = d.statsPoints;
  }
}