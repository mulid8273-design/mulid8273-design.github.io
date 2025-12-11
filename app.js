import express from "express";
import path from "path";
import audioRoute from "./routes/audio-to-text.js";
import ytRoute from "./routes/youtube-to-text.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use("/api/audio-to-text", audioRoute);
app.use("/api/youtube-to-text", ytRoute);

// 헬스체크
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
