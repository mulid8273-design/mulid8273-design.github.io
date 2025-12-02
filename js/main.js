console.log("main.js loaded");

// 버튼 클릭 → 파일 선택창 열기
document.getElementById("pngToJpgBtn").addEventListener("click", () => {
    document.getElementById("pngInput").click();
});

// 파일 업로드 처리
document.getElementById("pngInput").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    if (file.type !== "image/png") {
        alert("PNG 파일만 업로드 가능합니다!");
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // JPG 변환
        canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = file.name.replace(".png", ".jpg");
            link.click();
        }, "image/jpeg", 0.9);

        document.getElementById("resultMessage").innerText =
            "변환이 완료되었습니다! JPG 파일이 다운로드되었습니다.";
    };
});
