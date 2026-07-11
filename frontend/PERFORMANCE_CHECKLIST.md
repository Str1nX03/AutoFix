# 🚀 Performance Optimization Checklist

## Core Web Vitals Targets
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **FID** (First Input Delay): < 100ms  
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

## Testing & Monitoring

### Run Lighthouse Audit
```bash
# Using Chrome DevTools (F12 → Lighthouse)
# Target scores: 90+
```

### Monitor Core Web Vitals
```bash
# Using Vercel Analytics Dashboard
# or Google PageSpeed Insights
```

## Environment Variables
Add to `.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Pre-deployment Checklist
- [ ] Domain name updated everywhere
- [ ] SSL certificate configured
- [ ] CDN enabled for assets
- [ ] Image assets optimized
- [ ] Video transcoded to multiple formats
- [ ] Database connection pooling configured
- [ ] Rate limiting configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Analytics configured
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness verified
- [ ] Cross-browser tested

## Code Quality
```bash
# Run linter
npm run lint

# Format code
npm run format

# Check formatting without changes
npm run format:check
```

## Build & Deployment
```bash
# Analyze bundle size
npm run analyze

# Production build
npm run build

# Start production server
npm start
```

## Performance Tips

### 1. Image Optimization
- Use WebP/AVIF formats (already configured)
- Lazy load images below the fold
- Use Next.js Image component for all images

### 2. Code Splitting
- Already implemented with dynamic imports
- Monitor bundle size regularly
- Remove unused dependencies

### 3. Caching Strategy
- Static: 1 year (immutable)
- HTML: Cache-Control: no-cache
- API: no-cache

### 4. Font Loading
- Currently optimized with `display: "swap"`
- Consider subsetting fonts if needed

### 5. Video Optimization
- Changed to `preload="none"`
- Consider video lazy loading library
- Generate multiple formats (MP4, WebM)

## Monitoring Tools
- Google PageSpeed Insights
- Vercel Analytics
- Lighthouse CI
- Web Vitals library
- Sentry (error monitoring)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Slow LCP | Ensure Hero component is optimized, reduce critical CSS |
| Layout shifts | Add fixed dimensions to components |
| Slow video loading | Already fixed with lazy loading |
| High CLS | Verify all interactive elements have reserved space |
| SEO issues | Sitemap and robots.txt now in place |
