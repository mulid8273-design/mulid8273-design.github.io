document.getElementById("convertBtn").addEventListener("click", async () => {

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const result = await fetch("/api/audio-to-text", {
        method: "POST",
        body: formData
    });

    const data = await result.json();
    document.getElementById("result").innerText = data.text;
});
