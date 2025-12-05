document.getElementById("videoConvertBtn").addEventListener("click", async () => {
    const file = document.getElementById("videoInput").files[0];
    if(!file){ alert("동영상을 선택해주세요!"); return; }
    alert("동영상 변환 준비 중입니다. (브라우저 내 ffmpeg 필요)"); 
    // 실제 변환은 ffmpeg.wasm 라이브러리 추가 후 구현 가능
});
