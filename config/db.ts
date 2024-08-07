import mysql from 'mysql2/promise';
import { env } from 'process';

let connection;

try {
  // 환경 변수 확인
  if (!env.DB_USER || !env.DB_PASSWORD || !env.DB_HOST || !env.DB_PORT || !env.DB) {
    throw new Error('Missing required environment variables for database connection');
  }

  connection = mysql.createPool({
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT, 10),
    database: env.DB,
    connectionLimit: 4,
    queueLimit: 0,
    // keepAliveInitialDelay: 500, // 0 by default.
    // enableKeepAlive: true, // false by default.
  });

  // 연결 테스트
  connection
    .getConnection()
    .then((conn) => {
      console.log('Database connected successfully');
      conn.release();
    })
    .catch((err) => {
      console.error('Database connection failed', err);
    });
} catch (err) {
  console.error('Error setting up the database connection pool:', err);
}

export default connection;
