/* eslint-disable no-undef */

/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

document.getElementById("general-saveBtn").addEventListener("click", () => {
    const formData = {};
    document
        .querySelectorAll("#general-settings-content .form-check-input")
        .forEach((input) => {
            formData[input.id] = input.checked;
        });

    document
        .querySelectorAll("#general-settings-content select")
        .forEach((select) => {
            formData[select.id] = select.value;
        });

    document
        .querySelectorAll(
            "#general-settings-content input[type='text'], #general-settings-content input[type='string'], #general-settings-content input[type='password'], #general-settings-content input[type='number']",
        )
        .forEach((input) => {
            formData[input.id] = input.value;
        });

    console.log("Gönderilecek Veri:", formData);
    fetch("/save-settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("server answer:", data);
            showNotification(data.message, data.type);
        })
        .catch((error) => {
            console.error("Error:", error);
            showNotification(
                "An error occurred. See browser console for more details.",
                "alert",
            );
        });
});

document.getElementById("main-saveBtn").addEventListener("click", () => {
    const formData = {};
    document
        .querySelectorAll("#settings-content .form-check-input")
        .forEach((input) => {
            formData[input.id] = input.checked;
        });

    document.querySelectorAll("#settings-content select").forEach((select) => {
        formData[select.id] = select.value;
    });

    document
        .querySelectorAll(
            "#settings-content input[type='text'], #settings-content input[type='string'], #settings-content input[type='password'], #settings-content input[type='number']",
        )
        .forEach((input) => {
            formData[input.id] = input.value;
        });

    console.log("Gönderilecek Veri:", formData);
    fetch("/save-settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("server answer:", data);
            showNotification(data.message, data.type);
        })
        .catch((error) => {
            console.error("Error:", error);
            showNotification(
                "An error occurred. See browser console for more details.",
                "alert",
            );
        });
});
document.getElementById("extra-saveBtn").addEventListener("click", () => {
    const formData = {};
    document
        .querySelectorAll("#settings-content-extra .form-check-input")
        .forEach((input) => {
            formData[input.id] = input.checked;
        });

    document
        .querySelectorAll("#settings-content-extra select")
        .forEach((select) => {
            formData[select.id] = select.value;
        });

    document
        .querySelectorAll(
            "#settings-content-extra input[type='text'], #settings-content-extra input[type='string'], #settings-content-extra input[type='password'], #settings-content-extra input[type='number']",
        )
        .forEach((input) => {
            formData[input.id] = input.value;
        });

    console.log("Gönderilecek Veri:", formData);
    fetch("/save-settings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("server answer:", data);
            showNotification(data.message, data.type);
        })
        .catch((error) => {
            console.error("Error:", error);
            showNotification(
                "An error occurred. See browser console for more details.",
                "alert",
            );
        });
});
