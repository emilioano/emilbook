import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteUser, updateUser } from "../services/api";

import "./UserArea.css";

interface Props {
  onSuccess?: () => void;
}

export default function UserArea({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [isUpdating, setisUpdating] = useState(true);
  const { user, logout } = useAuth();
  const user_id = user?.user_id;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateUser(user_id!, {
        username,
        password: password || undefined,
        email: email || undefined,
      });
      setSuccess("User details updated!");
      onSuccess?.();
      navigate("/");
    } catch {
      setError("Failed to update user details!");
    }
  };

  const handleDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await deleteUser(user_id!);
      setSuccess("User is deleted!");
      logout();
      navigate("/");
    } catch {
      setError("Failed to delete user!");
    }
  };

  return (
    <div className="login-wrapper" onClick={() => navigate("/")}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <h2>{isUpdating ? "Update user details!" : "Delete account!"}</h2>

        <form onSubmit={isUpdating ? handleUpdate : handleDeletion}>
          {isUpdating && (
            <>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="email">Email (optional):</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            {isUpdating ? "Update account!" : "Delete account!"}
          </button>
        </form>
        <button
          className="delete-button"
          onClick={() => {
            setisUpdating((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        >
          {isUpdating ? "Delete account" : "Back to the update page!"}
        </button>
      </div>
    </div>
  );
}
