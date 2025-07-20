import AuthService  from './services/AuthService.js';
import ApiClient    from './services/ApiClient.js';
import User         from './models/User.js';
import Inventory    from './models/inventory.js';
import NavUI        from './ui/NavUI.js';
import StatsUI      from './ui/StatsUI.js';
import InventoryUI  from './ui/InventoryUI.js';
import ChatUI       from './ui/ChatUI.js';
import './styles/main.css';

(async () => {
  await AuthService.init();

  const loginForm = document.getElementById('loginForm');
  let uid, token;

  /* ── 로그인 세션 확보 ───────────────────────── */
  try {
    ({ uid, token } = await AuthService.getAuthContext()); // 이미 로그인
    if (loginForm) loginForm.remove();
  } catch {
    if (loginForm) loginForm.hidden = false;

    // 로그인
    loginForm.addEventListener('submit', async e => {
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

    // 회원가입
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

    return; // 로그인 전이므로 이후 로직 중단
  }

  /* ── 앱 초기화 ─────────────────────────────── */
  const api      = new ApiClient(token, uid);
  const userData = await api.fetchUserData();
  const user     = new User(userData);
  const inv      = new Inventory(userData.inventory);

  new NavUI().render();

  const statsUI = new StatsUI(user, api);
  const invUI   = new InventoryUI(inv, api, statsUI);
  const chatUI  = new ChatUI(null, api);

  await invUI.renderAll();
  await chatUI.renderAll();
  statsUI.render();

  /* ── 탭 전환 헬퍼 ──────────────────────────── */
  window.showTab = (label = '홈') => {
    document.body.dataset.tab = label;
    statsUI.render();
  };
  window.showTab('홈');

  /* ── 실시간 경험치·스탯 동기화 ─────────────── */
  setInterval(async () => {
    const fresh = await api.fetchUserData();
    user.update(fresh);
    statsUI.render();
  }, 5000);
})();

