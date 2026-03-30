import type { Post } from "../types/posts";
import CommentList from "./CommentList";
import ReactionBar from "./ReactionBar";
import CreateComment from "./CreateComment";
import ActionMenu from "./ActionMenu";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deletePost } from "../services/api";
import EditPost from "./EditPost";

import "./Postcard.css";

interface Props {
  post: Post;
  onEvent: () => void;
}

export default function PostCard({ post, onEvent }: Props) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    try {
      await deletePost(post.id);
      onEvent();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="avatar">{post.user.username[0].toUpperCase()}</div>
        <div>
          <span className="post-username">{post.user.username}</span>
          <span className="post-time">
            {new Date(post.created_at).toLocaleString()}
          </span>
          {post.updated_at && (
            <span className="post-time">
              Updated at {new Date(post.updated_at).toLocaleString()}
            </span>
          )}
        </div>
        {user?.user_id === post.user.id && (
          <ActionMenu
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        )}
      </div>
      {isEditing ? (
        <EditPost
          post={post}
          onDone={() => setIsEditing(false)}
          onEvent={onEvent}
        />
      ) : (
        <p className="post-content">{post.post}</p>
      )}
      <div className="actions-bar">
        <ReactionBar reactions={post.reactions} postId={post.id} />
        <button
          className="comment-button"
          onClick={() => setShowCommentForm((prev) => !prev)}
        >
          Comment
        </button>
        {showCommentForm && (
          <CreateComment
            postId={post.id}
            onCommentCreated={() => setShowCommentForm(false)}
            onEvent={onEvent}
          />
        )}
      </div>
      <CommentList comments={post.comments} onEvent={onEvent} />
    </div>
  );
}
