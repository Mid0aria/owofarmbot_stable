/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

let socket;
let startTime = null;

function connectWebSocket() {
    socket = new WebSocket(`ws://${window.location.host}/ws`); //! buna configden nasıl port vereyim AMK

    socket.onopen = function () {
        document.getElementById("ws-status").textContent = "Connected";
        document.getElementById("ws-status-extra").textContent = "Connected";
        document.getElementById("connected").style = "display: block;";
        document.getElementById("waitingforconnection").style =
            "display: none;";
        console.log("WebSocket bağlantısı başarılı.");
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.action == "connectinfo") {
            if (data.type == "uptime") {
                startTime = new Date() - data.uptime * 1000;
                setInterval(updateUptime, 1000);
            }
            if (data.global?.type == "Extra") {
                document.getElementById("sidebar-extra-section").style.display =
                    "block";
            }
            if (data.type == "oldlog") {
                const t = data.log;
                const logContainer = document.getElementById("logContainer");
                for (const log of t) {
                    const raw = JSON.stringify(log);
                    const logMessage = JSON.parse(raw);
                    const logEntry = document.createElement("div");
                    logEntry.textContent = logMessage;
                    logContainer.appendChild(logEntry);
                }
            }
            if (data.global?.type == "Main" && data.type == "alldata") {
                document.getElementById("usernick").textContent =
                    `${data.client.globalName}`;

                document.getElementById("username").textContent =
                    `${data.client.username}`;

                document.getElementById("bot-status").textContent =
                    `${data.global.paused ? "Paused" : "Running"}`;

                document.getElementById("hunt-value").innerHTML =
                    `${data.global.total.hunt}`;

                document.getElementById("battle-value").innerHTML =
                    `${data.global.total.battle}`;

                document.getElementById("pray-value").innerHTML =
                    `${data.global.total.pray}`;

                document.getElementById("curse-value").innerHTML =
                    `${data.global.total.curse}`;

                document.getElementById("huntbot-value").innerHTML =
                    `${data.global.total.huntbot}`;

                document.getElementById("vote-value").innerHTML =
                    `${data.global.total.vote}`;

                document.getElementById("giveaway-value").innerHTML =
                    `${data.global.total.giveaway}`;

                document.getElementById("captcha-value").innerHTML =
                    `${data.global.total.captcha}`;

                document.getElementById("solvedcaptcha-value").innerHTML =
                    `${data.global.total.solvedcaptcha}`;

                document.getElementById("slot-value").innerHTML =
                    `${data.global.gamble.slot}`;

                document.getElementById("coinflip-value").innerHTML =
                    `${data.global.gamble.coinflip}`;

                document.getElementById("cowoncywon-value").innerHTML =
                    `${data.global.gamble.cowoncywon}`;
            }
            if (data.global?.type == "Extra" && data.type == "alldata") {
                document.getElementById("usernick-extra").textContent =
                    `${data.client.globalName}`;

                document.getElementById("username-extra").textContent =
                    `${data.client.username}`;

                document.getElementById("bot-status-extra").textContent =
                    `${data.global.paused ? "Paused" : "Running"}`;

                document.getElementById("hunt-value-extra").innerHTML =
                    `${data.global.total.hunt}`;

                document.getElementById("battle-value-extra").innerHTML =
                    `${data.global.total.battle}`;

                document.getElementById("pray-value-extra").innerHTML =
                    `${data.global.total.pray}`;

                document.getElementById("curse-value-extra").innerHTML =
                    `${data.global.total.curse}`;

                document.getElementById("huntbot-value-extra").innerHTML =
                    `${data.global.total.huntbot}`;

                document.getElementById("vote-value-extra").innerHTML =
                    `${data.global.total.vote}`;

                document.getElementById("giveaway-value-extra").innerHTML =
                    `${data.global.total.giveaway}`;

                document.getElementById("captcha-value-extra").innerHTML =
                    `${data.global.total.captcha}`;

                document.getElementById("solvedcaptcha-value-extra").innerHTML =
                    `${data.global.total.solvedcaptcha}`;

                document.getElementById("slot-value-extra").innerHTML =
                    `${data.global.gamble.slot}`;

                document.getElementById("coinflip-value-extra").innerHTML =
                    `${data.global.gamble.coinflip}`;

                document.getElementById("cowoncywon-value-extra").innerHTML =
                    `${data.global.gamble.cowoncywon}`;
            }
        }

        if (data.global?.type == "Main") {
            if (data.action == "update") {
                if (data.type == "botstatus") {
                    document.getElementById("bot-status").textContent =
                        `${data.status}`;
                }

                document.getElementById("hunt-value").innerHTML =
                    `${data.global.total.hunt}`;

                document.getElementById("battle-value").innerHTML =
                    `${data.global.total.battle}`;

                document.getElementById("pray-value").innerHTML =
                    `${data.global.total.pray}`;

                document.getElementById("curse-value").innerHTML =
                    `${data.global.total.curse}`;

                document.getElementById("huntbot-value").innerHTML =
                    `${data.global.total.huntbot}`;

                document.getElementById("vote-value").innerHTML =
                    `${data.global.total.vote}`;

                document.getElementById("giveaway-value").innerHTML =
                    `${data.global.total.giveaway}`;

                document.getElementById("captcha-value").innerHTML =
                    `${data.global.total.captcha}`;

                document.getElementById("solvedcaptcha-value").innerHTML =
                    `${data.global.total.solvedcaptcha}`;

                document.getElementById("slot-value").innerHTML =
                    `${data.global.gamble.slot}`;

                document.getElementById("coinflip-value").innerHTML =
                    `${data.global.gamble.coinflip}`;

                document.getElementById("cowoncywon-value").innerHTML =
                    `${data.global.gamble.cowoncywon}`;

                const hasQuest =
                    data.global.quest.title != "All quests completed!" ||
                    data.global.quest.title != "No active quest found";
                document.getElementById("quest-title").textContent =
                    (hasQuest ? "Title: " : "") + `${data.global.quest.title}`;

                document.getElementById("quest-reward").textContent =
                    (hasQuest ? "Reward: " : "") +
                    `${data.global.quest.reward}`;

                document.getElementById("quest-progress").textContent =
                    (hasQuest ? "Progress: " : "") +
                    `${data.global.quest.progress}`;
            }
        }
        if (data.global?.type == "Extra") {
            if (data.action == "update") {
                if (data.type == "botstatus") {
                    document.getElementById("bot-status-extra").textContent =
                        `${data.status}`;
                }

                document.getElementById("hunt-value-extra").innerHTML =
                    `${data.global.total.hunt}`;

                document.getElementById("battle-value-extra").innerHTML =
                    `${data.global.total.battle}`;

                document.getElementById("pray-value-extra").innerHTML =
                    `${data.global.total.pray}`;

                document.getElementById("curse-value-extra").innerHTML =
                    `${data.global.total.curse}`;

                document.getElementById("huntbot-value-extra").innerHTML =
                    `${data.global.total.huntbot}`;

                document.getElementById("vote-value-extra").innerHTML =
                    `${data.global.total.vote}`;

                document.getElementById("giveaway-value-extra").innerHTML =
                    `${data.global.total.giveaway}`;

                document.getElementById("captcha-value-extra").innerHTML =
                    `${data.global.total.captcha}`;

                document.getElementById("solvedcaptcha-value-extra").innerHTML =
                    `${data.global.total.solvedcaptcha}`;

                document.getElementById("slot-value-extra").innerHTML =
                    `${data.global.gamble.slot}`;

                document.getElementById("coinflip-value-extra").innerHTML =
                    `${data.global.gamble.coinflip}`;

                document.getElementById("cowoncywon-value-extra").innerHTML =
                    `${data.global.gamble.cowoncywon}`;

                const hasQuest =
                    data.global.quest.title != "All quests completed!" ||
                    data.global.quest.title != "No active quest found";
                document.getElementById("quest-title-extra").textContent =
                    (hasQuest ? "Title: " : "") + `${data.global.quest.title}`;

                document.getElementById("quest-reward-extra").textContent =
                    (hasQuest ? "Reward: " : "") +
                    `${data.global.quest.reward}`;

                document.getElementById("quest-progress-extra").textContent =
                    (hasQuest ? "Progress: " : "") +
                    `${data.global.quest.progress}`;
            }
        }
    };

    socket.onerror = function (error) {
        console.error("WebSocket Hatası:", error);
    };

    socket.onclose = function () {
        document.getElementById("ws-status").textContent = "Disconnected";
        document.getElementById("connected").style = "display: none;";
        document.getElementById("waitingforconnection").style =
            "display: block;";

        console.log("ws baglantisi yok amk");

        setTimeout(connectWebSocket, 1000);
    };
}

connectWebSocket();

function sendAction(action) {
    const message = JSON.stringify({ action: action });
    socket.send(message);
    if (action == "reboot") {
        document.getElementById("reboot-popup").style.display = "none";
    }
}

function updateUptime() {
    if (startTime === null) {
        return;
    }

    const currentTime = new Date();
    const seconds = Math.floor((currentTime - startTime) / 1000);

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const uptime = `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;

    document.getElementById("uptime").textContent = uptime;
}
