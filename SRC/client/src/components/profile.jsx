import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import axios from "axios";

export function Profile({ userId }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {};

    // Only include fields that have values
    const username = formData.get("username");
    const password = formData.get("password");
    const age = formData.get("age");

    if (username) updates.username = username;
    if (password) updates.password = password;
    if (age) updates.age = parseInt(age);

    try {
      await axios.put(`http://localhost:3000/users/${userId}`, updates);
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
      setSuccess("");
    }
  };

  return (
    <Form.Root className="form-container" onSubmit={handleSubmit}>
      <h2>Update Profile</h2>

      <Form.Field name="username" className="form-field">
        <Form.Label>New Username</Form.Label>
        <Form.Control type="text" placeholder="Enter new username" />
      </Form.Field>

      <Form.Field name="password" className="form-field">
        <Form.Label>New Password</Form.Label>
        <Form.Control type="password" placeholder="Enter new password" />
      </Form.Field>

      <Form.Field name="age" className="form-field">
        <Form.Label>Update Age</Form.Label>
        <Form.Control type="number" placeholder="Enter new age" />
      </Form.Field>

      <Form.Submit className="submit-button">Update Profile</Form.Submit>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </Form.Root>
  );
}
