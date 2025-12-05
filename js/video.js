document.getElementById("videoConvertBtn").addEventListener("click", async () => {
  const file = document.getElementById("videoInput").files[0];
  if(!file){
    alert("파일을 선택해주세요!");
    return;
  }

  // 브라우저 변환 한계 체크 (약 3분 기준)
  if(file.size > 150 * 1024 * 1024){ // 약 150MB 이상이면 안내
    alert("죄송합니다. 브라우저에서는 3분 이하 영상만 변환 가능합니다.");
    return;
  }

  if(!ffmpeg.isLoaded()) await ffmpeg.load();
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  const outputFormat = file.name.endsWith('.mp4') ? 'webm' : 'mp4';
  await ffmpeg.run('-i', file.name, `output.${outputFormat}`);
  const data = ffmpeg.FS('readFile', `output.${outputFormat}`);

  const url = URL.createObjectURL(new Blob([data.buffer], { type:`video/${outputFormat}` }));
  const link = document.getElementById("videoDownload");
  link.href = url;
  link.download = `converted_${file.name.split('.')[0]}.${outputFormat}`;
  link.style.display = 'inline';
  link.textContent = '다운로드';
});
