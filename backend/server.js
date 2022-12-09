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
console.log("test");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000
app.use(express.json()); //also need this
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const md5 = require('md5');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./movies.db');

//delete movies.db every ewtime
db.serialize(() => {
db.run('create table movies(movie_id int not null,title varchar2(255),runtime varchar2(255),rating number,primary key (movie_id))');

db.run('create table watchList(user_id varchar2(20) not null,movie_id int,constraint mov_list primary key (user_id, movie_id),foreign key (movie_id) references movies(movie_id))');


db.run(`insert into movies (movie_id, title, runtime, rating) values (1, 'Batman', '2h 05m', 3);`);
db.run(`insert into movies (movie_id, title, runtime, rating) values (2, 'Pulp Fiction', '2h 45m', 5);`);
db.run(`insert into movies (movie_id, title, runtime, rating) values (3, 'Jaws', '2h 25m', 3);`);
db.run(`insert into movies (movie_id, title, runtime, rating) values (4, 'Back to the Future', '2h 15m', 4);`);
db.run(`insert into movies (movie_id, title, runtime, rating) values (5, 'Ghostbusters', '1h 55m', 4);`);



db.run(`insert into watchList (user_id, movie_id) values ('atv8', 1);`);
db.run(`insert into watchList (user_id, movie_id) values ('atv8', 3);`);
db.run(`insert into watchList (user_id, movie_id) values ('atv8', 5);`);
db.run(`insert into watchList (user_id, movie_id) values ('mai46', 1);`);
db.run(`insert into watchList (user_id, movie_id) values ('mai46', 4);`);
db.run(`insert into watchList (user_id, movie_id) values ('tl55', 2);`);
db.run(`insert into watchList (user_id, movie_id) values ('tl55', 5);`);

})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Get list of movies from database
app.get('/movieList', (req, res) => {
 //res.send('movieList will go here')
 //fetch movies from database
 //return to user as json 
 const sql = "select * from movies"
 const params = []
 db.all(sql, params, (err, rows) => {
   if (err) {
     res.status(400).json({"error":err.message});
     return;
   }
     res.json({
       "message":"success",
       "data":rows
     })
 });
 
});

 
//end of getting list of movies from database


//Get watchlist for user
//app.get('/watchlist/{user}', (req, res) => {
app.get('/watchList/:user_id', (req, res) => {

  // fetch movies from database for {user}
  // return to user as json
  //var sql = "select * from watchList where user_id = ?"
  var sql = "select * from movies where movie_id in ( select movie_id from watchList where user_id = ? )"
  var params = [req.params.user_id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});
//end of get watchlist for user


//add movie to a user watchlist
//app.put('/watchlist/{user}/{movieId}', (req, res) => {
app.put('/watchlist/:user_id/:movie_id', (req, res) => {
  // add {movieId} to {user}'s watchlist
  // need to select specific movie from movieList and insert into watchList
    var sql = "select * from movies where movie_id = ?"
    var params = [req.params.user_id]
    params = [req.params.movie_id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
//      console.log(row.movie_id);
//      res.json({
//        "message":"success",
//        "data":row
//      })

    //now need to insert row into watchList table with user_id
    var sql2 = "insert into watchList (user_id, movie_id) values (?, ?)"
    var params2 = [req.params.user_id, row.movie_id]
    //params2 = []
    db.run(sql2, params2, function(err, result){
      if (err){
        res.status(400).json({"error": err.message})
        return;
      }
      res.json({
        "message": "success",
        "data": result
      })
    });
  
  });
});

//end of add movie to a user watchlist



//remove movie from a user watchlist 
//app.delete('/watchlist/{user}/{movieId}', (req, res) => {
app.delete('/watchlist/:user_id/:movie_id', (req, res) => {
  // remove {movieId} from {user}'s watchlist
  //var sql = "DELETE FROM watchList WHERE user_id=? and movie_id = ?"
  //var params = [req.params.user_id, req.params.movie_id]
  db.run(
    'DELETE FROM watchList WHERE user_id=? and movie_id = ?',
    req.params.user_id, req.params.movie_id,
    function(err, result){
      if(err){
        res.status(400).json({"error": res.message})
        return;
      }
      res.json({"message":"deleted", changes: this.changes})
      
  });

});

//end of remove movie from a user watchlist

app.listen(port,
  () => {
      console.log(`listen to port ${port}`);
})


