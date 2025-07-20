export default class User {
  #uid; #nickname; #gold; #exp; #level;
  #hp; #maxHp; #statsPoints;
  #currentExp; #expToNext;

  constructor(raw = {}) {
    /* ── 필드 매핑 (snake_case․camelCase 모두 허용) ─────────── */
    const {
      uid                = null,
      nickname           = '익명',
      gold               = 0,
      exp                = 0,
      level              = 1,
      hp                 = 1,
      maxHp              = 1,
      statsPoints        = 0,
      currentExp         = raw.current_exp   ?? raw.currentEXP ?? 0,
      expToNext          = raw.expToNext     ?? raw.exp_to_next ?? 1
    } = raw;

    this.#uid         = uid;
    this.#nickname    = nickname;
    this.#gold        = gold;
    this.#exp         = exp;
    this.#level       = level;
    this.#hp          = hp;
    this.#maxHp       = maxHp;
    this.#statsPoints = statsPoints;
    this.#currentExp  = currentExp;
    this.#expToNext   = expToNext || 1;      // 0-division 방지
  }

  /* ── Getter (읽기 전용) ─────────────────────────────────── */
  get uid()         { return this.#uid; }
  get nickname()    { return this.#nickname; }
  get gold()        { return this.#gold; }
  get exp()         { return this.#exp; }
  get level()       { return this.#level; }
  get hp()          { return this.#hp; }
  get maxHp()       { return this.#maxHp; }
  get statsPoints() { return this.#statsPoints; }
  get currentExp()  { return this.#currentExp; }
  get expToNext()   { return this.#expToNext; }

  /**
   * 안전한 상태 갱신 (화이트리스트 & XSS / 프로토타입 오염 차단)
   */
  update(d = {}) {
    if (typeof d !== 'object' || d === null) return;
    const set = (key, priv, fallbackKeys = []) => {
      if (Object.hasOwn(d, key) && d[key] !== undefined) this[priv] = d[key];
      else {
        for (const k of fallbackKeys)
          if (Object.hasOwn(d, k) && d[k] !== undefined) { this[priv] = d[k]; break; }
      }
    };
    set('uid',         '#uid');
    set('nickname',    '#nickname');
    set('gold',        '#gold');
    set('exp',         '#exp');
    set('level',       '#level');
    set('hp',          '#hp');
    set('maxHp',       '#maxHp');
    set('statsPoints', '#statsPoints');
    set('currentExp',  '#currentExp', ['current_exp', 'currentEXP']);
    set('expToNext',   '#expToNext',  ['exp_to_next']);
    if (this.#expToNext === 0) this.#expToNext = 1; // 0-division 방지
  }
}
