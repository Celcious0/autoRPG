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

  // ── 앱 초기화 ─────────────────────────────────────────────
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

  // ── 탭 전환 ───────────────────────────────────────────────
  window.showTab = (label = '홈') => {
    document.body.dataset.tab = label;
    statsUI.render();
  };
  window.showTab('홈');

  // ── 실시간 경험치/스탯 동기화 ─────────────────────────────
  setInterval(async () => {
    const fresh = await api.fetchUserData();
    Object.assign(user, fresh);
    statsUI.render();
  }, 5000);
})();