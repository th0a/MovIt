import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./WatchlistPage.css";
import WatchlistCard from "./WatchlistCard";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { fontWeight, textAlign } from "@mui/system";

function WatchlistPage() {
  const { user } = useAuth0();

  const [movieData, setMovieData] = useState("");
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    if (!user) return;
    callApi();
  }, [user]);

  const callApi = () => {
    setIsloading(false);
    axios.get(`https://backendmovit.duckdns.org/watchlist/${user.email}`).then((res) => {
      if (res.data.rows.length !== 0) {
        setMovieData(res.data.rows);
        setIsloading(false);
      } else {
        setMovieData([]);
        setUserWatchlist([]);
      }
    });
  };

  useEffect(() => {
    setMovielistCards();
  }, [movieData]);

  const updateResults = () => {
    callApi();
  };

  const setMovielistCards = () => {
    if (!movieData || movieData.length === 0) return [];

    let list = movieData.map((movie) => {
      return (
        <WatchlistCard
          key={movie.id}
          image={movie.imageURL}
          titleOfMovie={movie.title}
          updateWatchlist={updateResults}
        />
      );
    });

    setUserWatchlist(list);
  };

  return (
    <div>
      <NavBar />
      <h1
        style={{
          margin: "10px auto",
          fontSize: "40px",
          position: "relative",
          left: "25%",
        }}
      >
        My Watchlist
      </h1>
      <hr style={{ width: "50%", color: "black", margin: "0 auto" }} />
      <div className="watchlist-container">
        {isloading ? (
          <div
            class="watchlist"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Skeleton
              style={{
                borderRadius: "10px",
                position: "relative",
                marginBottom: "30px",
                top: "5px",
              }}
              variant="rectangular"
              animation="wave"
              width={700}
              height={250}
            />
            <Skeleton
              style={{
                borderRadius: "10px",
                position: "relative",
                marginBottom: "30px",
                top: "5px",
              }}
              variant="rectangular"
              animation="wave"
              width={700}
              height={250}
            />
          </div>
        ) : (
          <div className="watchlist">{userWatchlist}</div>
        )}
      </div>
    </div>
  );
}

export default WatchlistPage;
