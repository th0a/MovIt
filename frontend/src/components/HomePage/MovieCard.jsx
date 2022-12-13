import React, { useState, useEffect } from "react";
import "./MovieCard.css";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function MovieCard(props) {
  const { user } = useAuth0();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(
    (props) => {
      if (!user) return;
      axios.get(`https://backendmovit.duckdns.org/watchlist/${user.email}`).then((res) => {
        for (let i = 0; i < res.data.rows.length; i++) {
          if (props.title.text === res.data.rows[i].title) {
            setIsBookmarked(true);
          }
        }
      });
    },
    [user]
  );

  const handleAddBookmark = () => {
    setIsBookmarked(!isBookmarked);
    axios.request({
      method: "post",
      url: `https://backendmovit.duckdns.org/watchlist/add/${user.email}`,
      data: {
        imageURL: props.image.url,
        title: props.title.text,
      },
    });
  };

  const handleDeleteBookmark = () => {
    setIsBookmarked(!isBookmarked);
    axios.request({
      method: "delete",
      url: `https://backendmovit.duckdns.org/watchlist/delete/${user.email}/${props.title.text}`,
      data: {
        title: props.title.text,
      },
    });
  };

  return (
    <div className="card-container">
      {isBookmarked ? (
        <BookmarkAddedOutlinedIcon
          className="bookmark-add"
          fontSize="large"
          onClick={() => {
            handleDeleteBookmark();
          }}
        />
      ) : (
        <BookmarkAddOutlinedIcon
          className="bookmark-add"
          fontSize="large"
          onClick={() => {
            handleAddBookmark();
          }}
        />
      )}
      {props.image ? (
        <img className="card-img" src={props.image.url} alt="card" />
      ) : (
        <div className="card-no-img">No Image</div>
      )}
      <div className="movie-card-info">
        <h3 className="card-title-home">
          {props.title.text +
            " (20" +
            Math.floor(Math.random() * 10 + 20) +
            ")"}
        </h3>
        <span style={{ display: "flex", alignItems: "center" }}>
          <StarRoundedIcon style={{ color: "#FFD369" }} />
          {props.rating + ".0"}
        </span>
        <p style={{ marginTop: 0 }}>
          Lamet consectetur adipiscing elit ut aliquam purus sit amet luctus.
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
