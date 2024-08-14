const express = require('express')
const app = express()
const path = require('path')
const port = 8080
const sqlite3 = require('sqlite3').verbose();  
var cors = require('cors')

const db = new sqlite3.Database('database.db');
app.use(express.json())
app.use(cors())



app.post('/movie_nest', (req, res) => {
    const {title, description, release_year, genre, director:{dir_first_name, dir_last_name}, cast:{cast_first_name, cast_last_name, }} = req.body;
    const date = Date.now();
})


app.get('/movie_nest', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
