import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "./images/background.jpg";
import "./LandingPage.css";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

function LandingPage() {
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated === true) {
      routeChange();
    }
  }, [isAuthenticated]);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/home`;
    navigate(path);
  };

  return (
    <body
      className="container"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <span className="text-group">
        <h1 className="title">Built For Movie Lovers</h1>
        <p className="greeting">
          MovIt offers a wide database of movies to browse and the ability to
          create your own customized watchlist.
        </p>
        <Button
          style={{ backgroundColor: "#FFD369", color: "#393E46" }}
          variant="contained"
          size="large"
          onClick={routeChange}
        >
          Let's get started!
        </Button>
      </span>
    </body>
  );
}

export default LandingPage;
