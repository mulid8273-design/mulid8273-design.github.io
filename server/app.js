const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 라우터 연결
const pdfRouter = require('./routes/pdf');
const videoRouter = require('./routes/video');
const audioRouter = require('./routes/audio');

app.use(cors());
app.use(express.json());
app.use('/pdf', pdfRouter);
app.use('/video', videoRouter);
app.use('/audio', audioRouter);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
