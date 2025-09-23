import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function createDb() {
  // open the database
  const db = await open({
    filename: './feedback.db',
    driver: sqlite3.Database,
  });

  // Create the Feedback table if it doesn't exist
  await db.exec(`
      CREATE TABLE IF NOT EXISTS Feedback
      (
          id      INTEGER PRIMARY KEY AUTOINCREMENT,
          name    TEXT,
          item    TEXT,
          email   TEXT    NOT NULL,
          date    TEXT    NOT NULL,
          rating  INTEGER NOT NULL,
          message TEXT
      )
  `);

  console.log('Connected to the SQLite database and ensured Feedback table exists.');
  return db;
}