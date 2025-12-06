document.getElementById("fileConvertBtn").addEventListener("click", async () => {
    const file = document.getElementById("fileInput").files[0];
    const format = document.getElementById("fileFormat").value;
    const result = document.getElementById("fileResult");

    if (!file) {
        result.innerHTML = "<p style='color:red;'>파일을 선택하세요.</p>";
        return;
    }

    if (format === "txt") {
        // PDF → TXT
        const reader = new FileReader();
        reader.onload = async e => {

            // PDF.js 사용
            const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise;
            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(t => t.str).join(" ") + "\n\n";
            }

            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            result.innerHTML = `<a href="${url}" download="converted.txt">TXT 다운로드</a>`;
        };
        reader.readAsArrayBuffer(file);
    }

    if (format === "pdf") {
        // TXT → PDF (jsPDF 사용)
        const reader = new FileReader();
        reader.onload = () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const lines = reader.result.split("\n");

            let y = 10;
            lines.forEach(line => {
                doc.text(line, 10, y);
                y += 7;
            });

            doc.save("converted.pdf");
        };

        reader.readAsText(file);
    }
});
