# Quoril - Full Stack Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done if you followed along)
npm install

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# In a NEW terminal, navigate to project root
cd ..

# Start the React frontend (if not already running)
npm start
```

Frontend will run on `http://localhost:3000`

## ✅ What's Working Now

### Authentication
- ✅ Sign up with email/password
- ✅ Sign in
- ✅ JWT token authentication
- ✅ Protected routes

### Saved Searches
- ✅ Create new searches
- ✅ View all searches
- ✅ Edit searches
- ✅ Delete searches
- ✅ Free tier limits (2 searches max)

### User Profile
- ✅ Update profile (name, email)
- ✅ Change password
- ✅ Delete account

## 📁 Project Structure

```
evangruhlkey.github.io/
├── backend/
│   ├── server.js          # Express server & API endpoints
│   ├── package.json       # Backend dependencies
│   ├── data/             # JSON file storage (auto-created)
│   │   ├── users.json
│   │   └── searches.json
│   └── README.md
│
├── src/
│   ├── components/       # React components
│   ├── services/
│   │   └── api.js       # API service (connects to backend)
│   └── ...
│
└── package.json          # Frontend dependencies
```

## 🔐 Environment Variables

### Backend (.env in backend/)
```
PORT=5000
JWT_SECRET=your-super-secret-key-change-in-production
```

### Frontend (.env in root)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user

### Searches
- `GET /api/searches` - Get all searches
- `POST /api/searches` - Create search
- `PUT /api/searches/:id` - Update search
- `DELETE /api/searches/:id` - Delete search

### User
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Delete account

## 🔄 Next Steps to Connect Frontend

The API service is ready at `src/services/api.js`. 

To use it in components:

```javascript
import { authAPI, searchesAPI, userAPI } from '../services/api';

// Example: Sign up
const handleSignup = async () => {
  try {
    const data = await authAPI.signup(name, email, password);
    console.log('User created:', data.user);
    // Redirect to dashboard
  } catch (error) {
    console.error('Signup failed:', error.message);
  }
};

// Example: Get searches
const fetchSearches = async () => {
  try {
    const searches = await searchesAPI.getAll();
    console.log('Searches:', searches);
  } catch (error) {
    console.error('Failed to fetch searches:', error.message);
  }
};
```

## 🗄️ Database

Currently using **JSON file storage** for simplicity.

For production, upgrade to:
- **PostgreSQL** (recommended for relational data)
- **MongoDB** (good for document-based data)
- **Firebase** (easy setup, real-time features)
- **Supabase** (PostgreSQL with real-time features)

## 🔒 Security Checklist for Production

- [ ] Change JWT_SECRET to a strong, random key
- [ ] Use HTTPS
- [ ] Add rate limiting
- [ ] Add input validation (joi, express-validator)
- [ ] Add CORS whitelist
- [ ] Use environment variables for all secrets
- [ ] Add logging (Winston, Morgan)
- [ ] Add monitoring (PM2, New Relic)
- [ ] Use a real database with connection pooling
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add 2FA (optional)

## 🐛 Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check if node_modules are installed: `cd backend && npm install`
- Check for typos in .env file

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Check browser console for CORS errors

### "User not authenticated" errors
- Make sure you're logged in
- Check if token is stored in localStorage
- Token might be expired (7 days default)

## 📞 Support

For issues, check:
1. Backend terminal for error logs
2. Browser console for frontend errors
3. Network tab for API request/response details






