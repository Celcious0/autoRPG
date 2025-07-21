import express from 'express';
import cors from 'cors';                                    // 추가
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './routes/index.js';
import CONFIG from './config.js';

const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const frontDir    = path.join(projectRoot, 'frontend');
const distDir     = path.join(frontDir,   'dist');
const indexPath   = path.join(frontDir,   'index.html');

const app = express();

// ── CORS 설정: 프론트엔드 Origin 허용 ────────────────────────────────
app.use('/api', cors({
  origin: 'https://celcious0.github.io',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}), router);

// ── 정적 파일 서빙 (/dist 이하) ────────────────────────────────────
app.use('/dist', express.static(distDir));

// ── SPA Fallback + CSP nonce 주입 ─────────────────────────────────
app.get('*', async (req, res, next) => {
  try {
    const nonce = crypto.randomBytes(16).toString('base64');
    let html = await fs.readFile(indexPath, 'utf8');
    html = html.replace(/___NONCE___/g, nonce);

    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        `style-src  'self' 'nonce-${nonce}'`,
        "img-src    'self' data:",
        "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://autorpg-qheg.onrender.com"
      ].join('; ')
    );

    res.type('html').send(html);
  } catch (err) {
    next(err);
  }
});

// ── 글로벌 에러 핸들러 ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = CONFIG.port || 3000;
app.listen(PORT, () =>
  console.log(`🚀  Server running at http://localhost:${PORT}`)
);
