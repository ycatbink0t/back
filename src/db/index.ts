import * as sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const dbFile = process.env.DB || ":memory:";

const db = new sqlite.Database(dbFile);

export default db;
