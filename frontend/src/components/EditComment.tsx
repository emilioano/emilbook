import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateComment } from '../services/api';
import type { Comment } from '../types/comments';
import axios from 'axios';

import "./EditComment.css"

interface Props {
    comment: Comment;
    onDone: () => void;
    onEvent: () => void;
}

export default function EditComment({ comment, onDone, onEvent }: Props) {
    const [text, setText] = useState(comment.comment);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await updateComment(comment.id, { comment: text });
            onDone();
            onEvent();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to update comment');
            }
        }
    };

    return (
        <form className="create-comment-form" onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                required
            />
            {error && <p className="error-message">{error}</p>}
            <div className="comment-form-actions">
                <button type="button" onClick={onDone}>Cancel</button>
                <button type="submit">Save</button>
            </div>
        </form>
    );
}