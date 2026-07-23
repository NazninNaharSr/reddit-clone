# reddit-clone
<img width="295" height="295" alt="image" src="https://github.com/user-attachments/assets/b8177b24-0ed7-4336-a598-c1edd0e599a8" />

# Reddit Simulation — Backend API

Node.js + Express + MongoDB REST API for a Reddit-style app.

## Module 1: Auth (this module)

Implements user signup, login, and an authenticated "me" endpoint using
stateless JWTs and bcrypt-hashed passwords.

### Setup

```bash
cd server
npm install
cp .env.example .env      # then edit .env with a real JWT_SECRET
npm run dev               # starts with auto-reload on port 5000
```

You need MongoDB running locally (or a connection string to Atlas) — set it
in `MONGO_URI`.

### Endpoints

| Method | Path            | Auth | Body                          |
| ------ | --------------- | ---- | ----------------------------- |
| GET    | `/health`       | no   | —                             |
| POST   | `/api/auth/signup` | no | `{ username, email, password }` |
| POST   | `/api/auth/login`  | no | `{ email, password }`         |
| GET    | `/api/auth/me`     | yes | — (send `Authorization: Bearer <token>`) |

### Quick test with curl

```bash
# health
curl localhost:5000/health

# signup — returns a token
curl -X POST localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"naz","email":"naz@example.com","password":"secret123"}'

# use the token from signup/login:
curl localhost:5000/api/auth/me -H "Authorization: Bearer <TOKEN>"
```

## Roadmap

- [x] Module 1 — Auth (users, JWT, bcrypt)
- [ ] Module 2 — Communities (create, join, invite/approve)
- [ ] Module 3 — Posts + voting
- [ ] Module 4 — Comments + voting
- [ ] Module 5 — React frontend
- [ ] Module 6 — Containerize, multi-node cluster, load testing
