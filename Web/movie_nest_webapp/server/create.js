const sqlite3 = require('sqlite3');
db = new sqlite3.Database('database.db');

db.run(

    `
        CREATE TABLE IF NOT EXISTS user (
            user_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name               NVARCHAR(255) UNIQUE NOT NULL,
            user_email              NVARCHAR(255) UNIQUE NOT NULL,
            user_pass               NVARCHAR(255) NOT NULL,
            user_creation_date      DATETIME DEFAULT CURRENT_TIMESTAMP       
        );

        CREATE TABLE IF NOT EXISTS movie (
            mov_id                  INTEGER PRIMARY KEY AUTOINCREMENT, 
            mov_title               NVARCHAR(255),
            mov_description         NVARCHAR(255),
            mov_rel_year            INTEGER,
            mov_genre               NVARCHAR(255)
        );
   
        CREATE TABLE IF NOT EXISTS director (
            dir_id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            dir_fname               VARCHAR(255), 
            dir_lname               VARCHAR(255),
            dir_age                 INTEGER,
            dir_country             VARCHAR(255)
        );
            
        CREATE TABLE IF NOT EXISTS movie_directors (
            mov_id                  INTEGER,
            dir_id                  INTEGER,
            FOREIGN KEY(mov_id)     REFERENCES movie(mov_id),
            FOREIGN KEY(dir_id)     REFERENCES director(dir_id),
            PRIMARY KEY (mov_id, dir_id)

        );
        CREATE TABLE IF NOT EXISTS cast (
            cast_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            act_fname               NVARCHAR(255),
            act_lname               NVARCHAR(255),
            act_age                 INTEGER,
            act_country             NVARCHAR(255),
            mov_id                  INTEGER,
            FOREIGN KEY(mov_id)     REFERENCES movie(mov_id)

        );

        CREATE TABLE IF NOT EXISTS likes (
            like_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            mov_id                  INTEGER,
            user_id                 INTEGER,
            FOREIGN KEY(mov_id)     REFERENCES movie(mov_id),
            FOREIGN KEY(user_id)    REFERENCES user(user_id)
        );

        CREATE TABLE IF NOT EXISTS comments (
            com_id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            mov_id                  INTEGER,
            user_id                 INTEGER,
            comment_content         NVARCHAR(255),
            comment_date            DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(mov_id)     REFERENCES movie(mov_id),
            FOREIGN KEY(user_id)    REFERENCES user(user_id)
        );

    `, (err) => {
        if (err) {
            console.error("Error creating SQL tables: ", err.message());
        }
    }
);

