const fileInput = document.getElementById("fileInput");
const downloadLink = document.getElementById("downloadLink");

function loadImage(callback) {
    const file = fileInput.files[0];
    if (!file) {
        alert("이미지를 선택해주세요!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = () => callback(img);
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// PNG → JPG
function convertToJPG() {
    loadImage(img => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const jpgData = canvas.toDataURL("image/jpeg");

        downloadLink.href = jpgData;
        downloadLink.download = "converted.jpg";
        downloadLink.style.display = "block";
    });
}

// PNG → WEBP
function convertToWEBP() {
    loadImage(img => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const webpData = canvas.toDataURL("image/webp");

        downloadLink.href = webpData;
        downloadLink.download = "converted.webp";
        downloadLink.style.display = "block";
    });
}

// 이미지 리사이즈 (기본 50%)
function resizeImage() {
    loadImage(img => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width / 2;
        canvas.height = img.height / 2;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedData = canvas.toDataURL("image/png");

        downloadLink.href = resizedData;
        downloadLink.download = "resized.png";
        downloadLink.style.display = "block";
    });
}

// 이미지 → PDF
async function convertToPDF() {
    loadImage(async img => {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height]
        });

        pdf.addImage(img, "PNG", 0, 0, img.width, img.height);

        const pdfData = pdf.output("datauristring");

        downloadLink.href = pdfData;
        downloadLink.download = "converted.pdf";
        downloadLink.style.display = "block";
    });
}
