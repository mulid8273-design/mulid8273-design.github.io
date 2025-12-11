import fs from "fs";
import express from "express";
import multer from "multer";
import OpenAI from "openai";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const result = await client.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "gpt-4o-transcribe"
    });

    res.json({ text: result.text });

    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "음성 변환 실패" });
  }
});

export default router;
