import React from "react";
import "./WatchlistCard.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { user, useAuth0 } from "@auth0/auth0-react";
import Chip from "@mui/material/Chip";

function WatchlistCard(props) {
  const { user } = useAuth0();

  const deleteFromWatchlist = () => {
    axios
      .request({
        method: "delete",
        url: `http://localhost:5000/watchlist/delete/${user.email}/${props.titleOfMovie}`,
        data: {
          title: props.titleOfMovie,
        },
      })
      .then(() => {
        props.updateWatchlist();
      });
  };

  return (
    <div>
      <div className="inside-container-card">
        <img className="img-card" src={props.image} />
        <span className="movie-info">
          <h3 className="movie-title">{props.titleOfMovie}</h3>
          <p className="release">(20{Math.floor(Math.random() * 10 + 20)})</p>
          <br></br>
          <p className="title-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent
            tristique magna sit amet purus. Elementum tempus egestas sed sed.{" "}
          </p>
        </span>
      </div>
      <Chip
        label="Remove"
        onClick={deleteFromWatchlist}
        onDelete={deleteFromWatchlist}
        deleteIcon={<DeleteIcon />}
        variant="outlined"
        style={{ position: "relative", bottom: "49px", left: "600px" }}
      />
    </div>
  );
}

export default WatchlistCard;
