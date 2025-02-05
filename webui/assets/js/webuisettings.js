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
    }

    const backgroundElements = document.querySelectorAll(".background-item");
    backgroundElements.forEach((element) => {
        if (element.src === savedBackground) {
            element.classList.add("selected");
        } else {
            element.classList.remove("selected");
        }
    });

    const textBackgroundEnabled =
        localStorage.getItem("textBackground") === "true";
    const savedColor =
        localStorage.getItem("textBackgroundColor") || "rgba(0, 0, 0, 0.6)";
    const isSemiTrans = localStorage.getItem("semiTransparent") === "true";
    const isBlur = localStorage.getItem("blurTextBackground") === "true";

    document.getElementById("text-background-toggle").checked =
        textBackgroundEnabled;
    document.getElementById("semi-trans-toggle").checked = isSemiTrans;
    document.getElementById("blur-bg-toggle").checked = isBlur;
    document.getElementById("text-background-color").value = savedColor;

    if (textBackgroundEnabled) {
        applyTextBackground();
    } else {
        removeTextBackground();
    }

    const isAnimateTitle = localStorage.getItem("titleAnimation") === "true";
    if (isAnimateTitle) changeTitle();
    document.getElementById("title-animation-toggle").checked = isAnimateTitle;

    const customTitle = localStorage.getItem("customPageTitle");
    if (customTitle != "") {
        changeTitle();
        document.getElementById("custom-title").value = customTitle;
    }
});

document.getElementById("save-title-btn").addEventListener("click", () => {
    let customTitle = document.getElementById("custom-title").value;
    if (customTitle != "") localStorage.setItem("customPageTitle", customTitle);
    changeTitle();
});

document.getElementById("reset-title-btn").addEventListener("click", () => {
    document.getElementById("custom-title").value = "❤️ OwO Farm Bot Stable ❤️";
    localStorage.setItem("customPageTitle", "❤️ OwO Farm Bot Stable ❤️");
    changeTitle();
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

function toggleTextBackground() {
    const isChecked = document.getElementById("text-background-toggle").checked;
    localStorage.setItem("textBackground", isChecked ? "true" : "false");
    if (isChecked) {
        applyTextBackground();
    } else {
        removeTextBackground();
    }
}

function toggleSemiTransparent() {
    const isChecked = document.getElementById("semi-trans-toggle").checked;
    if (isChecked) {
        document.getElementById("blur-bg-toggle").checked = false;
        if (localStorage.getItem("blurTextBackground") === "true")
            localStorage.setItem("blurTextBackground", "false");
    }
    localStorage.setItem("semiTransparent", isChecked ? "true" : "false");
    applyTextBackground();
}

function toggleBlurTextBackground() {
    const isChecked = document.getElementById("blur-bg-toggle").checked;
    if (isChecked) {
        document.getElementById("semi-trans-toggle").checked = false;
        if (localStorage.getItem("semiTransparent") === "true")
            localStorage.setItem("semiTransparent", "false");
    }
    localStorage.setItem("blurTextBackground", isChecked ? "true" : "false");
    applyTextBackground();
}

function applyTextBackground() {
    const isChecked = localStorage.getItem("textBackground") === "true";
    const isBlur = localStorage.getItem("blurTextBackground") === "true";
    const isSemiTrans = localStorage.getItem("semiTransparent") === "true";
    const blurIntensity = localStorage.getItem("blurIntensity") || "8px";

    let color =
        localStorage.getItem("textBackgroundColor") || "rgba(0, 0, 0, 0.6)";
    if (isSemiTrans) {
        color = convertToSemiTransparent(color);
    }

    document.querySelectorAll(".text-container").forEach((container) => {
        if (isChecked) {
            container.style.backgroundColor = isBlur
                ? "rgba(0, 0, 0, 0.3)"
                : color;
            container.style.backdropFilter = isBlur
                ? `blur(${blurIntensity})`
                : "none";
            container.classList.toggle("blur", isBlur);
        } else {
            container.style.backgroundColor = "transparent";
            container.style.backdropFilter = "none";
            container.classList.toggle("blur", isBlur);
        }
    });

    document.documentElement.style.setProperty(
        "--blur-intensity",
        blurIntensity,
    );
    document.documentElement.style.setProperty("--text-bg-color", color);
}

function removeTextBackground() {
    const elements = document.querySelectorAll(".text-container");
    elements.forEach((el) => {
        el.style.backgroundColor = "transparent";
        el.style.backdropFilter = "none";
        el.classList.remove("blur");
    });
}

function changeTextBackgroundColor(color) {
    const isSemiTrans = localStorage.getItem("semiTransparent") === "true";
    if (isSemiTrans) {
        color = convertToSemiTransparent(color);
    }

    localStorage.setItem("textBackgroundColor", color);
    applyTextBackground();
}

function convertToSemiTransparent(color) {
    if (color.startsWith("rgba")) return color;
    if (color.startsWith("#")) {
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }
    return color.replace("rgb", "rgba").replace(")", ", 0.6)");
}

function updateBlurIntensity(value) {
    localStorage.setItem("blurIntensity", value + "px");
    document.getElementById("blur-value").textContent = value + "px";
    applyTextBackground();
}

function toggleTitleAnimation() {
    const isEnabled = document.getElementById("title-animation-toggle").checked;
    localStorage.setItem("titleAnimation", isEnabled ? "true" : "false");

    if (isEnabled) changeTitle();
}

function changeTitle() {
    const customTitle = localStorage.getItem("customPageTitle");
    let title;
    if (customTitle == "" || customTitle == null)
        title = "❤️ OwO Farm Bot Stable ❤️";
    else title = customTitle;

    animateTitle(title);
}
