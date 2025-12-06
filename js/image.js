document.getElementById("convertBtn").addEventListener("click", () => {
    const file = document.getElementById("imgInput").files[0];
    const format = document.getElementById("imgFormat").value;
    const result = document.getElementById("result");

    if (!file) {
        result.innerHTML = "<p style='color:red;'>파일을 선택하세요.</p>";
        return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                blob => {
                    const url = URL.createObjectURL(blob);

                    result.innerHTML = `
                        <a href="${url}" download="converted.${format}" 
                           style="font-size:20px;color:blue;">
                           변환된 이미지 다운로드
                        </a>
                    `;
                },
                "image/" + format,
                0.92
            );
        };
    };

    reader.readAsDataURL(file);
});
