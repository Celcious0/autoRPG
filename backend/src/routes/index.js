import express from 'express';
import cors from 'cors';                       // 추가
import { json as bodyParser } from 'body-parser';
import AuthService from '../services/AuthService.js';
import InventoryCtrl from '../controllers/InventoryController.js';
import checkNicknameRouter from './checkNickname.js';

const router = express.Router();

// ── CORS 옵션 (동일 Origin만 허용하거나 * 사용 가능) ─────────────
const corsOptions = {
  origin: 'https://celcious0.github.io',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

// 프리플라이트 응답
router.options('*', cors(corsOptions));
// 모든 API 경로에 CORS 헤더 추가
router.use(cors(corsOptions));

router.use(bodyParser());

// 인증 미들웨어 (OPTIONS는 위에서 처리되기 때문에 여기서는 GET/POST만 검사)
router.use((req, res, next) => AuthService.verifyToken(req, res, next));

router.use('/nickname', checkNicknameRouter);

router.get('/userdata', (req, res) => {
  res.json({ user: { uid: req.uid } });
});
router.get('/test', (req, res) => {
  res.json({ user: { uid: req.uid } });
});
router.get('/inventory', InventoryCtrl.get);
router.post('/equip', InventoryCtrl.equip);
router.post('/unequip', InventoryCtrl.unequip);

export default router;
