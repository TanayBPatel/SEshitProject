# Frontend Deployment Guide

This guide explains how to deploy the banking application frontend.

## Environment Configuration

The frontend uses environment variables to configure the backend API URL.

### Local Development
```bash
# .env (already configured)
VITE_API_URL=http://localhost:5001
PORT=3000
```

### Production Deployment
Update `.env.production` with your deployed backend URL:
```bash
# .env.production
VITE_API_URL=https://your-backend-api.com
PORT=3000
```

## Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Preview Production Build Locally

```bash
npm run preview
```

This runs a local server to preview the production build at `http://localhost:3000`

## Deployment Options

### Option 1: Netlify
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Add `VITE_API_URL` in Netlify dashboard

### Option 2: Vercel
1. Connect your GitHub repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables: Add `VITE_API_URL` in Vercel dashboard

### Option 3: Static Hosting (GitHub Pages, AWS S3, etc.)
1. Run `npm run build`
2. Upload the contents of `dist/` folder to your hosting service
3. Configure your web server to route all requests to `index.html` for SPA routing

## Important Notes

- **Backend Connection**: The frontend is currently configured to connect to `http://localhost:5001`
- **For Production**: Update `VITE_API_URL` in `.env.production` to your deployed backend URL
- **CORS**: Ensure your backend allows requests from your frontend domain
- **Environment Variables**: Never commit `.env` files to version control
- **API Proxy**: The Vite proxy is only used in development mode

## Files Structure

```
client/
├── .env                    # Development environment variables
├── .env.production         # Production environment variables
├── .env.example           # Template for environment variables
├── vite.config.js         # Vite configuration with proxy setup
├── dist/                  # Production build output (generated)
└── src/                   # Source code
```

## Testing the Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run preview
   ```

3. Open `http://localhost:3000` and verify all features work

## Troubleshooting

### API calls failing in production
- Check that `VITE_API_URL` is set correctly
- Verify CORS is configured on the backend
- Check browser console for specific error messages

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Routing issues (404 on refresh)
- Configure your hosting to redirect all routes to `index.html`
- For Netlify: Create `_redirects` file with `/* /index.html 200`
- For Vercel: Create `vercel.json` with rewrite rules

## Ready for Deployment

Your frontend is now configured and ready to deploy! 🚀

Current backend: `http://localhost:5001`
