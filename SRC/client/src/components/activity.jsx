import { useState, useEffect } from "react";
import axios from "axios";

export function Activity({ userId }) {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return; // Don't fetch if userId is null
        }

        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/users/${userId}/activity`
        );
        // Check if user has any activity
        if (
          response.data.total_ratings === 0 &&
          response.data.total_wishlist_items === 0
        ) {
          setActivity(null);
        } else {
          setActivity(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch activity data");
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  const formatRating = (rating) => {
    if (!rating) return "No ratings";
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? "No ratings" : numRating.toFixed(1);
  };

  if (loading) return <div>Loading activity...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!activity || !userId) {
    return (
      <div className="activity-container">
        <div className="welcome-message">
          <i className="fa-solid fa-gamepad welcome-icon"></i>
          <h2>Welcome to Gamefolio!</h2>
          <p>
            Start rating games and adding them to your wishlist to see your
            activity stats here.
          </p>
          <div className="suggested-actions">
            <p>Try these actions to get started:</p>
            <ul>
              <li>
                <i className="fa-solid fa-star"></i> Rate some games you've
                played
              </li>
              <li>
                <i className="fa-solid fa-heart"></i> Add games to your wishlist
              </li>
              <li>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Get
                personalized recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-container">
      <h2>Activity Summary</h2>
      <div className="activity-stats">
        <div className="stat-card">
          <i className="fa-solid fa-user"></i>
          <h3>Username</h3>
          <p>{activity.username}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-star"></i>
          <h3>Total Ratings</h3>
          <p>{activity.total_ratings}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-star-half-alt"></i>
          <h3>Average Rating Given</h3>
          <p>{formatRating(activity.average_rating)}</p>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-heart"></i>
          <h3>Wishlist Items</h3>
          <p>{activity.total_wishlist_items}</p>
        </div>
      </div>
    </div>
  );
}
