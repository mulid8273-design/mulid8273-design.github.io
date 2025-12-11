// 공용 요소
const fileInput = document.getElementById("fileInput");
const convertBtn = document.getElementById("convertBtn");
const outputFormat = document.getElementById("outputFormat");
const downloadLink = document.getElementById("downloadLink");

// 파일 읽기
function readFileAsync(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// 이미지 변환
async function convertImage(file, format) {
    return new Promise(async resolve => {
        const img = new Image();
        img.src = await readFileAsync(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(blob => resolve(blob), `image/${format}`);
        };
    });
}

// 텍스트 변환
async function convertText(file, format) {
    const text = await file.text();
    let output = text;

    if (format === "html")
        output = `<pre>${text}</pre>`;

    if (format === "md")
        output = "```\n" + text + "\n```";

    return new Blob([output], { type: "text/plain" });
}

// 메타데이터
async function extractMetadata(file) {
    const meta = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
    };
    return new Blob([JSON.stringify(meta, null, 2)], {
        type: "application/json",
    });
}

// ZIP
async function makeZip(file) {
    const zip = new JSZip();
    zip.file(file.name, file);
    const content = await zip.generateAsync({ type: "blob" });
    return content;
}

// 버튼 클릭 처리
convertBtn.addEventListener("click", async () => {
    if (!fileInput.files.length) {
        alert("파일을 선택하세요.");
        return;
    }

    const file = fileInput.files[0];
    const format = outputFormat.value;
    let outputBlob;

    if (["png", "jpg", "webp"].includes(format)) {
        outputBlob = await convertImage(file, format);
    }
    else if (["txt", "md", "html"].includes(format)) {
        outputBlob = await convertText(file, format);
    }
    else if (format === "meta") {
        outputBlob = await extractMetadata(file);
    }
    else if (format === "zip") {
        outputBlob = await makeZip(file);
    } else {
        alert("이 형식은 GitHub Pages 환경에서 지원 불가합니다.");
        return;
    }

    // 다운로드
    const url = URL.createObjectURL(outputBlob);
    downloadLink.href = url;
    downloadLink.download = `converted.${format}`;
    downloadLink.style.display = "block";
});
