# 🚀 LinkNova – Smart URL Management & Analytics Platform

LinkNova is a modern URL shortening and analytics platform that allows users to create branded short links, generate QR codes, manage link status, set expiration dates, and gain detailed insights into link performance.

---

## 📌 Problem Statement

Build a URL Shortener platform that:

- Creates shortened URLs
- Supports custom aliases
- Tracks click analytics
- Stores analytics data in a database
- Provides dashboard statistics
- Uses REST APIs
- Uses server-side redirects
- Supports secure authentication
- Uses environment variables
- Does not rely on external URL-shortening services

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes

---

## 🔗 URL Management

- Create Short URLs
- Custom Alias Support
- Unique Alias Validation
- Delete URLs
- View User URLs
- Search URLs
- Filter URLs
- Sort URLs

---

## ⏳ URL Expiry

Users can set expiration dates.

Example:

```json
{
  "originalUrl": "https://github.com",
  "customAlias": "github",
  "expiresAt": "2026-12-31"
}
```

Behavior:

- Active before expiry
- Automatically marked expired after expiry
- Redirect blocked after expiration

---

## 🎛 URL Status Control

Status Types:

- Active
- Disabled
- Expired

API:

```http
PATCH /api/url/:id/status
```

Example:

```json
{
  "status": "disabled"
}
```

---

## 📊 Analytics

Track:

- Total Clicks
- Device Type
- Browser
- Operating System
- Visit Timestamp

Example:

```json
{
  "browser": "Chrome",
  "os": "Windows",
  "device": "Desktop"
}
```

---

## 📈 Dashboard Statistics

Provides:

```json
{
  "totalUrls": 25,
  "totalClicks": 150,
  "activeUrls": 20,
  "expiredUrls": 2,
  "disabledUrls": 3
}
```

---

## 📱 Device Analytics

Track:

- Desktop
- Mobile
- Tablet

---

## 🌐 Browser Analytics

Track:

- Chrome
- Firefox
- Safari
- Edge

---

## 💻 Operating System Analytics

Track:

- Windows
- macOS
- Android
- iOS

---

## 🔳 QR Code Generation

Each shortened URL automatically generates a QR Code.

Features:

- QR Preview
- Download QR
- Mobile Scanning Support

---

# 🏗 System Architecture

```
Client (React)
      │
      ▼
REST APIs (Express.js)
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
MongoDB Atlas
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Framer Motion
- React Toastify

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Mongoose
- ua-parser-js

## Database

- MongoDB Atlas

---

# 📂 Project Structure

```
LinkNova
│
├── client
│   ├── src
│   ├── pages
│   ├── components
│   ├── context
│   ├── services
│   └── routes
│
├── server
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── validators
│   └── utils
│
└── README.md
```

---

# 🔌 REST API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## URL Management

### Create URL

```http
POST /api/url
```

### Get User URLs

```http
GET /api/url
```

### Delete URL

```http
DELETE /api/url/:id
```

### Update Status

```http
PATCH /api/url/:id/status
```

### URL Analytics

```http
GET /api/url/:id/analytics
```

### Device Analytics

```http
GET /api/url/:id/device-analytics
```

---

## Dashboard

### Dashboard Stats

```http
GET /api/dashboard/stats
```

---

## Redirect

```http
GET /:shortCode
```

Server-side redirect implementation.

---

# 🔒 Security

Implemented:

- Password Hashing
- JWT Authentication
- Protected Routes
- Ownership Verification
- Input Validation
- Environment Variables
- Secure MongoDB Connection

---

# ⚙ Environment Variables

Backend `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

BASE_URL=http://localhost:5000

NODE_ENV=development
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🚀 Installation

## Backend

```bash
cd server

npm install

npm run dev
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

---

# 📷 Screenshots

Add screenshots here:

### Landing Page

![Landing Page](./screenshots/landing.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Analytics

![Analytics](./screenshots/analytics.png)

### URL Management

![URL Management](./screenshots/url-management.png)

---

# ✅ Company Requirements Checklist

| Requirement | Status |
|------------|---------|
| MongoDB Database | ✅ |
| REST APIs | ✅ |
| Server-side Redirect | ✅ |
| Environment Variables | ✅ |
| Password Hashing | ✅ |
| Analytics Stored in Database | ✅ |
| Backend Validation | ✅ |
| JWT Authentication | ✅ |
| Custom Alias | ✅ |
| URL Expiry | ✅ |
| Status Control | ✅ |
| Device Analytics | ✅ |
| QR Code Generation | ✅ |
| Dashboard Statistics | ✅ |
| No External URL Shortener Used | ✅ |

---

# ❌ External URL Shortening Services

LinkNova does NOT use:

- Bitly
- TinyURL
- Rebrandly
- Any third-party URL shortening provider

All short URLs are generated, stored, redirected, and tracked entirely within the application.

---

# 🎯 Future Enhancements

- Geo Location Analytics
- Team Collaboration
- Link Password Protection
- Custom Domains
- Bulk URL Creation
- CSV Export
- Public Analytics Pages
- AI-powered Traffic Insights

---

# 👨‍💻 Author

**Ammar H**

Built for Hackathon Submission 🚀

---

## 🏆 Hackathon Information

This project is a part of a hackathon run by https://katomaran.com

Project Name: **LinkNova – Smart URL Management & Analytics Platform**

Built as a full-stack URL shortening and analytics solution featuring secure authentication, custom aliases, QR code generation, device analytics, URL expiry, status control, and dashboard insights.

--- 

Youtube Link : https://youtu.be/NtoRjmsVIzw



Loom Link : https://www.loom.com/share/611787bd1d28416da26ded7363a7e887
