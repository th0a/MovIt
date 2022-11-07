import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./views/notfound";
import Profile from "./views/profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/header/header";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Header />
              </div>
            }
          />
          <Route path="/home" element={<Header />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isAuthenticated}>
                <Header />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
