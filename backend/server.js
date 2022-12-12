const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
let db = new sqlite3.Database("./MovIt.db");

//view specific user's watchlist
app.get("/watchlist/:userid", (req, res) => {
  let sql = `SELECT * FROM watchlist WHERE user_id="${req.params.userid}"`;

  db.all(sql, [], (err, rows) => {
    if (err != null) {
      console.log(err);
    }
    res.send({ rows });
  });
});

//add to watchlist
app.post("/watchlist/add/:userid", (req, res) => {
  let data = { ...req.params, ...req.body };
  let sql = `INSERT INTO watchlist (user_id, imageURL, title) VALUES ("${data.userid}", "${data.imageURL}", "${data.title}")`;
  console.log(sql);

  db.run(sql, (err) => {
    if (err) throw err;
    else console.log("success");
  });
});

//delete from watchlist
app.delete("/watchlist/delete/:userid/:title", (req, res) => {
  const user = req.params.userid;
  const movieTitle = req.body.title;
  let sql = `DELETE FROM watchlist WHERE user_id="${user}" AND title="${movieTitle}"`;
  console.log(sql);

  db.run(sql, (err) => {
    if (err) throw err;
    else console.log("success");
  });
  res.send("Deleted");
});

app.listen(80, function () {
  console.log("Listening on port 80");
});
// db.close();
