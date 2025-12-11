document.getElementById("convertBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  if (!file) {
    alert("파일을 선택해주세요!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  // 🔥 여기만 네 서버 주소로 변경
  const SERVER_URL = "https://YOUR-RENDER-URL.onrender.com";

  const response = await fetch(`${SERVER_URL}/api/audio-to-text`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  document.getElementById("result").innerText = data.text || "변환 실패";
});
