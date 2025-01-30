/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

document.addEventListener("DOMContentLoaded", () => {
    const savedBackground = localStorage.getItem("selectedBackground");
    if (savedBackground) {
        const isVideo = savedBackground.endsWith(".mp4");

        if (isVideo) {
            let videoBackground = document.getElementById("background-video");

            if (!videoBackground) {
                videoBackground = document.createElement("video");
                videoBackground.id = "background-video";
                videoBackground.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: -1;
                `;
                videoBackground.autoplay = true;
                videoBackground.loop = true;
                videoBackground.muted = true;
                document.body.appendChild(videoBackground);
            }

            videoBackground.src = savedBackground;
            videoBackground.style.display = "block";
            document.body.style.backgroundImage = "none";
        } else {
            const videoBackground = document.getElementById("background-video");
            if (videoBackground) {
                videoBackground.style.display = "none";
            }
            document.body.style.backgroundImage = `url(${savedBackground})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        }

        const backgroundElements =
            document.querySelectorAll(".background-item");
        backgroundElements.forEach((element) => {
            if (element.src === savedBackground) {
                element.classList.add("selected");
            } else {
                element.classList.remove("selected");
            }
        });
    }
});

function selectBackground(element, src) {
    const allItems = document.querySelectorAll(".background-item");
    allItems.forEach((item) => item.classList.remove("selected"));

    element.classList.add("selected");

    const isVideo = src.endsWith(".mp4");
    const body = document.body;

    if (isVideo) {
        body.style.backgroundImage = "none";
        let videoBackground = document.getElementById("background-video");

        if (!videoBackground) {
            videoBackground = document.createElement("video");
            videoBackground.id = "background-video";
            videoBackground.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                z-index: -1;
            `;
            videoBackground.autoplay = true;
            videoBackground.loop = true;
            videoBackground.muted = true;
            document.body.appendChild(videoBackground);
        }

        videoBackground.src = src;
        videoBackground.style.display = "block";
    } else {
        const videoBackground = document.getElementById("background-video");
        if (videoBackground) {
            videoBackground.style.display = "none";
        }
        body.style.backgroundImage = `url(${src})`;
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.backgroundRepeat = "no-repeat";
    }

    localStorage.setItem("selectedBackground", src);
}
