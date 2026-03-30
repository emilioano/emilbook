import { useEffect, useState } from "react";
import { getAllPosts } from "../services/api";
import { Post } from "../types/posts";
import PostCard from "./PostCard";

import "./PostViewerModule.css";

interface Props {
  onEvent: () => void;
}

export function PostViewerModule({ onEvent }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts-container">
      {loading && <span className="loading-posts">Loading posts ...</span>}
      {error && (
        <span className="loading-posts">Error loading posts: {error}</span>
      )}
      {!posts && <span className="loading-posts">No posts found!</span>}
      {!loading && posts.length > 0 && (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onEvent={onEvent} />
          ))}
        </div>
      )}
    </div>
  );
}
