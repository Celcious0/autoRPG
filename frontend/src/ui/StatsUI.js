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
        <div class="nameBox">${this.#escapeHtml(this.#u.nickname)}</div>
      </div>

      <div class="gold-indicator"><div class="coin"></div>${this.#u.gold}</div>
      <div id="playerLevel">${this.#u.level}</div>

      <div class="potion-group">
        <div class="potion">소형</div>
        <div class="potion">중형</div>
        <div class="potion">대형</div>
      </div>

      <div class="bars">
        <div class="barBox hp">
          <div class="fill"></div>
          <span class="txt">${this.#u.hp}/${this.#u.maxHp}</span>
        </div>
        <div class="barBox mp">
          <div class="fill"></div>
          <span class="txt">${this.#u.mp}/${this.#u.maxMp}</span>
        </div>
      </div>`;

    if (!document.getElementById('expBar')) {
      document.body.insertAdjacentHTML('beforeend',
        `<div id="expBar"><div class="fill"></div></div>`);
    }
    this.#updateBars();
  }

  #updateBars() {
    /** 0-division 및 NaN 방지 */
    const hpPct  = Math.min(100, Math.max(0, this.#u.hp  / Math.max(this.#u.maxHp, 1)      * 100));
    const mpPct  = Math.min(100, Math.max(0, this.#u.mp  / Math.max(this.#u.maxMp, 1)      * 100));
    const expPct = Math.min(100, Math.max(0, this.#u.currentExp / Math.max(this.#u.expToNext, 1) * 100));

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

  /** 간단한 HTML 이스케이프 (XSS 방지) */
  #escapeHtml(str = '') {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }
}