import type { User } from './users';
import type { Reaction } from './reactions';

export interface Comment {
    id: number;
    post_id: number;
    parent_comment_id: number | null;
    comment: string;
    user: User;
    reactions: Reaction[];
    created_at: string;
    updated_at: string | null;
    replies: Comment[];
}