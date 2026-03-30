import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Users } from "../types/users";
import { useDebouncedValue } from "./useDebounce";
import { searchUsers } from "../services/api";

function getActiveMention(text: string, cursorPos: number) {
  const before = text.slice(0, cursorPos);
  const atIndex = before.lastIndexOf("@");
  if (atIndex === -1) return null;
  const afterAt = before.slice(atIndex + 1);
  if (/\s/.test(afterAt)) return null;
  return { query: afterAt, startIndex: atIndex, endIndex: cursorPos };
}

export function userMentionSearch(
  value: string,
  setValue: (v: string) => void,
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>
) {
  const [users, setUsers] = useState<Users[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const cursorPos = inputRef.current?.selectionStart ?? value.length;
  const active = useMemo(() => getActiveMention(value, cursorPos), [value, cursorPos]);
  const debouncedQuery = useDebouncedValue(active?.query ?? "", 500);

  useEffect(() => {
    if (!active || debouncedQuery.length < 1) {
      setOpen(false);
      setUsers([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    searchUsers(debouncedQuery, controller.signal)
      .then((data) => {
        setUsers(data);
        setOpen(data.length > 0);
        setHighlight(0);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setUsers([]);
        setOpen(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, active]);

  function applyUser(u: Users) {
    if (!active) return;
    const before = value.slice(0, active.startIndex);
    const after = value.slice(active.endIndex);
    const inserted = `@${u.username} `;
    setValue(before + inserted + after);
    setOpen(false);
    setUsers([]);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const pos = (before + inserted).length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, users.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const u = users[highlight];
      if (u) applyUser(u);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return { users, open, highlight, onKeyDown, applyUser };
}