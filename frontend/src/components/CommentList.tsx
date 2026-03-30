import type { Comment } from "../types/comments";
import CommentItem from "./CommentItem";

interface Props {
  comments: Comment[];
  onEvent: () => void;
}

export default function CommentList({ comments, onEvent }: Props) {
  if (comments.length === 0) return null;

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onEvent={onEvent} />
      ))}
    </div>
  );
}
