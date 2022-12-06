/*
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
*/

const express = require('express');

const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const port = 3000
app.use(express.json()); //also need this
app.use(cors());


const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('/');

db.run('CREATE TABLE langs(name text)');

db.close();
/*
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:', (err) =>{
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});


db.serialize(() => {
  db.run('CREATE TABLE movies(
    movie_id int not null,
    title varchar(255),
    runtime varchar(255),
    rating int,
    primary key (movie_id)
)')
  const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (let i = 0; i < 10; i++) {
    stmt.run(`Ipsum ${i}`)
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    console.log(`${row.id}: ${row.info}`)
  })
})

db.close()
*/










app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Get list of movies from database
app.get('/movieList', (req, res) => {
 //res.send('movieList will go here')

});

  //fetch movies from database
  //return to user as json  
//});
//end of getting list of movies from database


//Get watchlist for user
app.get('/watchlist/{user}', (req, res) => {
  // fetch movies from database for {user}
  // return to user as json
  
  
});

//end of get watchlist for user



//add movie to a user watchlist
app.put('/watchlist/{user}/{movieId}', (req, res) => {
  // add {movieId} to {user}'s watchlist


});

//end of add movie to a user watchlist



//remove movie from a user watchlist 
app.delete('/watchlist/{user}/{movieId}', (req, res) => {
  // remove {movieId} from {user}'s watchlist


});

//end of remove movie from a user watchlist

app.listen(port,
  () => {
      console.log(`listen to port ${port}`);
})











