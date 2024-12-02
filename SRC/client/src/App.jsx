import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { GamesList } from "./components/gameslist";
import { Wishlist } from "./components/wishlist";
import { Profile } from "./components/profile";
import { Recommendations } from "./components/recommendations";
import { Activity } from "./components/activity";
import { AdminDashboard } from "./components/adminDashboard";
import { Hero } from "./components/hero";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLoginSuccess = (userId, isAdmin) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setIsAdmin(isAdmin);
    console.log(isAdmin);
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
        <div className="title-container">
          <img
            src="/src/assets/space-invaders.svg"
            alt="Space Invader"
            className="game-logo"
          />
          <h1 className="game-title">Gamefolio</h1>
        </div>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="logout-button"
            title="Logout"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        )}
      </header>

      {/* Show Hero only when not logged in */}
      {!isLoggedIn && <Hero />}

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
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
            <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
            {isAdmin && (
              <Tabs.Trigger value="admin">Admin Dashboard</Tabs.Trigger>
            )}
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
          <Tabs.Content value="activity">
            <Activity userId={userId} />
          </Tabs.Content>
          <Tabs.Content value="profile">
            <Profile userId={userId} />
          </Tabs.Content>
          {isAdmin && (
            <Tabs.Content value="admin">
              <AdminDashboard adminId={userId} />
            </Tabs.Content>
          )}
        </Tabs.Root>
      </div>
    </div>
  );
}

export default App;
