const sqlite3 = require('sqlite3')
db = new sqlite3.Database('database.db')

db.run(
    `
        CREATE TABLE IF NOT EXISTS movie (
        
        )
            
        CREATE TABLE IF NOT EXISTS director (
        
        )

        CREATE TABLE IF NOT EXISTS cast (
        
        )

        CREATE TABLE IF NOT EXISTS likes (
        
        )

        CREATE TABLE IF NOT EXISTS comments (
        
        )


    `
);

