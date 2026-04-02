# emilbook

Emilbook is a guestbook/wall inspired by popular social networking apps. Read and write posts on a wall, react to posts, and manage your user account with full CRUD support.

**Live demo:** [emilbook.sjokvi.st](https://emilbook.sjokvi.st/)
**API docs:** [api-emilbook.sjokvi.st/docs](https://api-emilbook.sjokvi.st/docs)

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React             |
| Backend  | FastAPI (Python)  |
| Database | MySQL             |

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- MySQL 8.0+

## Getting Started

### 1. Database

In `backend/docs/` there is a database model and SQL script for setting up the database.

```bash
# Create the database using the provided script
mysql -u root < backend/docs/emilbook.sql
```

Then, inside the MySQL shell, create a dedicated user:

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON emilbook.* TO 'username'@'host';
```

### 2. Backend

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

Copy `.env_template` to `.env` and fill in your own parameters (database credentials, secret key, etc.).

```bash
cp .env_template .env
# Edit .env with your values
```

Start the backend:

```bash
python3 app.py
```

### 3. Frontend

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

Copy `.env_template` to `.env` and configure it (API URL, etc.).

```bash
cp .env_template .env
# Edit .env with your values
```

Run in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## License

This project is licensed under the [MIT License](LICENSE).
