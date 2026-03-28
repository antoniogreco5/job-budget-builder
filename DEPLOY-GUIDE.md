# Job Budget Builder — Full Deployment Guide

Complete walkthrough to get the app live on Vercel with GitHub, Google sign-in via Firebase, and PWA (Add to Home Screen) support.

---

## Prerequisites

Before you start, make sure you have:

- A **GitHub** account (github.com)
- A **Vercel** account (vercel.com) — free tier works, sign up with your GitHub account
- A **Google** account for Firebase (console.firebase.google.com)
- **Git** installed on your computer (check: open Terminal/Command Prompt and type `git --version`)

If you don't have Git installed, download it from https://git-scm.com/downloads and install with the default settings.

---

## PART 1 — Push to GitHub

### Step 1: Download and unzip the project

Download the `job-budget-builder.zip` file from this conversation and unzip it. You should see a folder called `job-budget-builder` with this structure inside:

```
job-budget-builder/
├── .gitignore
├── README.md
├── vercel.json
└── public/
    ├── index.html        ← the app
    ├── manifest.json     ← PWA config
    ├── sw.js             ← service worker (offline/install support)
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

### Step 2: Create a new GitHub repository

1. Go to **github.com** and click the **+** button (top right) → **New repository**
2. Repository name: `job-budget-builder` (or whatever you want)
3. Set it to **Private** (this is a client project)
4. **Do NOT** check "Add a README" or ".gitignore" — the project already has these
5. Click **Create repository**
6. You'll land on a page with setup instructions — leave this tab open, you'll need the URL

### Step 3: Push the code

Open **Terminal** (Mac) or **Command Prompt / PowerShell** (Windows). Then run these commands one at a time:

```bash
# Navigate into the unzipped project folder
cd ~/Downloads/job-budget-builder
# (adjust the path if you unzipped it somewhere else)

# Initialize Git
git init

# Add all files
git add .

# First commit
git commit -m "Job Budget Builder v3.0 - initial deploy"

# Connect to your GitHub repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/job-budget-builder.git

# Push
git branch -M main
git push -u origin main
```

If prompted for credentials, enter your GitHub username and a **Personal Access Token** (not your password). If you don't have a token yet:

1. Go to **github.com** → click your profile picture → **Settings**
2. Scroll down to **Developer settings** (left sidebar, very bottom)
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
4. Give it a name like "deploy token", check the **repo** scope, set expiration to 90 days
5. Click **Generate token** and copy it — use this as your password when Git asks

After pushing, refresh your GitHub repo page — you should see all your files.

---

## PART 2 — Deploy to Vercel

### Step 1: Import the project

1. Go to **vercel.com/new**
2. If you haven't connected GitHub yet, click **Continue with GitHub** and authorize Vercel
3. You'll see a list of your repos — find **job-budget-builder** and click **Import**

### Step 2: Configure (minimal)

On the configure page:

- **Framework Preset**: Leave as "Other" (Vercel will auto-detect from `vercel.json`)
- **Root Directory**: Leave blank (default `.`)
- **Build Command**: Leave empty
- **Output Directory**: Leave empty (the `vercel.json` file sets this to `public`)

Click **Deploy**.

### Step 3: Wait for the build

Vercel will build and deploy in about 15-30 seconds. When it's done you'll see a "Congratulations!" screen with a preview of your site.

Your app is now live at something like: `job-budget-builder-xxxx.vercel.app`

Click **Visit** to see it. You'll see the sign-in screen, but Google sign-in won't work yet — that's the next part.

### Step 4: (Optional) Custom domain

If you want a custom domain:

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Type your domain (e.g., `budget.yourclient.com`) and click **Add**
3. Vercel will give you DNS records to add at your domain registrar
4. Once DNS propagates (can take a few minutes to a few hours), it'll show a green checkmark

---

## PART 3 — Firebase Authentication Setup

This is the most involved part, but it's a one-time setup. Firebase Auth is free for Google sign-in with no user limits.

### Step 1: Create a Firebase project

1. Go to **console.firebase.google.com**
2. Click **Create a project** (or **Add project**)
3. Project name: `job-budget-builder` (or anything you want)
4. Google Analytics: you can disable this (not needed), or leave it on if you want — doesn't matter
5. Click **Create project** and wait for it to finish, then click **Continue**

### Step 2: Enable Google sign-in

1. In the Firebase console, click **Authentication** in the left sidebar (under "Build")
2. If it says "Get started", click that button
3. Go to the **Sign-in method** tab
4. Click **Google** in the provider list
5. Toggle the **Enable** switch on
6. **Project support email**: select your Google email from the dropdown
7. Click **Save**

### Step 3: Add your Vercel domain to authorized domains

Still in Authentication:

1. Go to the **Settings** tab (next to "Users" and "Sign-in method")
2. Scroll down to **Authorized domains**
3. Click **Add domain**
4. Add your Vercel URL **without https://** — for example: `job-budget-builder-xxxx.vercel.app`
5. If you set up a custom domain, add that too (e.g., `budget.yourclient.com`)
6. `localhost` should already be there (useful for local testing)

### Step 4: Register a web app and get your config

1. Go back to the **Project Overview** page (click the house icon in the top left of Firebase console)
2. In the center of the page, you'll see icons for iOS, Android, Web, etc. Click the **Web** icon (`</>`)
3. App nickname: `Budget Builder` (just a label)
4. **Do NOT** check "Firebase Hosting" — we're using Vercel
5. Click **Register app**
6. You'll see a code block with your Firebase config. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefg",
  authDomain: "job-budget-builder-abc12.firebaseapp.com",
  projectId: "job-budget-builder-abc12",
  storageBucket: "job-budget-builder-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

7. **Copy this entire config object.** You'll need it in the next step.
8. Click **Continue to console**

### Step 5: Add the config to your code

1. Open the file `public/index.html` in any text editor (VS Code, Sublime, TextEdit, Notepad — anything works)
2. Press **Ctrl+F** (or Cmd+F on Mac) and search for `YOUR_API_KEY`
3. You'll find this block near the bottom of the file (around line 1782):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. **Replace the entire block** with the real config you copied from Firebase. Make sure you replace all the `YOUR_` placeholders.

5. Save the file.

### Step 6: Push the update

Back in Terminal:

```bash
cd ~/Downloads/job-budget-builder

git add .
git commit -m "Add Firebase config"
git push
```

Vercel automatically detects the push and redeploys. Wait about 30 seconds, then visit your site — Google sign-in should now work.

---

## PART 4 — Testing Everything

### Test sign-in

1. Visit your Vercel URL
2. You should see the sign-in screen with the purple "Sign in with Google" button
3. Click it — a Google popup should appear
4. Sign in with any Google account
5. The app should load with your profile picture and a sign-out button in the header

**If sign-in fails** with a popup error:

- Double-check that your Vercel domain is listed in Firebase → Authentication → Settings → Authorized domains
- Make sure you copied the Firebase config correctly (no extra quotes, no missing commas)
- Check browser console (F12 → Console tab) for specific error messages

### Test PWA / Add to Home Screen

**On Android (Chrome):**

- Visit your site in Chrome
- After a few seconds, you should see a purple install banner at the bottom: "Install App — Add to your home screen for quick access"
- Tap **Install**
- The app icon appears on your home screen and opens in its own window (no browser bar)

If the banner doesn't appear automatically, tap the three-dot menu in Chrome → "Add to Home Screen" or "Install app"

**On iPhone (Safari):**

- Open your site in Safari
- Tap the **Share** button (the square with an arrow pointing up)
- Scroll down and tap **Add to Home Screen**
- Tap **Add**
- The app icon appears on your home screen

**On Desktop (Chrome):**

- Visit your site in Chrome
- You should see a small install icon in the address bar (right side)
- Or look for the install banner at the bottom of the page
- Click Install — the app opens in its own window

### Test offline

1. Open the app and sign in
2. Turn off your wifi/internet
3. Reload the page — it should still load from the service worker cache
4. Your saved jobs (localStorage) will still be there
5. Note: sign-in requires internet, so the auth screen won't work offline, but if you were already signed in the app shell loads

---

## Ongoing: Making Changes

After the initial deploy, the workflow for updates is simple:

1. Edit `public/index.html` (or any file in the project)
2. Save your changes
3. In Terminal:

```bash
cd ~/Downloads/job-budget-builder
git add .
git commit -m "Description of what you changed"
git push
```

4. Vercel auto-deploys within 30-60 seconds. Done.

---

## Quick Reference

| What | Where |
|------|-------|
| Your live site | `https://job-budget-builder-xxxx.vercel.app` (check Vercel dashboard) |
| Vercel dashboard | `vercel.com/dashboard` |
| Firebase console | `console.firebase.google.com` |
| GitHub repo | `github.com/YOUR_USERNAME/job-budget-builder` |
| The app code | `public/index.html` |
| PWA manifest | `public/manifest.json` |
| Service worker | `public/sw.js` |
| Firebase config location | Bottom of `public/index.html`, search for `firebaseConfig` |

---

## Troubleshooting

**"Sign-in popup closes immediately"** — Your Vercel domain isn't in Firebase's authorized domains list. Go to Firebase → Authentication → Settings → Authorized domains and add it.

**"The page is blank after deploy"** — Check that `vercel.json` is in the root of the repo (not inside `public/`). Also check that `public/index.html` exists.

**"Install banner doesn't show on Android"** — The browser needs to detect a valid PWA. Make sure `manifest.json` is accessible at your-site.com/manifest.json and the icons load. Chrome requires HTTPS (Vercel provides this automatically).

**"Changes aren't showing after push"** — Vercel caches aggressively. Try a hard refresh (Ctrl+Shift+R) or open in incognito. The service worker also caches — in Chrome DevTools → Application → Service Workers → click "Update on reload".

**"Git push asks for password and fails"** — GitHub no longer accepts passwords for HTTPS pushes. You need a Personal Access Token (see Part 1, Step 3 above).
