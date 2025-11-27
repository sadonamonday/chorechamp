# Cloudflare Pages Deployment Guide

## Prerequisites
- A Cloudflare account
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your Git provider and authorize Cloudflare to access your repositories
4. Choose the `chorechamp` repository

### 2. Configure Build Settings

Set the following build configuration:

- **Project name**: `chorechamp` (or your preferred name)
- **Production branch**: `main` (or your default branch)
- **Framework preset**: `None` (or `Vite` if available)
- **Build command**: `npm run build`
- **Build output directory**: `client/dist`
- **Root directory**: (leave empty - use repository root)

> [!NOTE]
> The build script in the root `package.json` automatically navigates to the `client` directory, installs dependencies, and runs the build.

### 3. Configure Environment Variables

Add the following environment variables under **Settings** → **Environment Variables**:

| Variable Name | Value |
|---------------|-------|
| `VITE_SUPABASE_URL` | `https://teppzagymejhzzgycxmr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key from `.env` file |

> [!IMPORTANT]
> Make sure to add these variables for both **Production** and **Preview** environments.

### 4. Deploy

1. Click **Save and Deploy**
2. Cloudflare Pages will automatically build and deploy your application
3. Once complete, you'll receive a deployment URL (e.g., `https://chorechamp.pages.dev`)

## What's Been Configured

### Root Build Script
The root `package.json` includes a build script that:
1. Runs `npm ci` in the client directory to install dependencies (including Rollup's optional dependencies)
2. Runs the Vite build

```json
"scripts": {
  "build": "npm ci --prefix client && npm run build --prefix client"
}
```

> [!NOTE]
> Using `npm ci` instead of `npm install` ensures that Rollup's optional dependencies (like `@rollup/rollup-linux-x64-gnu`) are installed correctly, which is critical for the build to succeed on Cloudflare Pages' Linux environment.

### Client-Side Routing (`_redirects`)
The `_redirects` file ensures all routes are handled by React Router:
```
/*    /index.html   200
```

This prevents 404 errors when users refresh the page on nested routes like `/tasker/dashboard`.

### Security Headers (`_headers`)
The `_headers` file adds security headers to all responses:
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts access to sensitive browser features

### Environment Variables Protection
The `.gitignore` file has been updated to exclude:
- `.env`
- `.env.local`
- `.env.*.local`

This ensures your Supabase credentials are never committed to the repository.

## Post-Deployment Testing

After deployment, verify the following:

1. ✅ Home page loads correctly
2. ✅ Navigation works (test routes like `/tasks`, `/login`, `/register`)
3. ✅ Page refresh on nested routes doesn't return 404
4. ✅ Supabase authentication works
5. ✅ Security headers are present (check DevTools → Network tab)

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Cloudflare Pages
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to configure DNS

## Continuous Deployment

Cloudflare Pages automatically redeploys your site whenever you push changes to your Git repository. No additional configuration needed!

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Verify the build command and output directory are correct
- Check build logs for specific error messages

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Verify variables are set for the correct environment (Production/Preview)
- Redeploy after adding new environment variables

### 404 Errors on Routes
- Verify `_redirects` file exists in the `client/dist` directory after build
- Check that the file contains: `/*    /index.html   200`
