import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        emilbook
      </div>
      <div>
        <div className="search-area">
          <form onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="search-field"
            />
            <button type="submit" className="search-field">
              Go!
            </button>
          </form>
        </div>
      </div>
      <div className="login-info">
        {user ? (
          <>
            <span className="login-text">
              <Link to="/userarea" className="user-area-link">
                {user.username}
              </Link>
            </span>
            <button onClick={logout} className="user-button">
              Logout!
            </button>
          </>
        ) : (
          <>
            <span className="login-text"></span>
            <button onClick={() => navigate("/login")} className="user-button">Login</button>
          </>
        )}
      </div>
    </header>
  );
}
