// 탭 이동
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.add("hidden"));
    document.getElementById(btn.dataset.tool).classList.remove("hidden");
  });
});

// 공통 캔버스 변환 함수
function loadImage(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}

async function convertImage(file, format, quality = 1) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(
      blob => resolve(blob),
      format,
      quality
    );
  });
}

// PNG → JPG
async function pngToJpg(file) {
  const blob = await convertImage(file, "image/jpeg", 0.92);
  downloadBlob(blob, file.name.replace(/\.png$/i, ".jpg"));
}

// PNG → WEBP
async function pngToWebp(file) {
  const blob = await convertImage(file, "image/webp", 0.92);
  downloadBlob(blob, file.name.replace(/\.png$/i, ".webp"));
}

// HEIC → JPG
async function heicToJpg(file) {
  const blob = await heic2any({ blob: file, toType: "image/jpeg" });
  downloadBlob(blob, file.name.replace(/\.\w+$/, ".jpg"));
}

// 이미지 압축
async function compress(file, quality) {
  const blob = await convertImage(file, "image/jpeg", quality);
  downloadBlob(blob, file.name.replace(/\.\w+$/, "_compressed.jpg"));
}

// 이미지 리사이즈
async function resize(file, width, height) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  canvas.toBlob(blob => downloadBlob(blob, file.name.replace(/\.\w+$/, "_resized.jpg")), "image/jpeg");
}

// 이미지 → PDF
async function imagesToPdf(files) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const img = await loadImage(files[i]);
    const imgData = await imageToDataURL(files[i]);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  }
  pdf.save("converted.pdf");
}

function imageToDataURL(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// PDF 병합 (간단)
async function pdfMerge(files) {
  alert("간단 병합은 브라우저 단독으로 불완전할 수 있어요.\n정식 버전은 서버 필요!");
}

// EXIF 제거
async function stripExif(file) {
  const blob = await convertImage(file, "image/jpeg", 1);
  downloadBlob(blob, file.name.replace(/\.\w+$/, "_clean.jpg"));
}

// Blob 다운로드
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// 버튼 이벤트 연결
document.querySelectorAll("[data-action-button]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.actionButton;
    const input = document.querySelector(`[data-action="${action}"]`);
    const file = input?.files?.[0];
    const files = input?.files;

    if (!file && action !== "imagesToPdf" && action !== "pdfMerge") {
      alert("파일을 선택해주세요");
      return;
    }

    const quality = document.querySelector("[data-quality]")?.value;

    if (action === "resize") {
      const width = Number(document.querySelector("[data-width]").value);
      const height = Number(document.querySelector("[data-height]").value);
      resize(file, width, height);
    } else if (action === "pngToJpg") pngToJpg(file);
    else if (action === "pngToWebp") pngToWebp(file);
    else if (action === "heicToJpg") heicToJpg(file);
    else if (action === "compress") compress(file, quality);
    else if (action === "imagesToPdf") imagesToPdf(files);
    else if (action === "pdfMerge") pdfMerge(files);
    else if (action === "stripExif") stripExif(file);
  });
});
