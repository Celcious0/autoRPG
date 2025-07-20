export default class StatsUI {
  #u; #api; #styleEl;  // 기존 #u, #api에 #styleEl 추가

  constructor(user, api) {
    this.#u = user;
    this.#api = api;
  }

  render() {
    const c = document.getElementById('stats');
    c.innerHTML = `
      <div class="profile">
        <div class="diamond"></div>
        <div class="nameBox">${this.#u.nickname}</div>
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
          <div class="fill"></div>   <!-- 인라인 style 제거 -->
          <span class="txt">${this.#u.hp}/${this.#u.maxHp}</span>
        </div>
        <div class="barBox mp">
          <div class="fill"></div>   <!-- 인라인 style 제거 -->
          <span class="txt">${this.#u.mp}/${this.#u.maxMp}</span>
        </div>
      </div>`;

    // EXP 바가 처음 생성되지 않았다면 body에 추가
    if (!document.getElementById('expBar')) {
      document.body.insertAdjacentHTML('beforeend',
        `<div id="expBar"><div class="fill"></div></div>`);
    }
    // HP, MP, EXP 바 너비를 동적으로 설정
    this.#updateBars();
  }

  #updateBars() {
    const hpPct = this.#u.hp / this.#u.maxHp * 100;
    const mpPct = this.#u.mp / this.#u.maxMp * 100;
    const expPct = Math.round(this.#u.currentExp / this.#u.expToNext * 100);

    // 스타일 태그 한 번만 생성하여 보존
    if (!this.#styleEl) {
      this.#styleEl = document.createElement('style');   // 생성 시 nonce 자동 부여
      document.head.appendChild(this.#styleEl);
    }
    // 스타일 태그에 현재 수치를 반영한 CSS 규칙 삽입
    this.#styleEl.textContent = `
      .barBox.hp .fill { width: ${hpPct}% }
      .barBox.mp .fill { width: ${mpPct}% }
      #expBar .fill    { width: ${expPct}% }
    `;
  }
}