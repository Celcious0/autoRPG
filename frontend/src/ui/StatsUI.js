export default class StatsUI{
  #u; #api;
  constructor(user, apiClient){ this.#u = user; this.#api = apiClient; }

  render(){
    const c = document.getElementById('stats');
    c.innerHTML = `
      <div class="profile">
        <div class="diamond"></div>
        <div class="nameBox">${this.#u.nickname}</div>
      </div>
      <div class="gold-indicator">
        <div class="coin"></div>${this.#u.gold}
      </div>
      <div id="playerLevel">${this.#u.level}</div>

      <div class="potion-group">
        <div class="potion">소형</div>
        <div class="potion">중형</div>
        <div class="potion">대형</div>
      </div>

      <div class="bars">
        <div class="barBox hp">
          <div class="fill" style="width:${this.#u.hp/this.#u.maxHp*100}%"></div>
          <span class="txt">${this.#u.hp}/${this.#u.maxHp}</span>
        </div>
        <div class="barBox mp">
          <div class="fill" style="width:0%"></div>
          <span class="txt">0/0</span>
        </div>
      </div>
    `;
    if(!document.getElementById('expBar')){
      const bar = document.createElement('div');
      bar.id = 'expBar';
      bar.innerHTML = `<div class="fill"></div>`;
      document.body.appendChild(bar);
    }
    const pct = Math.round(this.#u.exp/this.#u.expToNext*100);
    document.querySelector('#expBar .fill').style.width = pct+'%';
  }
}