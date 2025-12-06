// FFmpeg CDN 로드
let ffmpegLoaded = false;
let ffmpeg;

async function loadFFmpeg() {
    if (ffmpegLoaded) return;

    ffmpeg = FFmpeg.createFFmpeg({
        log: true,
        corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
    });

    await ffmpeg.load();
    ffmpegLoaded = true;
}

document.getElementById("videoConvertBtn").addEventListener("click", async () => {
    const file = document.getElementById("videoInput").files[0];
    const format = document.getElementById("videoFormat").value;
    const result = document.getElementById("videoResult");

    if (!file) {
        result.innerHTML = "<p style='color:red;'>영상 파일을 선택하세요.</p>";
        return;
    }

    await loadFFmpeg();

    const inputName = "input." + file.name.split(".").pop();
    const outputName = "output." + format;

    await ffmpeg.FS("writeFile", inputName, await fetchFile(file));

    // 변환 실행
    await ffmpeg.run("-i", inputName, outputName);

    const data = ffmpeg.FS("readFile", outputName);
    const blob = new Blob([data.buffer], { type: "video/" + format });
    const url = URL.createObjectURL(blob);

    result.innerHTML = `
        <a href="${url}" download="${outputName}" style="font-size:20px;color:blue;">
            변환된 영상 다운로드
        </a>
    `;
});
