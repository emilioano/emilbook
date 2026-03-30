import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Reaction } from "../types/reactions";
import { addReaction } from "../services/api";
import axios from "axios";

import "./ReactionBar.css";

interface Props {
  reactions: Reaction[];
  postId: number;
  commentId?: number;
}

const reactionEmojis: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😄",
  sad: "😢",
  angry: "😡",
};

export default function ReactionBar({ reactions, postId, commentId }: Props) {
  // Debug: console.log("ReactionBar props:", { postId, commentId });
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions);
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();
  let hideTimeout: ReturnType<typeof setTimeout>;

  const counts = localReactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleReaction = async (type: string) => {
    setShowPicker(false);
    try {
      const response = await addReaction({
        post_id: postId,
        comment_id: commentId ?? null,
        reaction: type,
      });

      if (response === null) {
        // Reaktion togs bort
        setLocalReactions((prev) => prev.filter((r) => r.reaction !== type));
      } else {
        // Kolla om användaren redan har en reaktion
        const existingIndex = localReactions.findIndex(
          (r) => r.id === response.id
        );
        if (existingIndex !== -1) {
          // Uppdatera befintlig reaktion
          setLocalReactions((prev) =>
            prev.map((r) => (r.id === response.id ? response : r))
          );
        } else {
          // Lägg till ny reaktion
          setLocalReactions((prev) => [...prev, response]);
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.setItem(
          "pending_reaction",
          JSON.stringify({
            post_id: postId,
            comment_id: commentId ?? null,
            reaction: type,
          })
        );
        navigate("/login");
      } else {
        console.error("Failed to add reaction");
      }
    }
  };

  return (
    <div className="reaction-bar">
      <div
        className="reaction-like-wrapper"
        onMouseEnter={() => {
          clearTimeout(hideTimeout);
          setShowPicker(true);
        }}
        onMouseLeave={() => {
          hideTimeout = setTimeout(() => setShowPicker(false), 300);
        }}
      >
        <button
          className="reaction-like-btn"
          onClick={() => handleReaction("like")}
        >
          👍 Like
        </button>
        {showPicker && (
          <div className="reaction-picker">
            {Object.entries(reactionEmojis).map(([type, emoji]) => (
              <button
                key={type}
                className="reaction-picker-btn"
                onClick={() => handleReaction(type)}
                title={type}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="reaction-counts">
        {Object.entries(counts).map(([type, count]) => (
          <span key={type} className="reaction-pill">
            {reactionEmojis[type]} {count}
          </span>
        ))}
      </div>
    </div>
  );
}
