export function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Welcome to Gamefolio</h1>
          <p>Your personal video game collection and recommendation platform</p>
          <div className="hero-features">
            <div className="feature">
              <i className="fa-solid fa-heart"></i>
              <span>Create your gaming wishlist</span>
            </div>
            <div className="feature">
              <i className="fa-solid fa-star"></i>
              <span>Rate and review games</span>
            </div>
            <div className="feature">
              <i className="fa-solid fa-robot"></i>
              <span>Get personalized AI recommendations</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <i className="fa-solid fa-gamepad"></i>
        </div>
      </div>
    </div>
  );
}
