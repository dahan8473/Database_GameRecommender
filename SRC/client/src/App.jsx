import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { GamesList } from "./components/gameslist";
import { Wishlist } from "./components/wishlist";
import { Profile } from "./components/profile";
import { Recommendations } from "./components/recommendations";
import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  const [authTab, setAuthTab] = useState("login");
  const [mainTab, setMainTab] = useState("games");

  return (
    <div className="app-container">
      <Toaster position="bottom-right" />
      <header>
        <h1>Video Game Recommender</h1>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </header>

      {/* Tabs for when a user isn't logged in */}
      <div style={{ display: isLoggedIn ? "none" : "block" }}>
        <Tabs.Root
          value={authTab}
          onValueChange={setAuthTab}
          defaultValue="login"
        >
          <Tabs.List className="auth-tabs">
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="login">
            <Login onLoginSuccess={handleLoginSuccess} />
          </Tabs.Content>

          <Tabs.Content value="register">
            <Register onRegisterSuccess={handleRegisterSuccess} />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Tabs for when a user is logged in */}
      <div style={{ display: isLoggedIn ? "block" : "none" }}>
        <Tabs.Root
          value={mainTab}
          onValueChange={setMainTab}
          defaultValue="games"
        >
          <Tabs.List className="main-tabs">
            <Tabs.Trigger value="games">Games</Tabs.Trigger>
            <Tabs.Trigger value="wishlist">My Wishlist</Tabs.Trigger>
            <Tabs.Trigger value="recommendations">Recommendations</Tabs.Trigger>
            <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="games">
            <GamesList userId={userId} onAddToWishlist={() => {}} />
          </Tabs.Content>
          <Tabs.Content value="wishlist">
            <Wishlist userId={userId} />
          </Tabs.Content>
          <Tabs.Content value="recommendations">
            <Recommendations userId={userId} />
          </Tabs.Content>
          <Tabs.Content value="profile">
            <Profile userId={userId} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default App;
