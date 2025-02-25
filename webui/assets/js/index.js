/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

document.addEventListener("DOMContentLoaded", async () => {
    await getconfig();
});

async function getconfig() {
    try {
        const response = await fetch("/api/get-config");

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const config = await response.json();

        // Nested objelerdeki değerleri bulmak için recursive fonksiyon
        function getValueFromPath(obj, path) {
            return path.split("-").reduce((current, key) => {
                return current && current[key] !== undefined
                    ? current[key]
                    : undefined;
            }, obj);
        }

        // Belirtilen div'lerdeki form elementlerini bul
        const containers = [
            "general-settings-content",
            "settings-content",
            "settings-content-extra",
        ];

        containers.forEach((containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Her container içindeki input ve select elementlerini bul
            const elements = container.querySelectorAll("input, select");

            elements.forEach((element) => {
                const value = getValueFromPath(config, element.id);

                if (value !== undefined) {
                    if (element.type === "checkbox") {
                        element.checked = value;
                    } else if (
                        element.type === "number" ||
                        element.type === "text" ||
                        element.type === "string" ||
                        element.type === "password"
                    ) {
                        element.value = value;
                    } else if (element.tagName.toLowerCase() === "select") {
                        // Select elementi için özel işlem
                        const optionExists = Array.from(element.options).some(
                            (option) => {
                                // Config'den gelen değer option'ın value'su ile eşleşiyorsa
                                if (option.value === value) {
                                    element.value = value;
                                    return true;
                                }
                                return false;
                            },
                        );

                        // Eğer config'den gelen değer option'larda yoksa ilk option'ı seç
                        if (!optionExists && element.options.length > 0) {
                            element.value = element.options[0].value;
                        }
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error fetching config:", error);
    }
}

function showHome(menuType) {
    if (menuType === "main") {
        activateMenu("home-link");
    } else if (menuType === "extra") {
        activateMenu("home-link-extra");
    }

    if (menuType === "main") {
        document.getElementById("home-content").style.display = "block";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content-extra").style.display =
            "none";
        document.getElementById("general-settings-content").style.display =
            "none";
        document.getElementById("webui-settings").style.display = "none";
        document.getElementById("log-section").style.display = "none";
    } else if (menuType === "extra") {
        document.getElementById("home-content-extra").style.display = "block";
        document.getElementById("settings-content-extra").style.display =
            "none";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("general-settings-content").style.display =
            "none";
        document.getElementById("webui-settings").style.display = "none";
        document.getElementById("log-section").style.display = "none";
    }
}

async function showSettings(menuType) {
    await getconfig();
    if (menuType === "main") {
        activateMenu("settings-link");
    } else if (menuType === "extra") {
        activateMenu("settings-link-extra");
    } else if (menuType === "general") {
        activateMenu("general-settings-link");
    }

    if (menuType === "main") {
        document.getElementById("settings-content").style.display = "block";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content-extra").style.display =
            "none";
        document.getElementById("general-settings-content").style.display =
            "none";
        document.getElementById("webui-settings").style.display = "none";
        document.getElementById("log-section").style.display = "none";
    } else if (menuType === "extra") {
        document.getElementById("settings-content-extra").style.display =
            "block";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("general-settings-content").style.display =
            "none";
        document.getElementById("webui-settings").style.display = "none";
        document.getElementById("log-section").style.display = "none";
    } else if (menuType === "general") {
        document.getElementById("general-settings-content").style.display =
            "block";
        document.getElementById("settings-content-extra").style.display =
            "none";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("webui-settings").style.display = "none";
        document.getElementById("log-section").style.display = "none";
    }
}

function openWebUISettings() {
    activateMenu("webui-settings-link");
    document.getElementById("webui-settings").style.display = "block";
    document.getElementById("home-content").style.display = "none";
    document.getElementById("home-content-extra").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("settings-content-extra").style.display = "none";
    document.getElementById("general-settings-content").style.display = "none";
    document.getElementById("log-section").style.display = "none";
}

function showrebootalertPopup() {
    document.getElementById("reboot-popup").style.display = "block";
}

function closerebootalertPopup() {
    document.getElementById("reboot-popup").style.display = "none";
}

function animateTitle(text) {
    let textToAnimate = text;
    let currentPosition = 0;
    let directionForward = true;
    function updateTitle() {
        try {
            const enableAnimate =
                localStorage.getItem("titleAnimation") === "true";
            if (!enableAnimate) {
                document.title = text;
                return;
            }
            if (currentPosition === textToAnimate.length) {
                directionForward = false;
            } else if (currentPosition === 0) {
                directionForward = true;
            }

            let displayedText = directionForward
                ? textToAnimate.slice(0, currentPosition + 1)
                : textToAnimate.slice(0, currentPosition - 1);

            document.title = displayedText;

            currentPosition = directionForward
                ? currentPosition + 1
                : currentPosition - 1;

            setTimeout(updateTitle, 380);
        } catch (e) {
            console.log(e);
        }
    }

    updateTitle();
}

function activateMenu(linkId) {
    const menuLinks = document.querySelectorAll(
        "#main-menu a, #extra-menu a, #general-menu a, #logging a",
    );
    menuLinks.forEach((item) => {
        item.classList.remove("active");
    });

    const link = document.querySelector(`#${linkId}`);
    link.classList.add("active");
}

function showNotification(message, type = "success") {
    const notificationContainer = document.getElementById(
        "notification-container",
    );

    const notification = document.createElement("div");
    notification.classList.add("notification", "show");
    notification.classList.add(type);

    notification.innerHTML = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
        notification.remove();
    }, 500);
}

function showlog() {
    activateMenu("logging-link");
    document.getElementById("log-section").style.display = "block";
    document.getElementById("webui-settings").style.display = "none";
    document.getElementById("home-content").style.display = "none";
    document.getElementById("home-content-extra").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("settings-content-extra").style.display = "none";
    document.getElementById("general-settings-content").style.display = "none";
}

function toggleMenu() {
    console.log("ced");
    let hasExtra = false;
    if (
        document.getElementById("usernick-extra").textContent !=
        "çıkaramadım abi kimsin sen"
    )
        hasExtra = true;

    if (window.innerWidth <= 900) {
        if (
            document.getElementById("sidebar-general-section").style.display ==
            "block"
        ) {
            document.getElementById("sidebar-general-section").style.display =
                "none";
            document.getElementById("sidebar-main-section").style.display =
                "none";
            document.getElementById("sidebar-extra-section").style.display =
                "none";
            document.getElementById("sidebar-end").style.display = "none";
            document.getElementById("love").style.display = "none";
            document.getElementById("thesidebar").style.height = "auto";
            document.getElementById("connected").style.marginLeft = "0px";
        } else {
            document.getElementById("sidebar-general-section").style.display =
                "block";
            document.getElementById("sidebar-main-section").style.display =
                "block";
            if (hasExtra)
                document.getElementById("sidebar-extra-section").style.display =
                    "block";
            document.getElementById("sidebar-end").style.display = "block";
            document.getElementById("love").style.display = "block";
            document.getElementById("thesidebar").style.height = "100vh";
            document.getElementById("connected").style.marginLeft = "270px";
        }
    } else if (
        document.getElementById("sidebar-general-section").style.display !=
        "block"
    ) {
        document.getElementById("sidebar-general-section").style.display =
            "block";
        document.getElementById("sidebar-main-section").style.display = "block";
        if (hasExtra)
            document.getElementById("sidebar-extra-section").style.display =
                "block";
        document.getElementById("sidebar-end").style.display = "block";
        document.getElementById("love").style.display = "block";
        document.getElementById("thesidebar").style.height = "100vh";
        document.getElementById("connected").style.marginLeft = "270px";
    }
}
