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
  /* ───── 1) 세션 확보 ─────────────────────────────────── */
  await AuthService.init();                      // 로컬 스토리지 확인 등

  // 로그인된 세션이 없으면 로그인 화면으로 이동
  let { token, uid } = AuthService.getSession() || {};
  if (!token) {
    ({ token, uid } = await AuthService.showLoginModal()); // 사용자 로그인 후 토큰·uid 리턴
    AuthService.saveSession({ token, uid });               // 필요 시 로컬 스토리지 유지
  }

  /* ───── 2) 앱 초기화 ─────────────────────────────────── */
  const api      = new ApiClient(token, uid);
  const userData = await api.fetchUserData();              // 유저 기본 데이터
  const user     = new User(userData);
  const inv      = new Inventory(userData.inventory);

  new NavUI().render();

  const statsUI = new StatsUI(user, api);
  const invUI   = new InventoryUI(inv, api, statsUI);
  const chatUI  = new ChatUI(null, api);

  await invUI.renderAll();
  await chatUI.renderAll();
  statsUI.render();                                        // 최초 렌더링

  /* ───── 3) 탭 전환 ──────────────────────────────────── */
  window.showTab = (label = '홈') => {
    document.body.dataset.tab = label;
    statsUI.render();                                      // 스탯·바 재계산
  };
  window.showTab('홈');

  /* ───── 4) 실시간 경험치/스탯 동기화 ────────────────── */
  setInterval(async () => {
    const fresh = await api.fetchUserData();
    Object.assign(user, fresh);
    statsUI.render();
  }, 5000);                                               // 5 초마다 갱신
})();