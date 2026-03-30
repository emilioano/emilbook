// src/pages/SearchPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Post } from "../types/posts";
import { searchPosts } from "../services/api";
import PostCard from "../components/PostCard";

import axios from "axios";

interface Props {
  onEvent: () => void;
}

export default function SearchPage({ onEvent }: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchPosts(query)
      .then((data) => {
        setPosts(data);
        setError("");
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Search failed");
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div style={{ paddingTop: "56px" }}>
      <p>
        Results for: <strong>{query}</strong>
      </p>
      {loading && <p>Searching...</p>}
      {error && <p>{error}</p>}
      {!loading && posts.length === 0 && <p>No posts found.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onEvent={onEvent} />
      ))}
    </div>
  );
}
