import express from 'express';
import { json as bodyParser } from 'body-parser';
import AuthService from '../services/AuthService.js';
import InventoryCtrl from '../controllers/InventoryController.js';
import checkNicknameRouter from './checkNickname.js';

const router = express.Router();

// ── JSON Body Parser ────────────────────────────────────────────
router.use(bodyParser());

// ── 인증 미들웨어 (Authorization 헤더 검사) ────────────────────
router.use((req, res, next) => AuthService.verifyToken(req, res, next));

// ── 실제 API 엔드포인트 ────────────────────────────────────────
router.get('/userdata', (req, res) => {
  res.json({ user: { uid: req.uid } });
});
router.get('/test', (req, res) => {
  res.json({ user: { uid: req.uid } });
});
router.get('/inventory', InventoryCtrl.get);
router.post('/equip', InventoryCtrl.equip);
router.post('/unequip', InventoryCtrl.unequip);

router.use('/nickname', checkNicknameRouter);

export default router;
