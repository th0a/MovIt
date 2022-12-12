import React from "react";
import "./NavBar.css";
import Logo from "./images/logo.png";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BookmarksRoundedIcon from "@mui/icons-material/BookmarksRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const NavBar = () => {
  const { user, logout } = useAuth0();

  const signout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="navigation-bar">
      <img className="logo-img" src={Logo} alt="myLogo" />
      <ul>
        <li>
          <a
            href="/home"
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <HomeRoundedIcon style={{ fontSize: 35 }} />
            Home
          </a>
        </li>
        <li>
          <a
            href="/watchlist"
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
              top: "3px",
            }}
          >
            <BookmarksRoundedIcon style={{ fontSize: 30, lineHeight: "1" }} />
            Watchlist
          </a>
        </li>
        <li>
          <img src={user ? user.picture : null} className="user-img" />
        </li>
        <li>
          <LogoutRoundedIcon
            className="scale-icons"
            onClick={signout}
            style={{ color: "white" }}
          />
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
