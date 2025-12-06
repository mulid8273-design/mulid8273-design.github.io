// 공통 유틸 + 다운로드 함수

// 브라우저에서 파일 다운로드
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// DOM helper
export function $(id) {
  return document.getElementById(id);
}
