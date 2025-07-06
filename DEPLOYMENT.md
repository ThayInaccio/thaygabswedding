# Deployment Guide for Your Wedding Website

This guide covers multiple ways to expose your wedding website to other users.

## 🚀 Quick Start - Local Network Sharing

### Option 1: Development Server (for testing)
```bash
# Get your network information
npm run network-info

# Start development server accessible from network
npm run dev:network
```

### Option 2: Production Build (recommended for sharing)
```bash
# Build and serve production version
npm run serve
```

## 🌐 Deployment Options

### 1. **Vercel (Recommended - Free)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and your site will be live at https://your-project.vercel.app
```

### 2. **Netlify (Free)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### 3. **GitHub Pages**
```bash
# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

### 4. **Firebase Hosting (Free)**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### 5. **Surge.sh (Free)**
```bash
# Install Surge
npm install -g surge

# Build and deploy
npm run build
surge dist
```

## 🔧 Advanced Configuration

### Environment Variables
Create a `.env` file for production settings:
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_TITLE=Our Wedding
```

### Custom Domain
Most platforms support custom domains:
- **Vercel**: Add domain in dashboard
- **Netlify**: Custom domain settings
- **Firebase**: Add domain in hosting settings

## 📱 Mobile Optimization

Your app already includes:
- ✅ PWA support (offline capability)
- ✅ Responsive design
- ✅ Optimized images
- ✅ Performance optimizations

## 🔒 Security Considerations

1. **HTTPS**: All major platforms provide SSL certificates
2. **Environment Variables**: Never commit sensitive data
3. **API Security**: Ensure your backend has proper CORS settings

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Build errors**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Network access issues**
   - Check firewall settings
   - Ensure devices are on same network
   - Try different ports if needed

## 📊 Performance Monitoring

```bash
# Run Lighthouse audit
npm run lighthouse
```

## 🎯 Recommended Workflow

1. **Development**: Use `npm run dev:network` for local testing
2. **Staging**: Deploy to Vercel/Netlify for testing
3. **Production**: Deploy to your chosen platform with custom domain

## 📞 Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Test locally first with `npm run serve` 