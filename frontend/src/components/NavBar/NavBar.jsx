import React from "react";
import "./NavBar.css";
import Logo from "./images/logo.png";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BookmarksRoundedIcon from "@mui/icons-material/BookmarksRounded";
import WatchlistPage from "../WatchlistPage/WatchlistPage";

const NavBar = () => {
  const { user } = useAuth0();

  return (
    <div className="navigation-bar">
      <div className="left-container">
        <img className="logo-img" src={Logo} alt="myLogo" />
      </div>
      <ul>
        <li>
          <a href="/home">
            <HomeRoundedIcon style={{ fontSize: 35 }} />
            Home
          </a>
        </li>
        <li>
          <a href="/watchlist">
            <BookmarksRoundedIcon style={{ fontSize: 30 }} />
            Watchlist
          </a>
        </li>
        <li>
          <div className="btn-group">
            <img src={user ? user.picture : null} className="user-img" />
            <LogoutButton />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
