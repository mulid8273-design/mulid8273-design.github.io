import { $, downloadFile } from "./main.js";

const input = $("imgInput");
const format = $("imgFormat");
const convertBtn = $("convertBtn");
const result = $("result");

convertBtn.addEventListener("click", async () => {
  if (!input.files.length) {
    result.textContent = "이미지를 선택하세요.";
    return;
  }

  const file = input.files[0];
  const target = format.value;

  result.textContent = "변환 중...";

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        downloadFile(blob, `converted.${target}`);
        result.textContent = "변환 완료!";
      },
      `image/${target}`,
      0.92
    );
  };
});
