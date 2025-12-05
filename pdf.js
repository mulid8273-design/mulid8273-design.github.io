document.getElementById("pdfConvertBtn").addEventListener("click", async () => {
  const file = document.getElementById("pdfInput").files[0];
  if(!file){
    alert("파일을 선택해주세요!");
    return;
  }

  // 브라우저 내 PDF 변환 안정화: 2MB 이하 권장
  if(file.size > 2 * 1024 * 1024){
    alert("브라우저에서는 2MB 이하 PPT/PDF 파일만 안정적으로 변환 가능합니다.");
    return;
  }

  // PDF.js 사용 (브라우저 내 PDF 처리)
  const reader = new FileReader();
  reader.onload = function(e){
    const blob = new Blob([e.target.result], {type:"application/pdf"});
    const url = URL.createObjectURL(blob);
    const link = document.getElementById("pdfDownload");
    link.href = url;
    link.download = `converted_${file.name.split('.')[0]}.pdf`;
    link.style.display = 'inline';
    link.textContent = '다운로드';
  };
  reader.readAsArrayBuffer(file);
});
