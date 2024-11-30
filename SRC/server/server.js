const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DahanDahan123!@#", 
  database: "videogamereccomender", // Replace with your actual database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as ID", connection.threadId);
});

// API Endpoint for user login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing credentials" });
  }

  // Query the database
  const query = "SELECT user_id FROM user WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      // User authenticated
      res.json({
        success: true,
        message: "Login successful",
        user_id: results[0].user_id,
      });
    } else {
      // Invalid credentials
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
