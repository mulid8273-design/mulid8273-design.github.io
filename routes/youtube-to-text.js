import fs from "fs";
import path from "path";
import express from "express";
import OpenAI from "openai";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";

const router = express.Router();
const tmpDir = path.resolve("uploads");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

function downloadYouTubeAudio(url, outPath){
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: "highestaudio" });
    // pipe through ffmpeg to ensure mp3/wav container
    const ff = ffmpeg(stream)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", err => reject(err))
      .on("end", () => resolve(outPath))
      .save(outPath);
  });
}

function getAudioDuration(filePath){
  return new Promise((res, rej) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return rej(err);
      res(metadata.format.duration || 0);
    });
  });
}

function generateSrtFromText(text, durationSec){
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const wordsPerCaption = 8;
  let srt = "";
  let index = 1;
  let elapsed = 0;
  const totalWords = words.length;
  const secPerWord = durationSec / totalWords;

  for (let i = 0; i < words.length; i += wordsPerCaption) {
    const chunkWords = words.slice(i, i + wordsPerCaption);
    const start = elapsed;
    const end = start + secPerWord * chunkWords.length;
    const toTime = (t) => {
      const h = Math.floor(t / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      const ms = Math.floor((t % 1) * 1000);
      return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")},${String(ms).padStart(3,"0")}`;
    };
    srt += `${index}\n${toTime(start)} --> ${toTime(end)}\n${chunkWords.join(" ")}\n\n`;
    elapsed = end;
    index++;
  }
  return srt;
}

router.post("/", async (req, res) => {
  try {
    const { url, generate_srt } = req.body;
    if (!url) return res.status(400).json({ error: "URL 필요" });

    const id = Date.now();
    const outPath = path.join(tmpDir, `${id}_yt.mp3`);

    // 1) 다운로드 + 변환
    await downloadYouTubeAudio(url, outPath);

    // 2) OpenAI 전사
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(outPath),
      model: "gpt-4o-transcribe"
    });
    const text = transcription.text || "";

    // 3) SRT (요청 시)
    let srt = null;
    if (generate_srt) {
      const dur = await getAudioDuration(outPath);
      srt = generateSrtFromText(text, dur || 1.0);
    }

    // 삭제
    try { fs.unlinkSync(outPath); } catch (e) {}

    return res.json({ text, srt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "YouTube 변환 실패: " + (err.message || err) });
  }
});

export default router;
