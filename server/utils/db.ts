// server/utils/db.js
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool