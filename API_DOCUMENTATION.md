# LifeTwin AI - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "unique_username",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "unique_username"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "unique_username"
  }
}
```

---

## User Profile Endpoints

### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "unique_username",
  "firstName": "John",
  "lastName": "Doe",
  "trainingPhase": "intermediate",
  "trainingDataPoints": 5,
  "personalityTraits": {
    "riskTolerance": 7,
    "decisionMaking": "balanced",
    "optimism": 8,
    "ambition": 7
  },
  "communicationStyle": {
    "formality": "casual",
    "tone": "friendly",
    "vocabulary": ["awesome", "cool", "definitely"],
    "patterns": ["asks questions", "explains clearly"]
  }
}
```

### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Updated bio",
  "firstName": "Johnny",
  "preferences": {
    "career": ["tech", "startup"],
    "values": ["impact", "growth"]
  }
}
```

**Response (200):** Updated user object

### Add Training Data
```http
POST /user/training-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "chat",
  "content": "I love building software that helps people..."
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "type": "chat",
  "content": "I love building software that helps people...",
  "createdAt": "2024-03-26T10:30:00Z"
}
```

Valid types: `chat`, `voice`, `quiz`, `decision`

### Analyze Personality
```http
POST /user/analyze-personality
Authorization: Bearer <token>
```

**Requirements:**
- At least 3 training data points

**Response (200):**
```json
{
  "message": "Personality analysis completed",
  "analysis": {
    "communicationStyle": {
      "formality": "casual",
      "tone": "friendly and direct",
      "vocabulary": ["awesome", "definitely", "interesting"]
    },
    "personalityTraits": {
      "riskTolerance": 8,
      "decisionMaking": "analytical",
      "optimism": 8,
      "ambition": 9
    }
  },
  "user": { /* Updated user object */ }
}
```

---

## Digital Twin Chat Endpoints

### Create Chat Conversation
```http
POST /twin/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "mode": "twin",
  "title": "My First Chat"
}
```

**Valid modes:** `twin`, `advisor`, `future-self`

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "mode": "twin",
  "title": "My First Chat",
  "messages": [],
  "createdAt": "2024-03-26T10:30:00Z",
  "updatedAt": "2024-03-26T10:30:00Z"
}
```

### Get All Chats
```http
GET /twin/chats
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "mode": "twin",
    "title": "My First Chat",
    "createdAt": "2024-03-26T10:30:00Z",
    "updatedAt": "2024-03-26T10:35:00Z"
  }
]
```

### Get Specific Chat
```http
GET /twin/chat/:chatId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "mode": "twin",
  "title": "My First Chat",
  "messages": [
    {
      "role": "user",
      "content": "Hi, how are you?",
      "timestamp": "2024-03-26T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "I'm doing well! What's on your mind?",
      "timestamp": "2024-03-26T10:30:05Z"
    }
  ]
}
```

### Send Message to Twin
```http
POST /twin/chat/:chatId/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "What do you think about changing careers?"
}
```

**Response (200):**
```json
{
  "userMessage": "What do you think about changing careers?",
  "aiResponse": "Based on your profile and risk tolerance of 7/10, changing careers could be a good move if...",
  "conversation": { /* Updated conversation object */ }
}
```

---

## Life Simulator Endpoints

### Generate Simulation
```http
POST /simulator/simulate
Authorization: Bearer <token>
Content-Type: application/json

{
  "decision": "Should I move to a new city for a tech job?"
}
```

**Requirements:**
- User must have completed training (trainingPhase != 'incomplete')

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "decision": "Should I move to a new city for a tech job?",
  "scenarios": [
    {
      "title": "Successful Career Growth",
      "description": "You move and quickly advance in your tech career",
      "probability": 65,
      "confidence": 78,
      "timeline": {
        "shortTerm": "First 3 months: settle in, start new role, make connections",
        "mediumTerm": "Get promoted within 12 months, build strong network",
        "longTerm": "Leadership position, significant salary increase"
      },
      "risks": ["Initial stress leaving comfort zone", "Housing costs higher"],
      "opportunities": ["Career acceleration", "Network expansion", "New experiences"]
    }
  ],
  "personalizedInsights": "Given your high ambition (9/10) and analytical mindset...",
  "recommendation": "Scenario 1 aligns best with your profile...",
  "createdAt": "2024-03-26T10:30:00Z"
}
```

### Get All Simulations
```http
GET /simulator/simulations
Authorization: Bearer <token>
```

**Query params:**
- `limit`: Number of results (default: 50)

**Response (200):**
```json
[
  { /* Simulation object */ }
]
```

### Get Specific Simulation
```http
GET /simulator/simulation/:simulationId
Authorization: Bearer <token>
```

**Response (200):** Full simulation object

### Save Simulation
```http
PUT /simulator/simulation/:simulationId/save
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "savedAt": "2024-03-26T10:35:00Z",
  /* ... rest of simulation ... */
}
```

### Compare Simulations
```http
POST /simulator/compare
Authorization: Bearer <token>
Content-Type: application/json

{
  "simulationIds": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
}
```

**Response (200):**
```json
{
  "simulations": [ /* Array of simulations */ ],
  "comparison": {
    "bestOutcome": "Scenario X...",
    "averageConfidence": 82
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Consider adding in production:
```
- 100 requests/minute for authenticated users
- 10 requests/minute for publicly available endpoints
```

---

## Example Usage with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  --data '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Add Training Data
```bash
curl -X POST http://localhost:5000/api/user/training-data \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "chat",
    "content": "I love solving complex problems..."
  }'
```

### Generate Simulation
```bash
curl -X POST http://localhost:5000/api/simulator/simulate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  --data '{
    "decision": "Should I start a tech business?"
  }'
```

---

## Example Usage with JavaScript

```javascript
import { apiClient } from '@/lib/api';

// Register
const result = await apiClient.register({
  email: 'user@example.com',
  password: 'SecurePass123',
  username: 'username'
});

// Add training data
await apiClient.addTrainingData({
  type: 'chat',
  content: 'My experience and thoughts...'
});

// Generate simulation
const simulation = await apiClient.generateSimulation({
  decision: 'Should I change careers?'
});

// Chat with twin
const response = await apiClient.sendMessage(chatId, {
  content: 'Advice on my decision?'
});
```

---

## Webhooks (Future)

Consider adding webhooks for:
- New simulation created
- Personality analysis complete
- Training phase milestone reached

---

## Versioning

Current version: `v1` (implicit)
Future versions will use `/api/v2/...`

---

## Support

For API issues:
1. Check this documentation
2. Review error response messages
3. Check backend logs
4. Verify authentication token is valid
