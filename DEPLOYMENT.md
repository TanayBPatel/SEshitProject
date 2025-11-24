# Deployment Guide

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

### Step 2: Configure Web Service
- **Name**: banking-app-backend (or any name)
- **Root Directory**: `server`
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables
Go to "Environment" tab and add:
```
PORT=5001
MONGODB_URI=mongodb+srv://admin:admin@clustercontact.tcgcpbt.mongodb.net/bankingapp?retryWrites=true&w=majority&appName=clustercontact
SECRET_KEY=supersecretkey123banking456app789
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

### Step 5: Copy Backend URL
After deployment, copy the URL (e.g., `https://banking-app-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### Step 2: Configure Project
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Add Environment Variable
In "Environment Variables" section, add:
```
VITE_API_URL=https://your-backend-url.onrender.com
```
Replace `your-backend-url.onrender.com` with your actual Render backend URL from Step 5 above.

### Step 4: Deploy
Click "Deploy" and wait for deployment to complete.

---

## After Deployment

### Test the Application
1. Visit your Vercel URL (e.g., `https://banking-app.vercel.app`)
2. Create a test user account
3. Test all features

### Create Admin User
SSH into Render or use Render Shell:
```bash
cd server
node create_admin.js
```

### Admin Login
- Email: `admin@bank.com`
- Password: `admin`

---

## Environment Variables Summary

### Backend (.env on Render)
```
PORT=5001
MONGODB_URI=mongodb+srv://admin:admin@clustercontact.tcgcpbt.mongodb.net/bankingapp?retryWrites=true&w=majority&appName=clustercontact
SECRET_KEY=supersecretkey123banking456app789
```

### Frontend (.env on Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Troubleshooting

### CORS Issues
- CORS is already configured to allow all origins (`*`)
- If issues persist, check browser console for specific error

### Backend Not Responding
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend API Calls Failing
- Verify `VITE_API_URL` is set correctly in Vercel
- Backend URL should start with `https://`
- No trailing slash in the URL

### MongoDB Connection Issues
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check username/password in connection string
- Ensure database name is included in the URI

---

## Local Development

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## Features Checklist
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ KYC Document Upload
- ✅ Account Balance Management
- ✅ Money Transfers with OTP
- ✅ Beneficiary Management
- ✅ International Transfers
- ✅ Bill Payments
- ✅ Loan Applications
- ✅ Admin Dashboard
- ✅ User Management
- ✅ Loan Approval/Collection
- ✅ Transaction Monitoring
- ✅ Analytics & Reports
