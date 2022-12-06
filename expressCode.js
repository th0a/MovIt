//Start of functions needed to communicate frontend and backend

app.get('/movies/list', (req, res) => {
  // fetch movies from database
  // return to user as json
});

app.get('/watchlist/{user}', (req, res) => {
  // fetch movies from database for {user}
  // return to user as json
});

app.put('/watchlist/{user}/{movieId}', (req, res) => {
  // add {movieId} to {user}'s watchlist
});

app.delete('/watchlist/{user}/{movieId}', (req, res) => {
  // remove {movieId} from {user}'s watchlist
});
