import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePost } from '../services/api';
import { userMentionSearch } from '../hooks/userMentionSearch';
import type { Post } from '../types/posts';
import axios from 'axios';

import "./EditPost.css"

interface Props {
    post: Post;
    onDone: () => void;
    onEvent: () => void;
}

export default function EditPost({ post, onDone, onEvent }: Props) {
    const [text, setText] = useState(post.post);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const ref = useRef<HTMLTextAreaElement>(null);
    const { users, open, highlight, onKeyDown, applyUser } = userMentionSearch(text, setText, ref);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await updatePost(post.id, { post: text });
            onDone();
            onEvent();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to update post');
            }
        }
    };

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <div style={{ position: 'relative' }}>
                <textarea
                    className="create-post-textarea"
                    ref={ref}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={3}
                    required
                />
                {open && (
                    <div className="mention-dropdown">
                        {users.map((u, idx) => (
                            <div
                                key={u.id}
                                onMouseDown={(e) => { e.preventDefault(); applyUser(u); }}
                                className={`mention-item ${idx === highlight ? 'mention-item--active' : ''}`}
                            >
                                <span className="mention-username">@{u.username}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="comment-form-actions">
                <button type="button" onClick={onDone}>Cancel</button>
                <button type="submit" className="post-button">Save</button>
            </div>
        </form>
    );
}