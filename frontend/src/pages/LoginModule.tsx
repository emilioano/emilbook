import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register } from "../services/api";
import axios from "axios";

import "./LoginModule.css";

interface Props {
  onSuccess?: () => void;
}

export default function LoginModule({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await login(username, password);
      setSuccess("Login successful!");
      onSuccess?.();
      navigate("/");
    } catch {
      setError("Invalid username or password!");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register({ username, password, email: email || undefined });
      setSuccess("Account created! You can now login.");
      setIsRegistering(false);
    } catch (err: unknown) {
      // Catch if message contains "User already exists!".
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.detail === "User already exists!"
      ) {
        setError("User with this username already exists!");
      } else {
        setError("Registration failed!");
      }
    }
  };

  return (
    <div className="login-wrapper" onClick={() => navigate("/")}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <h2>{isRegistering ? "Create account" : "Login to continue!"}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {isRegistering && (
            <>
              <label htmlFor="email">Email (optional):</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            {isRegistering ? "Register" : "Login!"}
          </button>
        </form>
        <button
          className="toggle-button"
          onClick={() => {
            setIsRegistering((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "No account? Register"}
        </button>
      </div>
    </div>
  );
}
