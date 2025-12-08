// MULID 사이트 공통 스크립트
console.log("main.js loaded successfully");

// Google Adsense 자동 로드
function loadGoogleAds() {
    const gs = document.createElement("script");
    gs.async = true;
    gs.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6998063928409116";
    gs.crossOrigin = "anonymous";
    document.head.appendChild(gs);
}

// Naver AdPost 자동 로드
function loadNaverAds() {
    const ns = document.createElement("script");
    ns.src = "https://af.naver.com/adpost/js/adpost-ads.js";
    document.head.appendChild(ns);
}

document.addEventListener("DOMContentLoaded", () => {
    loadGoogleAds();
    loadNaverAds();
});
