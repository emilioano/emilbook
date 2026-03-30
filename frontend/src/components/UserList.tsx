import { useEffect, useState } from "react";
import { User } from "../types/users";
import { getAllUsers } from "../services/api";

import './UserList.css'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading!</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="users-container">
      {users.map((user) => (
        <li key={user.id}>
          {user.id} - {user.username} - {user.email}
        </li>
      ))}
    </div>
  );
}
