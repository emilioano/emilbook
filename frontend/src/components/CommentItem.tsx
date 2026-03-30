import type { Comment } from "../types/comments";
import ReactionBar from "./ReactionBar";
import CreateComment from "./CreateComment";
import { deleteComment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ActionMenu from "./ActionMenu";
import EditComment from "./EditComment";

import "./CommentItem.css";

import { useState } from "react";

interface Props {
  comment: Comment;
  isReply?: boolean;
  onEvent: () => void;
}

export default function CommentItem({
  comment,
  isReply = false,
  onEvent,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteComment(comment.id);
      onEvent();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className={`comment-item ${isReply ? "comment-reply" : ""}`}>
      <div className="comment-header">
        <div className="avatar avatar-sm">
          {comment.user.username[0].toUpperCase()}
        </div>
        <div>
          <span className="post-username">{comment.user.username}</span>
          <span className="post-time">
            {new Date(comment.created_at).toLocaleString()}
          </span>
          {comment.updated_at && (
            <span className="post-time">
              Updated at {new Date(comment.updated_at).toLocaleString()}
            </span>
          )}
        </div>
        {/* Debug <p>User id:{user?.user_id}</p><p>Comment user id: {comment.user.id}</p> */}
        {user?.user_id === comment.user.id && (
          <ActionMenu
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        )}
      </div>
      {isEditing ? (
        <EditComment
          comment={comment}
          onDone={() => setIsEditing(false)}
          onEvent={onEvent}
        />
      ) : (
        <p className="post-content">{comment.comment}</p>
      )}
      <div className="actions-bar">
        <ReactionBar
          reactions={comment.reactions}
          postId={comment.post_id}
          commentId={comment.id}
        />
        <button
          className="reply-button"
          onClick={() => setShowReplyForm((prev) => !prev)}
        >
          Reply
        </button>
        {showReplyForm && (
          <CreateComment
            postId={comment.post_id}
            parentCommentId={comment.id}
            onCommentCreated={() => setShowReplyForm(false)}
            onEvent={onEvent}
          />
        )}
      </div>
      {comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply
              onEvent={onEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
