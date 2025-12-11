async function convertVideoToMP3(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/convert/video-to-mp3", {
        method: "POST",
        body: form
    });

    if (!res.ok) {
        alert("변환 실패!");
        return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3";
    a.click();
}
