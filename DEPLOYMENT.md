# Deployment Guide

## Local Development Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/life-evolution-system
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Cloud Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-evolution-system?retryWrites=true&w=majority
   ```

## Cloud Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   cd back-end
   heroku create your-app-name-backend
   ```

4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="your-super-secret-jwt-key"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://your-frontend-app.vercel.app"
   ```

5. Deploy:
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd front-end
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `VITE_API_URL` = `https://your-backend-app.herokuapp.com/api`

### Alternative: Railway Deployment (Backend)

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Set environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
   - `FRONTEND_URL`: Your frontend URL

### Alternative: Netlify Deployment (Frontend)

1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your backend API URL

## Testing the Deployment

1. Visit your deployed frontend URL
2. Try creating a user account
3. Test journal creation functionality
4. Verify data persistence by refreshing the page

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend environment
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **API Calls Failing**: Check that `VITE_API_URL` points to the correct backend URL
4. **Build Failures**: Ensure all dependencies are listed in package.json

### Debug Steps:

1. Check browser console for errors
2. Check backend logs (Heroku: `heroku logs --tail`)
3. Verify environment variables are set correctly
4. Test API endpoints directly using Postman or curl

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-evolution-system
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-app.herokuapp.com/api
```