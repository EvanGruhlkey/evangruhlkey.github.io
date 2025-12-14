# Quoril Backend API

Backend server for Quoril - AI-powered buyer agent.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your settings (especially change JWT_SECRET in production!)

4. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Saved Searches
- `GET /api/searches` - Get all searches (requires auth)
- `POST /api/searches` - Create new search (requires auth)
- `PUT /api/searches/:id` - Update search (requires auth)
- `DELETE /api/searches/:id` - Delete search (requires auth)

### User Profile
- `PUT /api/user/profile` - Update profile (requires auth)
- `PUT /api/user/password` - Change password (requires auth)
- `DELETE /api/user/account` - Delete account (requires auth)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database

Currently uses JSON file storage in `backend/data/` directory.

For production, upgrade to a real database (PostgreSQL, MongoDB, etc.)

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Add rate limiting
- Add input validation/sanitization
- Use environment variables for sensitive data






