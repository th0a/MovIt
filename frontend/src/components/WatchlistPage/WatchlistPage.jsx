import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./WatchlistPage.css";
import WatchlistCard from "./WatchlistCard";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function WatchlistPage() {
  const { user } = useAuth0();

  const [movieData, setMovieData] = useState("");
  const [userWatchlist, setUserWatchlist] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios.get(`https://backendmovit.duckdns.org/watchlist/${user.email}`).then((res) => {
      setMovieData(res.data.rows);
    });
  }, [user]);

  useEffect(() => {
    setMovielistCards();
  }, [movieData]);

  const setMovielistCards = () => {
    if (!movieData || movieData.length === 0) return [];

    let list = movieData.map((movie) => {
      return (
        <WatchlistCard
          key={movie.id}
          image={movie.imageURL}
          titleOfMovie={movie.title}
        />
      );
    });

    setUserWatchlist(list);
  };

  return (
    <div className="watchlistpage-container">
      <NavBar />
      <div className="inside-container">
        <h1 className="watchlist-header">My Watchlist</h1>
        {userWatchlist}
      </div>
    </div>
  );
}

export default WatchlistPage;
