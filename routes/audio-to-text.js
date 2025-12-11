import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";

const router = express.Router();
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const name = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

function getAudioDuration(filePath){
  return new Promise((res, rej) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return rej(err);
      const d = metadata.format.duration || 0;
      res(d);
    });
  });
}

function generateSrtFromText(text, durationSec){
  // 간단한 비율 기반 SRT 생성: 텍스트를 단어 수 기준으로 같은 길이로 분할
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const wordsPerCaption = 8; // 캡션당 단어 수 (조정 가능)
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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "파일 없음" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const filePath = req.file.path;

    // OpenAI transcription 호출 (파일 전체)
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe" // 모델명 필요 시 변경
    });

    const text = transcription.text || "";

    // SRT 생성 요청이 있으면 간단 비율 기반 SRT 생성
    let srt = null;
    if (req.body.generate_srt === "true" || req.body.generate_srt === true) {
      try {
        const dur = await getAudioDuration(filePath);
        srt = generateSrtFromText(text, dur || 1.0);
      } catch (e) {
        console.warn("SRT 생성 중 길이 조회 실패:", e);
      }
    }

    // 업로드 파일 삭제
    try { fs.unlinkSync(filePath); } catch(e){}

    return res.json({ text, srt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "변환 중 오류 발생" });
  }
});

export default router;
