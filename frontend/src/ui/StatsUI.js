export default class StatsUI{
  #u; #api;
  constructor(user, api){ this.#u = user; this.#api = api; }

  render(){
    const c = document.getElementById('stats');
    c.innerHTML = `
      <div class="profile">
        <div class="diamond"></div>
        <div class="nameBox">${this.#u.nickname}</div>
      </div>

      <div class="gold-indicator"><div class="coin"></div>${this.#u.gold}</div>
      <div id="playerLevel">${this.#u.level}</div>

      <div class="potion-group">
        <div class="potion">소형</div><div class="potion">중형</div><div class="potion">대형</div>
      </div>

      <div class="bars">
        <div class="barBox hp">
          <div class="fill" style="width:${this.#u.hp / this.#u.maxHp * 100}%"></div>
          <span class="txt">${this.#u.hp}/${this.#u.maxHp}</span>
        </div>
        <div class="barBox mp">
          <div class="fill" style="width:${this.#u.mp / this.#u.maxMp * 100}%"></div>
          <span class="txt">${this.#u.mp}/${this.#u.maxMp}</span>
        </div>
      </div>`;

    if(!document.getElementById('expBar')){
      document.body.insertAdjacentHTML('beforeend',
        `<div id="expBar"><div class="fill"></div></div>`);
    }
    this.#updateExpBar();
  }

  #updateExpBar(){
    const pct = Math.round(this.#u.currentExp / this.#u.expToNext * 100);
    document.querySelector('#expBar .fill').style.width = pct + '%';
  }
}