// 서버 주소만 본인 서버로 변경
const SERVER_URL = "https://mulid8273-design.github.io/";

document.getElementById("convertBtn").addEventListener("click", async () => {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("파일을 선택해주세요.");

  const form = new FormData();
  form.append("file", file);
  form.append("generate_srt", "true"); // SRT 생성 요청

  document.getElementById("result").innerText = "업로드 중...";
  try {
    const res = await fetch(`${SERVER_URL}/api/audio-to-text`, {
      method: "POST",
      body: form
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById("result").innerText = data.text || "변환완료 (본문 없음)";
      if (data.srt) {
        const blob = new Blob([data.srt], {type:"text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.getElementById("downloadSrt");
        a.href = url;
        a.style.display = "inline-block";
      }
    } else {
      document.getElementById("result").innerText = data.error || "서버 에러";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "네트워크 에러";
  }
});
