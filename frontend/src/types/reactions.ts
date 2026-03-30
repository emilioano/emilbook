export interface Reaction {
    id: number;
    user: User;
    post_id: number;
    comment_id: number | null;
    reaction: 'like' | 'love' | 'haha' | 'sad' | 'angry';
    created_at: string;
    updated_at: string | null;
}