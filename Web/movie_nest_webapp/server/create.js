const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('serverdb.db');

db.run(`
    CREATE TABLE movies (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           NVARCHAR(255) NOT NULL,
    description     NVARCHAR(255),
    release_year    INTEGER,
    genre           NVARCHAR(255),
    directors       TEXT,
    cast            TEXT,
    likes           INTEGER DEFAULT 0,
    image           TEXT,
    comments        TEXT,
    in_library      INTEGER DEFAULT 0
);
`)


