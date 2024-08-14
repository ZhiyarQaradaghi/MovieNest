const express = require('express')
const app = express()
const path = require('path')
const port = 8080
const sqlite3 = require('sqlite3').verbose();  
var cors = require('cors')

const db = new sqlite3.Database('Web/movie_nest_webapp/server/database.db');
app.use(express.json())
app.use(cors())



app.post('/add_movie', (req, res) => {
    const { title, description, release_year, genre, directors, cast } = req.body;

    db.run(
        `INSERT INTO movie (mov_title, mov_description, mov_rel_year, mov_genre) VALUES (?, ?, ?, ?)`,
        [title, description, release_year, genre],
        function (err) {
            if (err) {
                res.status(500).send('Error inserting movie data');
                return;
            }

            const mov_id = this.lastID;

            directors.forEach(director => {
                db.run(
                    `INSERT INTO director (dir_fname, dir_lname, dir_age, dir_country) VALUES (?, ?, ?, ?)`,
                    [director.fname, director.dir_lname, director.dir_age, director.dir_country],
                    function (err) {
                        if (err) {
                            res.status(500).send('Error inserting director data');
                            return;
                        }

                        const dir_id = this.lastID;

                        db.run(
                            `INSERT INTO movie_directors (mov_id, dir_id) VALUES (?, ?)`,
                            [mov_id, dir_id],
                            function (err) {
                                if (err) {
                                    res.status(500).send('Error matching movie and director IDs');
                                    return;
                                }
                            }
                        );
                    }
                );
            });

            cast.forEach(actor => {
                db.run(
                    `INSERT INTO cast(act_fname, act_lname, act_age, act_country, mov_id) VALUES(?,?,?,?,?)`,
                    [actor.act_fname, actor.act_lname, actor.act_age, actor.act_country, mov_id],
                    function (err) {
                        if (err) {
                            res.status(500).send('Error inserting cast data');
                            return;
                        }
                    }
                );
            });

            res.status(200).json({ message: 'Movie added successfully' });
        }
    );
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
