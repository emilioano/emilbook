import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import axios from "axios";
import { userMentionSearch } from "../hooks/userMentionSearch";
import "./CreatePost.css";

interface Props {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: Props) {
  const [text, setText] = useState(() => {
    return localStorage.getItem("draft_post") ?? "";
  });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const { users, open, highlight, onKeyDown, applyUser } = userMentionSearch(
    text,
    setText,
    ref
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createPost({ post: text });
      localStorage.removeItem("draft_post");
      setText("");
      onPostCreated();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.setItem("draft_post", text);
        navigate("/login");
      } else {
        setErrorMsg("Failed to create post!");
      }
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div style={{ position: "relative" }}>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <textarea
          className="create-post-textarea"
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What's on your mind? Tag someone with @..."
          rows={3}
          required
        />
        {open && (
          <div className="mention-dropdown">
            {users.map((u, idx) => (
              <div
                key={u.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyUser(u);
                }}
                className={`mention-item ${
                  idx === highlight ? "mention-item--active" : ""
                }`}
              >
                <span className="mention-username">@{u.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <button type="submit" className="post-button">
        Post
      </button>
    </form>
  );
}
