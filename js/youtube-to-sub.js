const SERVER_URL = "https://YOUR-RENDER-URL.onrender.com";

document.getElementById("ytConvertBtn").addEventListener("click", async () => {
  const url = document.getElementById("ytUrl").value.trim();
  if (!url) return alert("유튜브 URL을 입력하세요.");
  document.getElementById("ytResult").innerText = "요청중... (다운로드 및 변환까지 시간이 걸립니다)";

  try {
    const res = await fetch(`${SERVER_URL}/api/youtube-to-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, generate_srt: true })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("ytResult").innerText = data.text || "변환완료";
      if (data.srt) {
        const blob = new Blob([data.srt], {type:"text/plain"});
        const a = document.getElementById("ytDownloadSrt");
        a.href = URL.createObjectURL(blob);
        a.style.display = "inline-block";
      }
    } else {
      document.getElementById("ytResult").innerText = data.error || "변환 실패";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("ytResult").innerText = "네트워크 에러";
  }
});
