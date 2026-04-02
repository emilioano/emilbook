import { api } from "../config/axios";
import type { Post } from '../types/posts';
import type { User } from "../types/users";
import type { Reaction } from "../types/reactions";
import type { Comment } from "../types/comments";

export async function getAllPosts(): Promise<Post[]> {
  const response = await api.get("/posts");
  return response.data;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const response = await api.get('/posts/search', { params: { search_phrase: query } });
  return response.data;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get("/users");
  return response.data;
}
export async function searchUsers(
  q: string,
  signal?: AbortSignal
): Promise<User[]> {
  const params = new URLSearchParams({ search_phrase: q });
  const res = await api.get(`/users/search?${params.toString()}`, { signal });
  return res.data ?? [];
}

export async function createPost(data: { post: string }): Promise<Post> {
  const response = await api.post("/posts/", data);
  return response.data;
}

export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/posts/${postId}`);
}

export async function updatePost(
  post_id: number,
  data: { post: string }
): Promise<Post> {
  const response = await api.put(`/posts/${post_id}`, data);
  return response.data;
}

export async function createComment(data: {
  post_id: number;
  comment: string;
  parent_comment_id?: number;
}): Promise<Comment> {
  const response = await api.post("/comments/", data);
  return response.data;
}

export async function addReaction(data: {
  post_id: number;
  comment_id: number | null;
  reaction: string;
}): Promise<Reaction | null> {
  const response = await api.post("/reactions/", data);
  if (response.status === 204) return null;
  return response.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

export async function updateComment(
  commentId: number,
  data: { comment: string }
): Promise<Comment> {
  const response = await api.put(`/comments/${commentId}`, data);
  return response.data;
}

interface LoginResponse {
  user_id: number;
  username: string;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
}

export async function register(data: {
  username: string;
  email?: string;
  password: string;
}): Promise<void> {
  const response = await api.post("/users/", data);
  return response.data;
}

export async function updateUser(
  user_id: number,
  data: { username: string; email?: string; password?: string }
): Promise<void> {
  const response = await api.patch(`/users/${user_id}`, data);
  return response.data;
}

export async function deleteUser(user_id: number): Promise<void> {
  await api.delete(`/users/${user_id}`);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}
