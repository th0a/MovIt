import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import NavBar from "../components/NavBar/NavBar";
import axios from "axios";

const Profile = () => {
  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!user) return;
    axios.get(`https://backendmovit.duckdns.org/watchlist/${user.email}`).then((res) => {
      console.log(res);
    });
  }, [user]);

  return (
    <div>
      <NavBar />
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div>Logged in as {user.picture}</div>
      )}
    </div>
  );
};

export default Profile;
