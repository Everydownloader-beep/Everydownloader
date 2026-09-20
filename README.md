# everydownloader backend

This backend supports uploading and downloading video files the user owns or has permission to distribute. It does NOT fetch or scrape videos from YouTube or Instagram.

## Run
Requires Node.js 20+.
1. `npm install`
2. `npm start`
3. Check `http://localhost:3000/api/health`

## API
- `GET /api/health`
- `POST /api/videos` — multipart field `video`; MP4/WebM/MOV, maximum 250 MB.
- `GET /api/videos/:id` — download an uploaded file.

## Deployment
Deploy on a Node.js host; GitHub Pages cannot run Express. This demo uses local disk, which may be temporary on free hosts. Production needs persistent storage, authentication, rate limits, upload scanning, abuse reporting, and deletion/retention controls.
