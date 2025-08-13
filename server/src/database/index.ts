import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

function resolveDbPath() {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) return './database.sqlite';
  try {
    if (envUrl.startsWith('file:')) {
      try {
        const url = new URL(envUrl);
        let pathname = decodeURIComponent(url.pathname);
        if (process.platform === 'win32' && pathname.startsWith('/')) {
          pathname = pathname.slice(1);
        }
        return pathname;
      } catch (e) {
        return envUrl.replace(/^file:/, '');
      }
    }
    return envUrl;
  } catch (e) {
    return './database.sqlite';
  }
}

let dbResolve: (db: sqlite3.Database) => void;
let dbReject: (err: Error) => void;
export const dbReady: Promise<sqlite3.Database> = new Promise((resolve, reject) => {
  dbResolve = resolve;
  dbReject = reject;
});

const dbPath = resolveDbPath();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message, err.stack);
    dbReject(err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database at', dbPath);
    dbResolve(db);
  }
});

export default db;