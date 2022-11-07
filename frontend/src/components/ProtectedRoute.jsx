import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (!isLoggedIn && !isLoading) {
    <div>Redirecting to login page...</div>;
    loginWithRedirect();
  }

  return children;
};

export default ProtectedRoute;
