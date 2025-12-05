// 기본 탭 전환
const tabs = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p => p.classList.add('hidden'));
    document.getElementById(tab.dataset.tool).classList.remove('hidden');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// 여기에 기존 heic2any, 이미지 변환, 압축, PDF 변환 등 기능 스크립트 포함
// 예: pngToJpg, pngToWebp, compress, imagesToPdf, pdfMerge, stripExif, resize, crop
