/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let startTime = null;

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

function showHome(menuType) {
    if (menuType === "main") {
        document.getElementById("home-content").style.display = "block";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content-extra").style.display =
            "none";
    } else if (menuType === "extra") {
        document.getElementById("home-content-extra").style.display = "block";
        document.getElementById("settings-content-extra").style.display =
            "none";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
    }
}

function showSettings(menuType) {
    if (menuType === "main") {
        document.getElementById("settings-content").style.display = "block";
        document.getElementById("home-content").style.display = "none";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content-extra").style.display =
            "none";
    } else if (menuType === "extra") {
        document.getElementById("settings-content-extra").style.display =
            "block";
        document.getElementById("home-content-extra").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("home-content").style.display = "none";
    }
}

let socket;

function connectWebSocket() {
    socket = new WebSocket("ws://localhost:31085"); //! buna configden nasıl port vereyim AMK

    socket.onopen = function () {
        document.getElementById("ws-status").textContent = "Connected";
        document.getElementById("ws-status-extra").textContent = "Connected";
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
            if (data.global.type == "Extra") {
                document.getElementById("sidebar-extra-section").style.display =
                    "block";
            }
            if (data.global.type == "Main" && data.type == "alldata") {
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
            }
            if (data.global.type == "Extra" && data.type == "alldata") {
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
            }
        }

        if (data.global.type == "Main") {
            if (data.action == "update") {
                if (data.type == "botstatus") {
                    document.getElementById("bot-status").textContent =
                        `${data.status}`;
                }

                if (data.type == "hunt") {
                    document.getElementById("hunt-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "battle") {
                    document.getElementById("battle-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "pray") {
                    document.getElementById("pray-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "curse") {
                    document.getElementById("curse-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "huntbot") {
                    document.getElementById("huntbot-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "vote") {
                    document.getElementById("vote-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "giveaway") {
                    document.getElementById("giveaway-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "captcha") {
                    document.getElementById("captcha-value").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "solvedcaptcha") {
                    document.getElementById("solvedcaptcha-value").innerHTML =
                        `${data.progress}`;
                }
            }
        }
        if (data.global.type == "Extra") {
            if (data.action == "update") {
                if (data.type == "botstatus") {
                    document.getElementById("bot-status-extra").textContent =
                        `${data.status}`;
                }

                if (data.type == "hunt") {
                    document.getElementById("hunt-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "battle") {
                    document.getElementById("battle-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "pray") {
                    document.getElementById("pray-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "curse") {
                    document.getElementById("curse-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "huntbot") {
                    document.getElementById("huntbot-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "vote") {
                    document.getElementById("vote-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "giveaway") {
                    document.getElementById("giveaway-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "captcha") {
                    document.getElementById("captcha-value-extra").innerHTML =
                        `${data.progress}`;
                }
                if (data.type == "solvedcaptcha") {
                    document.getElementById(
                        "solvedcaptcha-value-extra",
                    ).innerHTML = `${data.progress}`;
                }
            }
        }
    };

    socket.onerror = function (error) {
        console.error("WebSocket Hatası:", error);
    };

    socket.onclose = function () {
        document.getElementById("ws-status").textContent = "Disconnected";
        console.log("ws baglantisi yok amk");

        setTimeout(connectWebSocket, 1000);
    };
}

connectWebSocket();

function sendAction(action) {
    const message = JSON.stringify({ action: action });
    socket.send(message);
}

function animateTitle(text) {
    let textToAnimate = text;
    let currentPosition = 0;
    let directionForward = true;

    function updateTitle() {
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
    }

    updateTitle();
}
