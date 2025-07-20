export default class StatsUI {
  #u; #api; #styleEl;

  constructor(user, api) {
    this.#u   = user;
    this.#api = api;
  }

  render() {
    const el = document.getElementById('stats');
    el.innerHTML = `
      <div class="profile">
        <div class="diamond"></div>
        <div class="nameBox">${this.#escape(this.#u.nickname)}</div>
      </div>

      <div class="gold-indicator"><div class="coin"></div>${this.#u.gold}</div>
      <div id="playerLevel">${this.#u.level}</div>

      <div class="potion-group">
        <div class="potion">소형</div>
        <div class="potion">중형</div>
        <div class="potion">대형</div>
      </div>

      <div class="bars">
        <div class="barBox hp"><div class="fill"></div><span class="txt">${this.#u.hp}/${this.#u.maxHp}</span></div>
        <div class="barBox mp"><div class="fill"></div><span class="txt">${this.#u.mp}/${this.#u.maxMp}</span></div>
      </div>`;

    /* EXP 바(전역 1개) */
    if (!document.getElementById('expBar')) {
      document.body.insertAdjacentHTML('beforeend', `<div id="expBar"><div class="fill"></div></div>`);
    }

    this.#updateBars();
  }

  /** HP·MP·EXP 막대 실시간 반영 */
  #updateBars() {
    const pct = (cur, max) => {
      const n = (cur / Math.max(max, 1)) * 100;
      return Math.min(100, Math.max(0, n));
    };

    const hpPct  = pct(this.#u.hp,         this.#u.maxHp);
    const mpPct  = pct(this.#u.mp,         this.#u.maxMp);
    const expPct = pct(this.#u.currentExp, this.#u.expToNext);

    if (!this.#styleEl) {
      this.#styleEl = document.createElement('style');
      document.head.appendChild(this.#styleEl);
    }
    this.#styleEl.textContent = `
      .barBox.hp .fill { width: ${hpPct}% }
      .barBox.mp .fill { width: ${mpPct}% }
      #expBar .fill    { width: ${expPct}% }
    `;
  }

  /** 간단한 HTML 이스케이프 */
  #escape(str=''){
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }
}
