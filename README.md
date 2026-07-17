# 📱 KECIA - Romantic Video Booth App

> A beautiful, feature-rich video booth application with real-time communication for couples. Built with WebRTC, Socket.io, and modern web technologies.

## ✨ Features

- 📷 **Real-time Video Chat** - WebRTC peer-to-peer video communication
- 📸 **Photo Capture** - Capture beautiful moments with countdown
- 🎨 **Frame Styles** - Multiple romantic frame designs (Classic, Gold, Blush, Neon, Minimal)
- 🌸 **Backgrounds** - Romantic background themes (Beach, Sunset, Sakura, Cafe)
- 🎥 **Gallery** - Save and manage captured photos
- ❤️ **Heart Reactions** - Send love reactions in real-time
- 🌙 **Dark Mode** - Eye-friendly dark theme toggle
- 📥 **Download** - Download captured photos as PNG
- 💾 **Local Storage** - Persistent frame preferences
- 🎯 **Room System** - Create and join chat rooms with unique codes

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start backend server
cd server
npm start
# Server runs on http://localhost:3000

# Start frontend (use Live Server or similar)
# Open http://localhost:5500 in browser
```

### Deploy to Vercel

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📂 Project Structure

```
KECIA/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All styling
├── js/
│   ├── main.js             # Core functionality
│   ├── call.js             # WebRTC video call logic
│   ├── camera.js           # Camera controls
│   ├── capture.js          # Photo capture logic
│   ├── countdown.js        # Countdown timer
│   ├── gallery.js          # Gallery management
│   ├── backgrounds.js      # Background handling
│   ├── download.js         # Download functionality
│   └── hearts.js           # Heart animations
├── assets/                 # Static assets
├── server/
│   ├── server.js           # Express + Socket.io server
│   ├── package.json        # Server dependencies
│   ├── .env                # Environment variables
│   └── .env.example        # Example env file
├── package.json            # Frontend dependencies
├── vercel.json             # Vercel configuration
├── .vercelignore           # Files to ignore
└── DEPLOYMENT_GUIDE.md     # Deployment instructions
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Client-side logic
- **WebRTC API** - Peer-to-peer video communication
- **Socket.io Client** - Real-time messaging

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - WebSocket communication
- **dotenv** - Environment variable management

---

## 📋 Requirements

- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Webcam permission
- Microphone permission (for calls)
- Stable internet connection

---

## 🎨 Customization

### Add Custom Backgrounds
Edit `js/backgrounds.js` to add new background options:
```javascript
{
  bg-card: '.data-bg="custom.jpg"',
  emoji: '🎨',
  name: 'Custom Background'
}
```

### Change Frame Styles
Edit `css/style.css` `.frame-preview.*` classes to customize frame designs.

### Modify Colors
Edit `css/style.css` color variables:
- Primary gradient: `#ff5ca8` to `#cc47f6`
- Text color: `#ffd4f4`
- Background: Adjust radial/linear gradients

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend (Optional)
```
VITE_SERVER_URL=https://your-backend-domain.com
```

---

## 📱 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome  | ✅ Full Support | Recommended |
| Firefox | ✅ Full Support | Full WebRTC support |
| Safari  | ✅ Supported | iOS 11+ required for WebRTC |
| Edge    | ✅ Full Support | Chromium-based |
| IE 11   | ❌ Not Supported | No WebRTC |

---

## 🚀 Deployment

### Recommended Setup
- **Frontend**: Vercel (static hosting)
- **Backend**: Railway, Render, or Heroku (Node.js hosting)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## 📊 Performance Tips

1. **Image Optimization** - Compress backgrounds for faster loading
2. **Lazy Loading** - Load gallery images on demand
3. **WebRTC Optimization** - Adjust video resolution based on connection
4. **Caching** - Browser caches CSS/JS for faster repeat visits

---

## 🐛 Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Camera not working | Allow browser camera permission |
| Call won't connect | Verify both users are in same room |
| Low video quality | Check internet speed, reduce resolution |
| Audio issues | Test microphone permissions |

---

## 📝 API Reference

### Socket.io Events

**Client to Server:**
- `join-room` - Join a video chat room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate
- `heart-reaction` - Send heart reaction
- `end-call` - End video call
- `leave-room` - Leave room

**Server to Client:**
- `room-joined` - Confirmation room was joined
- `room-full` - Room is at max capacity
- `partner-joined` - Partner joined room
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `heart-reaction` - Receive heart reaction
- `call-ended` - Call ended by partner
- `partner-left` - Partner left room

---

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Run local server: `cd server && npm start`
4. Open `index.html` in browser with Live Server

---

## 📄 License

This project is open source and available under the MIT License.

---

## ❤️ Credits

**Created by:** KENTLOYD ALBIOS

**Version:** 3.0.0

**Last Updated:** 2026

---

## 📞 Support

For issues or questions:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for troubleshooting
2. Review browser console for error messages
3. Verify all dependencies are installed
4. Check network connectivity

---

**Made with ❤️ for special moments**
