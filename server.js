const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DIR = path.join(__dirname, "uploads");
fs.mkdirSync(DIR, {recursive:true});
const allowed = new Set(["video/mp4","video/webm","video/quicktime"]);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req,_file,cb) => cb(null,DIR),
    filename: (_req,file,cb) => cb(null,crypto.randomUUID()+path.extname(file.originalname).toLowerCase())
  }),
  limits:{fileSize:250*1024*1024,files:1},
  fileFilter: (_req,file,cb) => allowed.has(file.mimetype) ? cb(null,true) : cb(new Error("Only MP4, WebM, or MOV files are accepted."))
});
app.get("/api/health",(_req,res)=>res.json({ok:true}));
app.post("/api/videos",upload.single("video"),(req,res)=>{
  if(!req.file) return res.status(400).json({error:"Choose a video file."});
  res.status(201).json({id:req.file.filename,name:path.basename(req.file.originalname),downloadUrl:"/api/videos/"+encodeURIComponent(req.file.filename)});
});
app.get("/api/videos/:id",(req,res)=>{
  const id=path.basename(req.params.id);
  if(id!==req.params.id) return res.status(400).json({error:"Invalid video ID."});
  const file=path.join(DIR,id);
  if(!fs.existsSync(file)) return res.status(404).json({error:"Video not found."});
  res.download(file);
});
app.use((err,_req,res,_next)=>res.status(400).json({error:err.message||"Request failed."}));
app.listen(PORT,()=>console.log("Backend listening on "+PORT));
