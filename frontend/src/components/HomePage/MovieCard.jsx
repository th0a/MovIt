import React, { useState } from "react";
import "./MovieCard.css";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function MovieCard(props) {
  const { user } = useAuth0();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleAddBookmark = () => {
    setIsBookmarked(!isBookmarked);
    axios.request({
      method: "post",
      url: `http://backendmovit.duckdns.org/watchlist/add/${user.email}`,
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
      url: `http://backendmovit.duckdns.org/watchlist/delete/${user.email}/${props.title.text}`,
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
        <img className="card-img" src={props.image.url} />
      ) : (
        <div className="card-no-img">No Image</div>
      )}
      <h3>{props.title.text}</h3>
      <br />
      <span>
        <StarRoundedIcon style={{ color: "#FFD369" }} />
        {props.rating + ".0"}
      </span>
    </div>
  );
}

export default MovieCard;
