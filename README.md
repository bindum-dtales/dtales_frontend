<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DTales Tech - Professional CMS

A modern, production-ready Content Management System with blog and case study management.

## 🎉 Upload System - Supabase Storage

All uploads now use **Supabase Storage** for permanent, reliable storage.

### Quick Start for Deployment

1. **Read:** [`QUICK_DEPLOYMENT.md`](QUICK_DEPLOYMENT.md) - Step-by-step deployment guide
2. **Setup:** Configure Supabase Storage bucket
3. **Configure:** Set environment variables in Render
4. **Deploy:** Push and deploy!

### Documentation

- 📋 [`QUICK_DEPLOYMENT.md`](QUICK_DEPLOYMENT.md) - Complete deployment guide
- 📖 [`ENVIRONMENT_CONFIGURATION.md`](ENVIRONMENT_CONFIGURATION.md) - Comprehensive environment setup

## Run Locally

**Prerequisites:** Node.js, PostgreSQL, Supabase account


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Chrome Stale Cache Fix (Server/CDN)

If Chrome keeps loading old JS/CSS after deploy, use deployment-side cache control instead of app logic changes.

1. Configure Nginx to disable caching for `index.html`.
2. Keep hashed build filenames for static assets (already configured in `vite.config.ts`).
3. In Hostinger, clear both site cache and CDN cache.
4. Force a clean deploy by removing old files in `public_html` (or app folder), then upload fresh `dist/` files.
5. Test with a cache-bypass URL like `https://dtales.tech/?v=2`.
6. Restart Nginx if you manage a VPS: `sudo systemctl restart nginx`.

Use `nginx-cache-control.conf` in this repository as the baseline config snippet.
