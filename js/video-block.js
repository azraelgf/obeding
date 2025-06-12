(() => {
    "use strict";
    function videoPlayer() {
        const videoInit = selector => {
            const videos = document.querySelectorAll(`${selector}`);
            if (videos.length > 0) videos.forEach((video => {
                setupVideo(video);
            }));
        };
        function setupVideo(video) {
            const btn = video.querySelector(".video-btn");
            const videoSrc = btn.dataset.videoSrc;
            const container = video.querySelector(".video-block__inner");
            btn.addEventListener("click", (() => {
                const videoEl = generateVideoElement(videoSrc);
                container.innerHTML = "";
                container.appendChild(videoEl);
                videoEl.play();
            }));
        }
        function generateVideoElement(src) {
            const video = document.createElement("video");
            video.setAttribute("src", src);
            video.setAttribute("controls", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("autoplay", "");
            video.setAttribute("muted", "");
            video.setAttribute("preload", "metadata");
            video.style.width = "100%";
            video.style.height = "auto";
            return video;
        }
        videoInit(".video-block__value");
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window["FLS"] = false;
    videoPlayer();
})();