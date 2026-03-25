# Deployment Guide - LifeTwin AI

## Production Deployment

### Architecture Overview
```
Frontend (Vercel)  → API (Render/Railway)  → MongoDB Atlas
http/https            https               Cloud Database
```

---

## Prerequisites

- GitHub account (for storing code)
- Vercel account (for frontend)
- Render.com or Railway.app account (for backend)
- MongoDB Atlas account (for database)
- Groq API key

---

## Step 1: Push to GitHub

```bash
# Initialize git repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial LifeTwin AI commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/lifetwin-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend

### Option A: Render.com

1. **Go to Render.com, sign up**

2. **Create new Web Service:**
   - Connect GitHub repository
   - Select `/backend` as root directory
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add Environment Variables:**
   - MONGODB_URI (from MongoDB Atlas)
   - JWT_SECRET (generate strong secret)
   - GROQ_API_KEY
   - NODE_ENV: production
   - FRONTEND_URL: https://yourdomain.com

4. **Deploy** (auto-deploys on git push)

5. **Get backend URL:** `https://lifetwin-backend.onrender.com`

### Option B: Railway.app

1. **Connect GitHub repo to Railway**

2. **Add variables in Railway dashboard**

3. **Deploy** (auto-deploys)

### Option C: Heroku (Free tier removed, but template available)

---

## Step 3: Setup MongoDB Atlas

1. **Create account at mongodb.com/cloud/atlas**

2. **Create cluster:**
   - Free tier (M0)
   - Cloud Provider: AWS
   - Region: Closest to your users

3. **Create database user:**
   - Username: `lifetwin_prod`
   - Password: Generate strong password
   - Database: `lifetwin`

4. **Whitelist IP addresses:**
   - Allow 0.0.0.0/0 (allows all) for production
   - Or whitelist specific backend server IP

5. **Get connection string:**
   ```
   mongodb+srv://lifetwin_prod:PASSWORD@cluster.mongodb.net/lifetwin?retryWrites=true&w=majority
   ```

6. **Copy URL to backend as MONGODB_URI**

---

## Step 4: Deploy Frontend to Vercel

1. **Import from GitHub:**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Select framework: Next.js

2. **Configure:**
   - Root directory: `./frontend`
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Add environment variables:**
   - NEXT_PUBLIC_API_URL: `https://your-backend-url.app/api`
   - (No leading/trailing slashes in domain)

4. **Deploy** (auto-deploys on git push)

5. **Get frontend URL:** `https://lifetwin-ai.vercel.app`

---

## Step 5: After Deployment

### Update Backend FRONTEND_URL
```bash
# In your Render/Railway/Heroku backend settings:
FRONTEND_URL=https://lifetwin-ai.vercel.app
```

### Test the connection:
```bash
# Test backend
curl https://your-backend.app/api/health

# Check frontend loads
Visit https://your-frontend.app
```

### Seed production database (optional):
```bash
# Connect to backend SSH (if available) or:
# Temporarily modify seed.js to use your production DB
node seed.js
```

---

## Security Checklist

- [ ] JWT_SECRET changed and stored securely
- [ ] MongoDB user password strong
- [ ] .env never committed to git
- [ ] CORS configured for your domain only
- [ ] HTTPS enabled everywhere
- [ ] API rate limiting enabled
- [ ] Database backups enabled
- [ ] Environment variables use secrets manager
- [ ] Remove console.log statements
- [ ] Enable helmet/security headers

### Add Security Headers (backend):
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Performance Optimization

### Frontend (Vercel)
- Already optimized (CDN, auto-scaling)
- Enable:
  - Analytics: `vercel.json`
  - Image optimization
  - Automatic compression

### Backend
- Add caching headers:
```javascript
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  next();
});
```

### Database
- MongoDB Atlas automatic backups (free tier)
- Enable read replicas for redundancy
- Add indexes on frequently queried fields

---

## Monitoring & Logging

### Vercel
- Built-in analytics
- Error tracking
- Performance metrics

### Render/Railway
- Logs available in dashboard
- Add email alerts for errors

### MongoDB Atlas
- Performance Advisor
- Slow query logs
- Backup history

### Third-party options:
- Sentry.io (Error tracking)
- LogRocket (User session replay)
- DataDog (Full monitoring)

---

## Scaling Strategy

### If users exceed limits:

1. **Frontend:**
   - Already serverless and scales automatically
   - Add cache invalidation strategy

2. **Backend:**
   - Scale vertically (bigger instance): Render → Pro plan
   - Scale horizontally: Deploy multiple instances with load balancer
   - Implement caching layer (Redis) for session/user data

3. **Database:**
   - Upgrade from M0 to M2 cluster (paid)
   - Enable sharding for large datasets
   - Implement read replicas

---

## Continuous Deployment

### Auto-deploy on git push:
```bash
# Main branch → Production
# Dev branch → Staging (optional)
```

### GitHub Actions (optional):
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
      - run: npm run build
      # Auto-triggers Vercel/Render deployment
```

---

## Rollback Procedure

### If deployment breaks:

1. **Vercel:**
   - Click "Deployments" → Select previous version → Redeploy

2. **Render/Railway:**
   - Select previous deployment → Redeploy
   - Or push hotfix to GitHub

---

## Production Troubleshooting

### "Cannot connect to MongoDB"
```
- Check MONGODB_URI is correct
- Verify IP whitelist on MongoDB Atlas
- Test connection string locally first
```

### "API 502 Bad Gateway"
```
- Backend crashed: Check logs on Render/Railway
- Database connection failed: Check DB status
- Restart backend service
```

### "CORS errors in frontend"
```
- Verify backend FRONTEND_URL matches exactly
- Check for trailing slashes in URLs
- Restart backend after env var change
```

### "Slow queries"
```
- Add database indexes
- Enable query caching
- Upgrade database tier
```

---

## Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Render/Railway | Standard | $7-12/month |
| MongoDB Atlas | M0 (free) | $0-9/month |
| Groq API | Free | $0 |
| **Total** | | **~$30-40** |

*Can reduce to ~$10/month by using free tiers*

---

## Backup & Recovery

### MongoDB Atlas:
- Automatic daily backups (7-35 days retention)
- Manual snapshots available
- Point-in-time recovery (paid tier)

### Frontend code:
- GitHub is your backup
- Vercel keeps deployment history

### Database restore:
```javascript
// In emergency, seed database:
node backend/seed.js
```

---

## Next Steps After Deployment

1. **Test thoroughly:**
   - Register new account
   - Train digital twin
   - Run simulation
   - Save data

2. **Collect feedback:**
   - Share with beta users
   - Fix bugs
   - Improve performance

3. **Monitor:**
   - Check logs daily
   - Set up alerts
   - Track errors

4. **Scale:**
   - When hitting limits, upgrade tiers
   - Add more features based on feedback

---

## Custom Domain

### Connect custom domain to Vercel:
1. Purchase domain (godaddy.com, namecheap.com, etc)
2. Go to Vercel Project Settings → Domains
3. Add domain
4. Update DNS records (instructions provided by Vercel)
5. SSL enabled automatically

### Email support:
- For production email notifications, use SendGrid/Mailgun
- Update backend to send confirmation emails

---

## Support & Maintenance

### Regular maintenance:
- Update dependencies monthly (`npm update`)
- Monitor costs
- Review user feedback
- Plan new features

### Security updates:
- Apply critical patches immediately
- Review audit logs
- Update dependencies for security

### Performance review:
- Check database query performance
- Monitor API response times
- Analyze user sessions

---

## Success! 🚀

Your LifeTwin AI is now live in production!

**Frontend:** https://yourdomain.com
**Backend:** https://api.yourdomain.com/api/health
**Database:** MongoDB Atlas

Share with the world! 🌟
