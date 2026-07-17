# 🚀 KECIA Deployment Guide for Vercel

## Overview
This guide covers deploying KECIA on Vercel with proper configuration for both frontend and backend.

---

## 📋 Pre-Deployment Checklist

- [ ] Node.js 18.x or higher installed locally
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub repository connected to Vercel
- [ ] Environment variables configured in Vercel dashboard
- [ ] Backend server running on a compatible platform (Railway, Render, Heroku)

---

## 🛠️ Deployment Options

### Option 1: Frontend Only on Vercel (Recommended for Most Users)

Deploy the frontend to Vercel and the backend to a separate service.

#### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Project Name: `kecia` (or your preference)
   - Framework: Leave blank (static site)
   - Root Directory: `./`
   - Build Command: `echo 'Build complete'`
   - Output Directory: `./`

3. **Environment Variables**
   Add in Vercel dashboard under Settings → Environment Variables:
   ```
   VITE_SERVER_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://kecia.vercel.app`)

#### Backend Deployment (Railway/Render/Heroku)

Choose one of the options below:

##### Railway
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository and the `server` directory
4. Add environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-frontend.vercel.app
   ```
5. Deploy

##### Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - Name: `kecia-server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `server`
5. Add environment variables
6. Deploy

##### Heroku (Note: Free tier deprecated, but paid plans available)
1. Create Procfile in server directory
2. Deploy using Heroku CLI

---

### Option 2: Full Stack on Vercel (Advanced)

Deploy both frontend and backend on Vercel using serverless functions.

**Note:** This requires refactoring Socket.io to work with Vercel's constraints.

---

## 🔌 Updating Frontend to Connect to Backend

After deploying the backend, update your frontend Socket.io connection.

**File: `js/main.js` or wherever Socket.io connects**

```javascript
// Get the server URL from environment or use default
const SERVER_URL = window.location.origin; // For same deployment
// OR
const SERVER_URL = process.env.VITE_SERVER_URL || 'https://your-backend-url.com';

// Initialize Socket.io
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

---

## ✅ Deployment Checklist

### Frontend (Vercel)
- [x] vercel.json configured
- [x] .vercelignore created
- [x] No server code in root directory
- [x] All static assets accessible

### Backend (External Service)
- [x] server/package.json has all dependencies
- [x] server/vercel.json or platform-specific config
- [x] Environment variables set (PORT, CLIENT_URL, NODE_ENV)
- [x] CORS configured for frontend domain
- [x] Health check endpoint accessible

---

## 🔐 Environment Variables Required

### Frontend (Vercel)
```
VITE_SERVER_URL=https://your-backend-domain.com
NODE_ENV=production
```

### Backend (Railway/Render/Heroku)
```
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
```

---

## 📝 Files Added for Deployment

- **vercel.json** - Root Vercel configuration
- **server/vercel.json** - Backend Vercel config (if needed)
- **.vercelignore** - Files to ignore during deployment
- **server/.env.example** - Example environment variables
- **DEPLOYMENT_GUIDE.md** - This file

---

## 🧪 Testing Deployment

1. **Frontend Health Check**
   ```bash
   curl https://your-frontend.vercel.app
   ```

2. **Backend Health Check**
   ```bash
   curl https://your-backend-domain.com/api/health
   ```

3. **Socket.io Connection Test**
   - Open browser console
   - Check if Socket.io connects without errors
   - Verify in backend logs: "🟢 User Connected"

---

## 🐛 Troubleshooting

### Issue: Socket.io Connection Fails
**Solution:**
- Check CLIENT_URL environment variable matches frontend domain
- Verify CORS is enabled in server.js
- Check browser console for specific error messages
- Ensure backend is running and accessible

### Issue: CORS Errors
**Solution:**
- Add frontend URL to `allowedOrigins` in server.js
- Verify CLIENT_URL environment variable is set
- Test with different transports (websocket, polling)

### Issue: 404 Errors on Frontend
**Solution:**
- Verify all files are deployed (check Vercel Deployments tab)
- Clear browser cache (Ctrl+Shift+Del)
- Check that path is correct in HTML file paths

### Issue: Backend Returns 500 Error
**Solution:**
- Check backend logs (Vercel, Railway, Render dashboard)
- Verify all dependencies are installed (`npm install`)
- Check environment variables are set
- Restart the deployment

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Socket.io Deployment Guide](https://socket.io/docs/v4/deployment/)
- [Express.js Production Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Railway Deployment Docs](https://docs.railway.app/)
- [Render Deployment Docs](https://render.com/docs)

---

## 🎉 Success!

Once deployed:
1. Visit your frontend URL
2. Test Socket.io connection
3. Join a room and verify communication works
4. Share your deployment URL with others!

**Made with ❤️ for KECIA**
