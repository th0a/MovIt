import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isLoading } = useAuth0();

  if (!isLoading) {
    return <div>Logged in as {user.name}</div>;
  } else {
    return <div>Loading...</div>;
  }
};

export default Profile;
