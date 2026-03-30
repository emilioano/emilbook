export interface Post {
    id: number;
    post: string;
    user: User;
    comments: Comment[];
    reactions: Reaction[];
    created_at: string;
    updated_at: string | null;
}