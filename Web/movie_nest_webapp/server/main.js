const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const db = new sqlite3.Database('serverdb.db');

const upload = multer({
    dest: 'images/', 
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

app.use(express.static(path.join(__dirname, '../web')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors({
    origin: 'http://localhost:8080', 
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../web/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '../web/about.html')));
app.get('/addMovies', (req, res) => res.sendFile(path.join(__dirname, '../web/addMovie.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../web/login.html')));
app.get('/movie-details', (req, res) => res.sendFile(path.join(__dirname, '../web/movie-details.html')));
app.get('/moviebrowser', (req, res) => res.sendFile(path.join(__dirname, '../web/moviebrowser.html')));
app.get('/movielibrary', (req, res) => res.sendFile(path.join(__dirname, '../web/movielibrary.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../web/signup.html')));

app.post('/addMovie', upload.single('image'), (req, res) => {
    const { title, description, release_year, genre, mov_directors, mov_cast } = req.body;
    const image = req.file ? req.file.filename : null;
    let directors = JSON.parse(mov_directors);
    let cast = JSON.parse(mov_cast);
    const comments = JSON.stringify([]);

    db.run(
        `INSERT INTO movies (title,description,release_year,genre,directors,cast,likes,image,comments,in_library) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, release_year, genre, JSON.stringify(directors), JSON.stringify(cast), 0, image, JSON.stringify(comments), 0]
    );
    res.send('Done! The values are inserted into the database.');
});

app.get('/movies', (req, res) => {
    db.all(`SELECT * FROM movies`, (err, rows) => res.json(rows));
});

app.get('/searchmovie', (req, res) => {
    const searchQuery = req.query.query;  
    let query = 'SELECT * FROM movies';
    let params = [];

    if (searchQuery) {
        query += ' WHERE title LIKE ?';
        params.push(`%${searchQuery}%`);
    }

    db.all(query, params, (err, rows) => res.json(rows));
});

app.post('/addmovietolibrary', (req, res) => {
    const { movieId } = req.body;
    db.run('UPDATE movies SET in_library = 1 WHERE id = ?', [movieId]);
    res.send('Movie added to library');
});

app.get('/showlibrarymovies', (req, res) => {
    db.all('SELECT * FROM movies WHERE in_library = 1', (err, rows) => res.json(rows));
});

app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    db.get('SELECT * FROM movies WHERE id = ?', [movieId], (err, row) => res.json(row || {}));
});

app.post('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const { title, description, release_year, genre, directors, cast } = req.body;

    db.run(
        `UPDATE movies SET title = ?, description = ?, release_year = ?, genre = ?, directors = ?, cast = ? WHERE id = ?`,
        [title, description, release_year, genre, JSON.stringify(directors), JSON.stringify(cast), movieId]
    );
    res.json({ message: 'Movie updated successfully' });
});

app.post('/removefromlibrary', (req, res) => {
    const { movieId } = req.body;
    db.run('UPDATE movies SET in_library = 0 WHERE id = ?', [movieId]);
    res.send('Movie removed from library');
});

app.post('/comment', (req, res) => {
    const { movieId, comment } = req.body;
    db.get('SELECT comments FROM movies WHERE id = ?', [movieId], (err, row) => {
        const currentComments = row.comments || '';
        const newComments = currentComments ? `${currentComments}|${comment}` : comment;
        db.run('UPDATE movies SET comments = ? WHERE id = ?', [newComments, movieId]);
        res.send('Comment added successfully');
    });
});

app.get('/comments/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    db.get('SELECT comments FROM movies WHERE id = ?', [movieId], (err, row) => {
        const comments = row.comments ? row.comments.split('|') : [];
        res.json({ comments });
    });
});

app.post('/toggleLike/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    db.get('SELECT likes FROM movies WHERE id = ?', [movieId], (err, row) => {
        let newLikes = row.likes + 1;
        if (row.likes > 0) newLikes = row.likes - 1;
        db.run('UPDATE movies SET likes = ? WHERE id = ?', [newLikes, movieId]);
        res.json({ likes: newLikes });
    });
});

app.use((req, res) => res.status(404).send('Page not found'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
