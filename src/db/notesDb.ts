import * as SQLite from 'expo-sqlite';
import { Note } from '../types';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('notes.db');
    await initDb(dbInstance);
  }
  return dbInstance;
};

export const initDb = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      isFavorite INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
};

export const fetchNotesFromDb = async (): Promise<Note[]> => {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: number;
    title: string;
    body: string;
    isFavorite: number;
    createdAt: string;
    updatedAt: string;
  }>('SELECT * FROM notes ORDER BY updatedAt DESC');

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    isFavorite: row.isFavorite === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
};

export const insertNoteInDb = async (
  title: string,
  body: string
): Promise<number> => {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO notes (title, body, isFavorite, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)',
    [title, body, now, now]
  );
  return result.lastInsertRowId;
};

export const updateNoteInDb = async (
  id: number,
  title: string,
  body: string
): Promise<void> => {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?',
    [title, body, now, id]
  );
};

export const deleteNoteFromDb = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
};

export const toggleFavoriteInDb = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE notes SET isFavorite = CASE WHEN isFavorite = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
};

export const insertMultipleNotesInDb = async (
  posts: { title: string; body: string }[]
): Promise<void> => {
  const db = await getDb();
  const now = new Date().toISOString();
  for (const post of posts) {
    await db.runAsync(
      'INSERT INTO notes (title, body, isFavorite, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)',
      [post.title, post.body, now, now]
    );
  }
};
