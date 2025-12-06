<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>파일 변환</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
    <h1>파일 변환</h1>
    <a href="index.html">← 홈으로</a>
</header>

<div class="container">
    <input type="file" id="fileInput">

    <select id="fileFormat">
        <option value="txt">TXT로 변환</option>
        <option value="pdf">PDF로 변환</option>
    </select>

    <button id="fileConvertBtn">변환하기</button>

    <div id="fileResult"></div>
</div>

<script src="js/pdf.js"></script>
</body>
</html>
