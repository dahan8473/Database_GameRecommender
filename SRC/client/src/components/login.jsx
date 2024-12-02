import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import axios from "axios";

export function Login({ onLoginSuccess }) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: formData.get("username"),
        password: formData.get("password"),
      });

      if (response.data.success) {
        const userId = response.data.user_id;
        console.log(userId);
        // Check if user is admin
        const adminCheck = await axios.get(
          `http://localhost:3000/admin/check/${userId}`
        );
        console.log(adminCheck.data.isAdmin);
        onLoginSuccess(userId, adminCheck.data.isAdmin);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Form.Root className="form-container" onSubmit={handleSubmit}>
      <h2>Login to Your Account</h2>

      <Form.Field name="username" className="form-field">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" required />
      </Form.Field>

      <Form.Field name="password" className="form-field">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" required />
      </Form.Field>

      <Form.Submit className="submit-button">Login</Form.Submit>

      {error && <div className="error-message">{error}</div>}
    </Form.Root>
  );
}
