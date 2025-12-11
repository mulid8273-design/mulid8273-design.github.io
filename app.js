import express from "express";
import audioToText from "./routes/audio-to-text.js";

const app = express();

app.use(express.json());
app.use("/api/audio-to-text", audioToText);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
