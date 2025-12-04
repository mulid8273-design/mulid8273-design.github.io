// ===== 탭 전환 =====
const tabButtons = document.querySelectorAll(".nav-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.dataset.tool;
    tabPanels.forEach(panel =>
      panel.classList.toggle("hidden", panel.id !== target)
    );
  });
});

// ===== 공용: 이미지 로드 =====
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// ===== PNG → JPG =====
async function pngToJpg(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const url = canvas.toDataURL("image/jpeg", 0.92);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name.replace(".png", ".jpg");
  a.click();
}

// ===== PNG → WEBP =====
async function pngToWebp(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const url = canvas.toDataURL("image/webp", 0.9);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name.replace(".png", ".webp");
  a.click();
}

// ===== HEIC → JPG =====
async function heicToJpg(file) {
  const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name.replace(".heic", ".jpg");
  a.click();
}

// ===== 압축 =====
async function compress(file, quality = 0.8) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const url = canvas.toDataURL("image/jpeg", quality);

  const a = document.createElement("a");
  a.href = url;
  a.download = "compressed.jpg";
  a.click();
}

// ===== 리사이즈 =====
async function resize(file, width, height) {
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = width || img.width;
  canvas.height = height || img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const url = canvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = url;
  a.download = "resized.png";
  a.click();
}

// ===== 이미지 → PDF =====
async function imagesToPdf(files) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const img = await loadImage(files[i]);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg");
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  }

  pdf.save("images.pdf");
}

// ===== EXIF 제거 =====
async function stripExif(file) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  canvas.getContext("2d").drawImage(img, 0, 0);

  const url = canvas.toDataURL("image/jpeg", 0.9);

  const a = document.createElement("a");
  a.href = url;
  a.download = "no-exif.jpg";
  a.click();
}

// ===== 이벤트 연결 =====
document.querySelectorAll("[data-action-button]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const action = btn.dataset.actionButton;
    const fileInput = document.querySelector(`[data-action="${action}"]`);

    if (!fileInput || !fileInput.files.length) {
      alert("파일을 선택해주세요.");
      return;
    }

    const file = fileInput.files[0];

    if (action === "compress") {
      const q = document.querySelector("[data-quality]").value;
      return compress(file, q);
    }

    if (action === "resize") {
      const w = document.querySelector("[data-width]").value;
      const h = document.querySelector("[data-height]").value;
      return resize(file, Number(w), Number(h));
    }

    if (action === "imagesToPdf")
      return imagesToPdf(fileInput.files);

    return window[action](file);
  });
});
