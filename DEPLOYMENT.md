# Deployment Guide - PrepWise AI on Vercel

## Prerequisites
- GitHub account (✅ Already done)
- Vercel account (Sign up at https://vercel.com)
- MongoDB Atlas account (for production database)

## Step 1: Setup MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a new cluster (Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/prepwise-ai`)
6. Replace `<password>` with your actual password
7. Keep this connection string for Vercel environment variables

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **prepwise-ai**
   - Directory? **./  (press Enter)**
   - Override settings? **N**

5. **Set Environment Variables:**
```bash
vercel env add MONGODB_URI
# Paste your MongoDB Atlas connection string

vercel env add JWT_SECRET
# Enter a strong secret key (e.g., use a random string generator)

vercel env add NODE_ENV
# Enter: production
```

6. **Deploy to Production:**
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard (Easier)

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Git Repository:**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select: **ApekshaKhodave/PrepWise-AI**
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Other**
   - Root Directory: **./  (leave as is)**
   - Build Command: **npm run build**
   - Output Directory: **public**
   - Install Command: **npm install**

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A strong random secret (e.g., `your_super_secret_jwt_key_12345`) |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://prepwise-ai.vercel.app` (or similar)

## Step 3: Post-Deployment

1. **Test Your Deployment:**
   - Visit your Vercel URL
   - Try signing up / logging in
   - Test all features

2. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Environment Variables Reference

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepwise-ai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
PORT=5000
```

## Troubleshooting

### Issue: MongoDB Connection Error
**Solution:** 
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes `0.0.0.0/0` (allow all) in MongoDB Atlas
- Verify username and password are correct

### Issue: 404 Errors
**Solution:**
- Check `vercel.json` routing configuration
- Ensure all files are committed to GitHub
- Redeploy: `vercel --prod`

### Issue: Environment Variables Not Working
**Solution:**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Ensure all variables are set for "Production"
- Redeploy after adding variables

## Important Notes

⚠️ **Security:**
- Never commit `.env` file to GitHub (already in .gitignore)
- Use strong JWT_SECRET in production
- Enable MongoDB Atlas IP whitelist for better security

✅ **Features Working in Demo Mode:**
- All features work without MongoDB (using mock data)
- For full functionality, connect MongoDB Atlas

🚀 **Automatic Deployments:**
- Every push to `main` branch will auto-deploy
- Preview deployments for pull requests

## Support

For issues, check:
- Vercel Logs: Dashboard → Project → Deployments → View Logs
- MongoDB Atlas: Metrics & Logs
- GitHub Actions: If CI/CD is configured

---

**Your PrepWise AI app is now live! 🎉**
