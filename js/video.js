<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>영상 변환</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
    <h1>영상 변환</h1>
    <a href="index.html">← 홈으로</a>
</header>

<div class="container">
    <input type="file" id="videoInput" accept="video/*">

    <select id="videoFormat">
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
        <option value="gif">GIF</option>
    </select>

    <button id="videoConvertBtn">변환하기</button>

    <div id="videoResult"></div>
</div>

<script src="js/video.js"></script>
</body>
</html>
