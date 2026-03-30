import { useRef, useState } from "react";
import { userMentionSearch } from "../hooks/userMentionSearch";
import type { Users } from "../types/users";

interface Props {
  placeholder?: string;
  rows?: number;
  inputType?: "textarea" | "input";
}

export default function UserMention({ placeholder, rows = 6, inputType = "textarea" }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const { users, open, highlight, onKeyDown, applyUser } = userMentionSearch(value, setValue, ref);

  const sharedProps = {
    ref,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
    onKeyDown,
    placeholder,
    style: { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" },
  };

  return (
    <div style={{ position: "relative", maxWidth: 1000 }}>
      {inputType === "textarea" ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input {...sharedProps} type="text" />
      )}

      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "100%",
          marginTop: 8, background: "white", border: "1px solid #ddd",
          borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden", zIndex: 9999,
        }}>
          {users.map((u, idx) => (
            <div
              key={u.id}
              onMouseDown={(e) => { e.preventDefault(); applyUser(u); }}
              style={{
                padding: "10px 12px", cursor: "pointer",
                background: idx === highlight ? "#f3f4f6" : "white",
                display: "flex", justifyContent: "space-between", gap: 8,
              }}
            >
              <div style={{ fontWeight: 700 }}>@{u.username}</div>
              <div style={{ color: "#666", fontSize: 12 }}>{u.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}