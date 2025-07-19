import AuthService  from './services/AuthService.js';
import ApiClient    from './services/ApiClient.js';
import User         from './models/User.js';
import Inventory    from './models/Inventory.js';
import NavUI        from './ui/NavUI.js';
import StatsUI      from './ui/StatsUI.js';
import InventoryUI  from './ui/InventoryUI.js';
import ChatUI       from './ui/ChatUI.js';
import './styles/main.css';

(async () => {
  await AuthService.init();

  let uid, token;

  try {
    // uid·token 동시 획득
    ({ uid, token } = await AuthService.getAuthContext());
  } catch {
    // 로그인·회원가입 폼 렌더링
    const appEl = document.getElementById('app') || document.body;
    appEl.innerHTML = `
      <h1 class="app-title">자동사냥 RPG</h1>
      <form id="loginForm" class="login-form">
        <input type="text"     id="nicknameInput" class="auth-input" placeholder="닉네임" /><br />
        <input type="email"    id="email"         class="auth-input" placeholder="이메일" required /><br />
        <input type="password" id="password"      class="auth-input" placeholder="비밀번호" required /><br />
        <div class="auth-buttons">
          <button type="button" id="signUpBtn" class="btn">회원가입</button>
          <button type="submit"               class="btn">로그인</button>
        </div>
      </form>
    `;

    // 로그인 처리
    document.getElementById('loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await AuthService.login(email, password);
        window.location.reload();
      } catch (err) {
        alert('로그인 실패: ' + err.message);
      }
    });

    // 회원가입 처리
    document.getElementById('signUpBtn').addEventListener('click', async () => {
      const nickname = document.getElementById('nicknameInput').value;
      const email    = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await AuthService.signUp(nickname, email, password);
        window.location.reload();
      } catch (err) {
        alert('회원가입 실패: ' + err.message);
      }
    });

    return;
  }

  // 인증 완료 → 앱 초기화
  const api      = new ApiClient(token, uid);
  const userData = await api.fetchUserData();
  const user     = new User(userData);
  const inv      = new Inventory(userData.inventory);

  new NavUI(document.getElementById('nav')).render();
  const statsUI = new StatsUI(user);
  const invUI   = new InventoryUI(inv, api, statsUI);
  const chatUI  = new ChatUI(document.getElementById('chat'), api);

  await invUI.renderAll();
  await chatUI.renderAll();
  statsUI.render();
})();