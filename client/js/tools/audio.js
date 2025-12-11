document.getElementById("audioConvertBtn").addEventListener("click", () => {
    const file = document.getElementById("audioInput").files[0];
    if(!file){ alert("오디오를 선택해주세요!"); return; }
    alert("오디오 변환 준비 중입니다. (브라우저 내 변환 구현 가능)");
});
