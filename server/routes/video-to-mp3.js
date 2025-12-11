const express = require("express");
const router = express.Router();
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {
    const input = req.file.path;
    const output = `${req.file.path}.mp3`;

    const cmd = `ffmpeg -i ${input} -vn -ar 44100 -ac 2 -b:a 192k ${output}`;

    exec(cmd, (err) => {
        if (err) return res.status(500).send("FFmpeg 변환 오류");

        const stream = fs.createReadStream(output);
        res.setHeader("Content-Type", "audio/mpeg");

        stream.pipe(res);

        stream.on("close", () => {
            fs.unlinkSync(input);
            fs.unlinkSync(output);
        });
    });
});

module.exports = router;
