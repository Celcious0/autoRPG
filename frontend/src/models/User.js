export default class User {
  #uid;
  #nickname;
  #gold;
  #exp;
  #level;
  #hp;
  #maxHp;
  #statsPoints;

  constructor({ uid, nickname, gold, exp, level, hp, maxHp, statsPoints }) {
    this.#uid         = uid;
    this.#nickname    = nickname;
    this.#gold        = gold;
    this.#exp         = exp;
    this.#level       = level;
    this.#hp          = hp;
    this.#maxHp       = maxHp;
    this.#statsPoints = statsPoints;
  }

  // 읽기 전용 getter -----------------------------------------------
  get uid()         { return this.#uid; }
  get nickname()    { return this.#nickname; }
  get gold()        { return this.#gold; }
  get exp()         { return this.#exp; }
  get level()       { return this.#level; }
  get hp()          { return this.#hp; }
  get maxHp()       { return this.#maxHp; }
  get statsPoints() { return this.#statsPoints; }

  /**
   * fresh 객체에 담긴 값으로 내부 상태를 안전하게 갱신
   *  - 허용된 키만 화이트리스트 방식으로 반영
   *  - undefined 값은 무시해 불필요한 overwrite 방지
   *  - 프로토타입 오염 차단(__proto__, constructor 등은 처리하지 않음)
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
    if (Object.hasOwn(d, 'statsPoints') && d.statsPoints !== undefined) this.#statsPoints = d.statsPoints;
  }
}