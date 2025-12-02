console.log('main loaded');

document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert(btn.innerText + " 기능 준비중!");
    });
});
