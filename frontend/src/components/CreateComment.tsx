import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComment } from "../services/api";
import axios from "axios";

import "./CreateComment.css"

interface Props {
  postId: number;
  parentCommentId?: number;
  onCommentCreated: () => void;
  onEvent: () => void;
}

export default function CreateComment({
  postId,
  parentCommentId,
  onCommentCreated,
  onEvent,
}: Props) {
  const [text, setText] = useState(() => {
    return localStorage.getItem("draft_post") ?? "";
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createComment({
        post_id: postId,
        comment: text,
        parent_comment_id: parentCommentId,
      });
      localStorage.removeItem("draft_post");
      setText("");
      onCommentCreated();
      onEvent();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.setItem("draft_post", text);
        navigate("/login");
      } else {
        setError("Failed to post comment");
      }
    }
  };

  return (
    <form className="create-comment-form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          parentCommentId ? "Write a reply..." : "Write a comment..."
        }
        rows={2}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <div className="comment-form-actions">
        <button type="submit" className="send-button">Send</button>
      </div>
    </form>
  );
}
