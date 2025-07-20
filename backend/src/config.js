import 'dotenv/config';

const firebaseServiceJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : {};

export default {
  port: process.env.PORT || 3000,

  firebase: {
    projectId: firebaseServiceJson.project_id,
    clientEmail: firebaseServiceJson.client_email,
    privateKey: firebaseServiceJson.private_key?.replace(/\\n/g, '\n')
  },

  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // 수정됨
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT || 3306,
    ssl: process.env.DB_SSL_CA
      ? {
          ca: process.env.DB_SSL_CA
        }
      : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};