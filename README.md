# Job Budget Builder v3.0

Professional job budgeting tool for SFX fabrication. PWA-enabled with Google sign-in.

## Quick Deploy

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial commit - Job Budget Builder v3.0"
git remote add origin https://github.com/YOUR_USERNAME/job-budget-builder.git
git branch -M main
git push -u origin main
```

### 2. Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo
3. Deploy (no build settings needed — `vercel.json` handles it)
4. Note your deploy URL (e.g., `job-budget-builder.vercel.app`)

### 3. Firebase Auth Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Go to **Authentication** → **Sign-in method** → Enable **Google**
4. Go to **Authentication** → **Settings** → **Authorized domains** → Add your Vercel domain
5. Go to **Project Settings** → **General** → Scroll to **Your apps** → Click web icon (`</>`)
6. Register the app and copy the config object
7. Open `public/index.html` and replace the placeholder config at the bottom:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

8. Commit and push — Vercel auto-deploys.

### 4. Custom Domain (Optional)

In Vercel dashboard → Settings → Domains → Add your domain.

## PWA / Add to Home Screen

The app is fully PWA-ready:
- **Android/Chrome**: Users see an install banner automatically, or use browser menu → "Add to Home Screen"
- **iOS/Safari**: Tap Share → "Add to Home Screen"
- Works offline after first load

## Tech Stack

- Single-file HTML/CSS/JS application
- Firebase Authentication (Google sign-in)
- Service Worker for offline PWA support
- localStorage for data persistence
- Deployed as static site on Vercel
