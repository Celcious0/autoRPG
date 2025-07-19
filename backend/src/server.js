import express from 'express';
import crypto   from 'crypto';
import fs       from 'fs/promises';
import path     from 'path';
import { fileURLToPath } from 'url';

import router from './routes/index.js';
import CONFIG from './config.js';

/* ───────────────── 경로 계산 ───────────────── */
const __filename   = fileURLToPath(import.meta.url);
const __dirname    = path.dirname(__filename);            // …/backend/src
const projectRoot  = path.resolve(__dirname, '..', '..'); // …/ (루트)
const frontDir     = path.join(projectRoot, 'frontend');  // …/frontend
const distDir      = path.join(frontDir,   'dist');       // …/frontend/dist
const indexPath    = path.join(frontDir,   'index.html'); // …/frontend/index.html

const app = express();

/* API 라우터 (기존) */
app.use('/api', router);

/* 정적 자원( CSS·JS·IMG ) 서빙 */
app.use('/dist', express.static(distDir));

/* ───────── 모든 GET → index.html 반환 + CSP nonce 주입 ───────── */
app.get('*', async (req, res, next) => {
  try {
    /* 1) 128 bit 난수 → Base64 nonce */
    const nonce = crypto.randomBytes(16).toString('base64');

    /* 2) index.html 읽기 */
    let html = await fs.readFile(indexPath, 'utf8');

    /* 3) ___NONCE___ 자리표시자 → 실제 nonce 치환 */
    html = html.replace(/___NONCE___/g, nonce);

    /* 4) CSP 헤더 삽입 */
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        `script-src  'self' 'nonce-${nonce}'`,
        `style-src   'self' 'nonce-${nonce}'`,
        "img-src     'self' data:",
        "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://autorpg.onrender.com"
      ].join('; ')
    );

    /* 5) 전송 */
    res.type('html').send(html);
  } catch (err) {
    next(err);
  }
});

/* 글로벌 오류 핸들러 (기존) */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

/* 서버 가동 */
const PORT = CONFIG.port || 3000;
app.listen(PORT, () =>
  console.log(`🚀  Server running at http://localhost:${PORT}`)
);