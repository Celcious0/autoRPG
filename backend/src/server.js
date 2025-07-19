import express from 'express';
import crypto   from 'crypto';
import fs       from 'fs/promises';
import path     from 'path';
import { fileURLToPath } from 'url';

import router from './routes/index.js';
import CONFIG from './config.js';

/* ──────── 경로 계산 (ZIP 구조 그대로) ──────── */
const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);            // …/backend/src
const projectRoot = path.resolve(__dirname, '..', '..'); // …/
const frontDir    = path.join(projectRoot, 'frontend');  // …/frontend
const distDir     = path.join(frontDir,   'dist');       // …/frontend/dist
const indexPath   = path.join(frontDir,   'index.html'); // …/frontend/index.html

const app = express();

/* API 라우터 (기존) */
app.use('/api', router);

/* dist 정적 파일(css·js) 서빙 */
app.use('/dist', express.static(distDir));

/* ───── 모든 GET → index.html + CSP nonce 주입 ───── */
app.get('*', async (req, res, next) => {
  try {
    const nonce = crypto.randomBytes(16).toString('base64');   // 128 bit 난수

    let html = await fs.readFile(indexPath, 'utf8');           // index.html 로드
    html = html.replace(/___NONCE___/g, nonce);                // 자리표시자 치환

    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        `style-src  'self' 'nonce-${nonce}'`,
        "img-src    'self' data:",
        "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://autorpg.onrender.com"
      ].join('; ')
    );

    res.type('html').send(html);
  } catch (err) {
    next(err);
  }
});

/* 글로벌 에러 핸들러 (기존) */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

/* 서버 시작 */
const PORT = CONFIG.port || 3000;
app.listen(PORT, () =>
  console.log(`🚀  Server running at http://localhost:${PORT}`)
);