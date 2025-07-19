export default class NavUI{
  #tabs = ['홈','던전','보스','상점','후원','랭킹','아레나','인벤토리'];
  render(){
    document.body.insertAdjacentHTML('beforeend',
      `<div id="fab" class="fab">≡</div><div id="menuWrap"></div>`);
    const wrap = document.getElementById('menuWrap');
    this.#tabs.forEach((label,i)=>{
      const b = document.createElement('button');
      b.className = 'menu-btn'; b.dataset.order = i+1; b.textContent = label;
      b.onclick = ()=> window.showTab?.(label);
      wrap.appendChild(b);
    });
    let open = false;
    document.getElementById('fab').onclick = ()=>{
      open = !open;
      document.querySelectorAll('.menu-btn')
        .forEach(btn=>btn.classList.toggle('show',open));
    };
  }
}
