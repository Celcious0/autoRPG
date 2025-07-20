export default class StatsUI {
  #u; #api; #styleEl;

  constructor(user, api) { this.#u = user; this.#api = api; }

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
        <div class="potion">소형</div><div class="potion">중형</div><div class="potion">대형</div>
      </div>

      <div class="bars">
        <div class="barBox hp"><div class="fill"></div><span class="txt">${this.#u.hp}/${this.#u.maxHp}</span></div>
        <div class="barBox mp"><div class="fill"></div><span class="txt">${this.#u.mp}/${this.#u.maxMp}</span></div>
      </div>`;

    if (!document.getElementById('expBar'))
      document.body.insertAdjacentHTML('beforeend', `<div id="expBar"><div class="fill"></div></div>`);

    this.#updateBars();
  }

  #updateBars() {
    const pct = (cur, max) => Math.min(100, Math.max(0, (cur / Math.max(max, 1)) * 100));

    /* ── 비율 계산 (0-division & NaN 방지) ───────────────── */
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

  #escape(str=''){ const d=document.createElement('div'); d.textContent=String(str); return d.innerHTML; }
}
