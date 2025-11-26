let selectedFile = null;

document.getElementById('fileInput').addEventListener('change', (e)=>{
    selectedFile = e.target.files[0];
});

function convertToJPG(){
    if(!selectedFile) return alert("이미지를 먼저 선택하세요.");
    const img = new Image();
    img.onload = ()=>{
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img,0,0);
        const data = c.toDataURL('image/jpeg', 0.9);
        download(data, "converted.jpg");
    };
    img.src = URL.createObjectURL(selectedFile);
}

function convertToWEBP(){
    if(!selectedFile) return alert("이미지를 먼저 선택하세요.");
    const img = new Image();
    img.onload = ()=>{
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img,0,0);
        const data = c.toDataURL('image/webp', 0.9);
        download(data, "converted.webp");
    };
    img.src = URL.createObjectURL(selectedFile);
}

function resizeImage(){
    alert("리사이즈 기능은 향후 업데이트 예정!");
}

function convertToPDF(){
    alert("PDF 변환 기능은 향후 업데이트 예정!");
}

function download(dataURL, filename){
    const link = document.getElementById("downloadLink");
    link.href = dataURL;
    link.download = filename;
    link.style.display = "block";
    link.innerText = filename + " 다운로드";
}
