const ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/convert', upload.single('file'), (req, res) => {
  const input = req.file.path;
  const output = `uploads/${Date.now()}_converted.mp4`;

  ffmpeg(input)
    .output(output)
    .on('end', () => {
      res.download(output, `${req.file.originalname.split('.')[0]}_converted.mp4`, () => {
        fs.unlinkSync(input);
        fs.unlinkSync(output);
      });
    })
    .on('error', () => res.status(500).send('변환 실패'))
    .run();
});

module.exports = router;
