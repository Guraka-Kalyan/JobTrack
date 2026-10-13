# JobTrack - Deployment Guide (Get a Free Live Link)

This guide walks you through deploying **JobTrack** to the cloud so you can put a public, live URL on your resume and LinkedIn!

---

## 🚀 Recommended Free Cloud Architecture

Because JobTrack is a 3-tier full-stack application (React + Spring Boot + MySQL), we deploy each tier to the industry standard free platforms:

```
[ Frontend: Vercel ]  --->  [ Backend: Render ]  --->  [ Database: Aiven / Railway ]
(https://jobtrack.vercel.app)  (https://jobtrack-api.onrender.com)  (Free Cloud MySQL)
```

---

## Step 1: Push Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new) called `JobTrack`.
2. Open your terminal in the root folder `e:\A_java projects\Job_Track` and run:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of JobTrack full-stack application"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/JobTrack.git
   git push -u origin main
   ```

---

## Step 2: Create a Free Cloud MySQL Database

We recommend **Aiven** (free MySQL tier) or **Railway**:

### Option A: Aiven (100% Free Forever Tier)
1. Sign up at [aiven.io](https://aiven.io/).
2. Create a **New Service** &rarr; Select **MySQL** &rarr; Choose the **Free Plan**.
3. Once provisioned, note down your credentials:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (e.g., `avnadmin`)
   - **Password**
   - **Database Name** (`defaultdb` or create `jobtrack_db`)

---

## Step 3: Deploy Backend on Render (Free)

1. Sign up at [render.com](https://render.com/) with GitHub.
2. Click **New +** &rarr; **Web Service**.
3. Connect your `JobTrack` GitHub repository.
4. Fill in the deployment settings:
   - **Name**: `jobtrack-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Java` (or `Docker`)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-1.0.0.jar`
5. In **Environment Variables**, add:
   - `DB_URL`: `jdbc:mysql://YOUR_AIVEN_HOST:PORT/defaultdb?sslmode=require`
   - `DB_USERNAME`: `avnadmin`
   - `DB_PASSWORD`: `your_aiven_password`
6. Click **Deploy Web Service**.
7. Once deployed, Render will give you your backend public URL, e.g.:
   `https://jobtrack-backend.onrender.com`

---

## Step 4: Deploy Frontend on Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com/) with GitHub.
2. Click **Add New...** &rarr; **Project**.
3. Import your `JobTrack` repository.
4. Configure Project settings:
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Framework Preset**: `Vite` (automatically detected).
5. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://jobtrack-backend.onrender.com/api` (your backend URL from Step 3).
6. Click **Deploy**!
7. Within 60 seconds, Vercel gives you your live link:
   **`https://jobtrack-yourname.vercel.app`**

---

## ⚡ Instant 2-Minute Demo Link (From Your Local Machine)

If you need a public URL **right now** to show someone or test on your phone without setting up cloud accounts, use **LocalTunnel** or **Cloudflare Tunnel**:

1. In a terminal, run:
   ```bash
   npx localtunnel --port 5173
   ```
2. It will instantly generate a public URL like:
   `https://clever-tiger-42.loca.lt`
3. Anyone on the internet can open that link and view your running application!
