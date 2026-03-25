# Quick Start Guide - LifeTwin AI

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 2: Configure Database

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/lifetwin`

### Step 3: Setup Environment Variables

**Backend (.env):**
```bash
cd backend
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/lifetwin
JWT_SECRET=your-super-secret-jwt-key-12345
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
```

**Frontend (.env.local):**
```bash
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

### Step 4: Get Groq API Key

1. Visit https://console.groq.com
2. Sign up (free)
3. Go to API Keys
4. Create new key
5. Copy and paste into backend `.env` as `GROQ_API_KEY`

### Step 5: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should show: LifeTwin Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should show: ▲ Next.js running on http://localhost:3000
```

### Step 6: Open App

Visit http://localhost:3000 in your browser

### Step 7: Create Account or Login

**Option A: Create New Account**
- Click "Get Started"
- Fill signup form
- Login

**Option B: Try Demo** (if database has demo data)
```bash
# Demo credentials:
# Email: demo@lifetwin.ai
# Password: DemoPass123!
```

---

## ✅ Verification Checklist

- [ ] MongoDB running
- [ ] Backend started (http://localhost:5000/api/health should show `{"status":"ok",...}`)
- [ ] Frontend running (http://localhost:3000 loads)
- [ ] Can create account or login
- [ ] Training page loads
- [ ] Can add training data (send message)
- [ ] Simulator page accessible

---

## 🔧 Common Issues & Fixes

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Error: MongooseError: Cannot connect...

# Solution:
# 1. Verify MONGODB_URI is correct
# 2. If using local: run 'mongod' first
# 3. If using Atlas: check connection string and IP whitelist
```

### Groq API Error
```bash
# Error: Error fetching from Groq...

# Solution:
# 1. Verify GROQ_API_KEY is correct
# 2. Check at console.groq.com
# 3. Ensure you have free tier quota
```

### CORS Error
```bash
# Frontend can't reach backend
# Error: Access to XMLHttpRequest blocked by CORS

# Solution:
# 1. Ensure backend FRONTEND_URL matches (http://localhost:3000)
# 2. Restart backend after changing .env
```

### Port Already in Use
```bash
# Port 5000 or 3000 already in use
# Error: listen EADDRINUSE: address already in use :::5000

# Solution:
# Change in backend/.env: PORT=5001
# Or kill process: lsof -ti:5000 | xargs kill -9
```

---

## 🎮 Quick Demo Flow

1. **Register** (or login with demo)
2. **Go to Twin Training** (/twin)
   - Type: "I love building software and helping people solve problems"
   - Click Send
   - Continue chatting (at least 3-5 messages)
3. **Click "Analyze Personality"**
   - Should see popup showing analysis
4. **Go to Simulator** (/simulator)
   - Ask: "Should I start my own tech startup?"
   - Wait for AI to generate scenarios
   - Click through scenarios to see details
5. **Go to Chat** (/chat)
   - Click "New Chat"
   - Talk to your digital twin
   - It should respond like your trained twin

---

## 📊 Project Structure

```
backend/
├── server.js              # Main entry point
├── models/                # MongoDB schemas
├── routes/                # API endpoints
├── services/              # AI logic (Groq)
├── middleware/            # Auth middleware
└── package.json

frontend/
├── app/page.jsx           # Landing page
├── app/dashboard/         # Dashboard
├── app/auth/              # Login/Register
├── app/twin/              # Training
├── app/simulator/         # Decision simulator
├── app/chat/              # Twin chat
├── components/            # Reusable components
├── lib/api.js             # API client
└── package.json
```

---

## 🚢 Next Steps

### Local Development
- Make changes to code
- Backend/Frontend auto-reload with `npm run dev`
- Test features

### Deploy to Production
1. **Backend:**
   - Deploy to Render/Railway/Heroku
   - Set environment variables in platform
   - Update FRONTEND_URL

2. **Frontend:**
   - Deploy to Vercel
   - Set NEXT_PUBLIC_API_URL to backend URL
   - Auto-deploys on git push

3. **Database:**
   - Use MongoDB Atlas (free tier)
   - Keep connection string in backend only

---

## 📞 Still Need Help?

1. Check terminal output for specific errors
2. Review error console (F12 in browser Dev Tools)
3. Verify all services running:
   ```bash
   # Test backend
   curl http://localhost:5000/api/health

   # Test frontend connectivity
   Visit http://localhost:3000
   ```
4. Check firewall isn't blocking ports

---

Happy coding! 🚀
