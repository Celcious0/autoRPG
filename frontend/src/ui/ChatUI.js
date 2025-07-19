export default class ChatUI {
  constructor(container, apiClient){ this.api = apiClient; }

  async renderAll(){
    const wrap = document.createElement('div');
    wrap.id = 'chatWrapper';
    wrap.className = 'chat-wrapper';
    wrap.innerHTML = `
      <div class="chat-panel">
        <div id="chatLog"></div>
        <div id="chatInputBox">
          <input id="chatInput" placeholder="메시지 입력..." />
          <button id="chatSend">전송</button>
        </div>
      </div>
      <div id="chatToggle" class="chat-toggle">채팅방</div>`;
    document.body.appendChild(wrap);

    document.getElementById('chatToggle').onclick =
      ()=> wrap.classList.toggle('open');

    document.getElementById('chatSend').onclick = ()=>{
      const inp = document.getElementById('chatInput');
      const msg = inp.value.trim();
      if(!msg) return;
      const line = document.createElement('div');
      line.textContent = `나 > ${msg}`;
      document.getElementById('chatLog').appendChild(line);
      inp.value = '';
      document.getElementById('chatLog').scrollTop = 9e9;
    };
  }
}
