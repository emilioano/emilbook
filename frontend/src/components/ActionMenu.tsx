import { useState, useRef, useEffect } from 'react';
import './ActionMenu.css';

interface Props {
    onEdit: () => void;
    onDelete: () => void;
}

export default function ActionMenu({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="action-menu" ref={ref}>
            <button className="action-menu-trigger" onClick={() => setOpen(prev => !prev)}>
                ···
            </button>
            {open && (
                <div className="action-menu-dropdown">
                    <button onClick={() => { onEdit(); setOpen(false); }}>Edit</button>
                    <button onClick={() => { onDelete(); setOpen(false); }} className="delete-btn">Delete</button>
                </div>
            )}
        </div>
    );
}