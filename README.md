# LifeTwin AI - Your Digital Twin & Life Decision Simulator

> A production-ready web application that combines AI digital twins with life decision simulation

## 🎯 Features

### 1. Digital Twin Creation & Training
- Chat-based training system
- Personality quiz mode
- Analyzes communication style, tone, vocabulary
- Tracks personality traits (risk tolerance, decision-making style, optimism, ambition)
- Progressive learning phases: basic → intermediate → advanced

### 2. Life Decision Simulator
- Simulate outcomes of major life decisions
- AI-generated 4 potential scenarios per decision
- Timeline projections:
  - Short-term (0-6 months)
  - Medium-term (6-18 months)
  - Long-term (18+ months)
- Risk and opportunity analysis
- Personalized recommendations based on user profile

### 3. Digital Twin Conversations
- Chat with your AI clone ("Talk as Me")
- Get advice from your AI mentor ("Advisor Mode")
- Simulate future conversations ("Future Self Mode")

### 4. User Authentication
- Email/password registration
- JWT-based authentication
- Persistent sessions

### 5. Modern UI/UX
- Dark theme with neon accents
- Glassmorphism design
- Smooth animations (Framer Motion)
- Responsive design
- Production-ready components

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 + React 18
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Charts:** Recharts
- **UI Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT + bcryptjs
- **AI API:** Groq (Mixtral 8x7B)
- **Validation:** Express-validator

### Database Models
- **User:** Profile, personality traits, training data
- **TrainingData:** Chat conversations, voice, quiz responses
- **Simulation:** Saved decision simulations
- **ChatConversation:** Chat history with AI twin

---

## 📦 Project Structure

```
AI twin/
├── frontend/                 # Next.js React app
│   ├── app/
│   │   ├── page.jsx         # Landing page
│   │   ├── layout.jsx       # Root layout
│   │   ├── dashboard/       # Dashboard page
│   │   ├── auth/            # Auth pages (login/register)
│   │   ├── twin/            # Digital twin training
│   │   ├── simulator/       # Life decision simulator
│   │   ├── chat/            # Chat with twin
│   │   ├── contexts/        # React contexts
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities (API client)
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── TrainingData.js
│   │   ├── Simulation.js
│   │   └── ChatConversation.js
│   ├── routes/             # API endpoints
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── twin.js
│   │   └── simulator.js
│   ├── middleware/         # Authentication middleware
│   ├── services/           # AI service (Groq API)
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud: MongoDB Atlas)
- Groq API key (free at https://groq.com)

### 1. Clone & Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Generate a random secret
# - GROQ_API_KEY: Your Groq API key
# - FRONTEND_URL: http://localhost:3000 (for CORS)

# Start backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd ../frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start frontend
npm run dev
# App runs on http://localhost:3000
```

### 3. Access the App
Open http://localhost:3000 in your browser

---

## 🔑 Environment Variables

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/lifetwin
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifetwin

# JWT
JWT_SECRET=your-super-secret-key-change-this

# AI API
GROQ_API_KEY=your-groq-api-key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/training-data` - Add training data
- `POST /api/user/analyze-personality` - Analyze personality

### Digital Twin Chat
- `POST /api/twin/chat` - Create new chat
- `GET /api/twin/chats` - Get all chats
- `GET /api/twin/chat/:chatId` - Get chat
- `POST /api/twin/chat/:chatId/message` - Send message

### Life Simulator
- `POST /api/simulator/simulate` - Generate simulation
- `GET /api/simulator/simulations` - Get all simulations
- `GET /api/simulator/simulation/:id` - Get simulation
- `PUT /api/simulator/simulation/:id/save` - Save simulation
- `POST /api/simulator/compare` - Compare simulations

---

## 💡 Usage Guide

### 1. **Register/Login**
- Create account on `/auth/register`
- Or login with demo credentials (if created)

### 2. **Train Your Digital Twin** (`/twin`)
- **Chat Mode:** Have natural conversations
  - The AI learns your communication style
  - Share your habits, preferences, values
- **Quiz Mode:** Answer personality questions
  - Risk tolerance assessment
  - Decision-making style
  - Career aspirations
- Click "Analyze Personality" after 3+ data points

### 3. **Simulate Life Decisions** (`/simulator`)
- Enter a decision: "Should I change careers?"
- Get 4 potential scenarios
- View timeline, risks, opportunities
- Save important simulations

### 4. **Chat with Your Twin** (`/chat`)
- **Twin Mode:** Talk to yourself
- **Advisor Mode:** Get mentor advice
- **Future Self:** Visualize future conversations

### 5. **View Dashboard** (`/dashboard`)
- Track progress
- Quick links to all features
- Training phase status

---

## 🤖 AI Integration

### Groq API
- **Model:** Mixtral 8x7B (fast, free tier available)
- **Features:**
  - Digital twin response generation
  - Life simulation scenarios
  - Personality analysis from training data
  - Personalized recommendations

### Example Response Flow
```
User Input → Groq API → AI Response → Save to DB → User sees result
```

---

## 📊 Sample Data

Demo account available for testing:
- **Email:** demo@lifetwin.ai
- **Password:** DemoPass123!
- **Status:** Pre-trained with sample data

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Protected routes with middleware
- ✅ CORS enabled
- ✅ Input validation
- ✅ Secure MongoDB queries

---

## 🚢 Deployment

### Deploy Backend (Vercel, Render, Railway)
```bash
cd backend
# Set environment variables in deployment platform
# Deploy main branch automatically
```

### Deploy Frontend (Vercel)
```bash
cd frontend
# Connect to Vercel
# Set NEXT_PUBLIC_API_URL to your backend URL
# Deploy automatically
```

### MongoDB Atlas (Free Tier)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to backend `.env`

---

## 🧪 Testing

### Test the complete flow:

1. **Register** → Create account
2. **Train Twin** → Add 5+ data points
3. **Analyze** → Click "Analyze Personality"
4. **Simulate** → Ask a decision question
5. **Chat** → Converse with your twin
6. **Save** → Save a simulation

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# MongoDB connection failed
# → Check MONGODB_URI, ensure MongoDB is running

# Groq API error
# → Verify GROQ_API_KEY is valid and has quota

# CORS error
# → Check FRONTEND_URL matches your frontend URL
```

### Frontend Issues
```bash
# API not connecting
# → Check NEXT_PUBLIC_API_URL in .env.local
# → Ensure backend is running on port 5000

# Login not working
# → Clear browser localStorage
# → Check backend is accessible
```

---

## 📈 Performance Optimizations

- ✅ Vercel Edge Network (frontend)
- ✅ MongoDB indexing on frequently queried fields
- ✅ API response caching (optional)
- ✅ Image optimization with Next.js
- ✅ Code splitting & lazy loading
- ✅ Database connection pooling

---

## 🛣 Future Enhancements

- [ ] Voice input (Web Speech API / Whisper)
- [ ] Text-to-speech responses (ElevenLabs)
- [ ] PDF export for simulations
- [ ] Comparison of multiple decisions
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Video avatar
- [ ] Advanced analytics dashboard
- [ ] Collaborative simulations
- [ ] Integration with calendar/planning tools

---

## 📝 License

MIT License - feel free to use for personal/commercial projects

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation in backend routes
3. Check browser console for errors
4. Ensure all dependencies are installed

---

## 🎉 Built With Love

Created as a hackathon-winning, production-ready application combining:
- Modern AI technology
- Beautiful user experience
- Practical life tools
- Clean, scalable code

**Your AI clone helping you choose your future.** 🚀
