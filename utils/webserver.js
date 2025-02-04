/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

const WebSocket = require("ws");
const config = require("../config.json");

let websocketclientsarray = [];

function startWebSocketServer(client, extraclient) {
    const wss = new WebSocket.Server({
        port: config.socket.websocket,
    });

    wss.on("connection", (ws) => {
        ws.send(
            JSON.stringify({
                action: "connectinfo",
                type: "uptime",
                uptime: process.uptime(),
            }),
        );

        ws.send(
            JSON.stringify({
                action: "connectinfo",
                type: "alldata",
                global: client.global,
                client: client.user,
            }),
        );
        if (extraclient != null) {
            ws.send(
                JSON.stringify({
                    action: "connectinfo",
                    type: "alldata",
                    global: extraclient.global,
                    client: extraclient.user,
                }),
            );
        }
        ws.send(
            JSON.stringify({
                action: "connectinfo",
                type: "oldlog",
                log: client.logger.getSimpleLog(),
            }),
        );

        websocketclientsarray.push(ws);

        let botStatus = "Stopped";
        let extrabotStatus = "Stopped";

        ws.on("message", (message) => {
            const data = JSON.parse(message);

            switch (data.action) {
                case "start":
                    botStatus = "Running";
                    if (client.global.paused) {
                        if (client.global.captchadetected) {
                            client.global.captchadetected = false;
                        }
                        client.global.paused = false;
                        client.rpc("update");

                        if (!client.global.temp.started) {
                            client.global.temp.started = true;

                            setTimeout(() => {
                                require("./mainHandler.js")(client);
                            }, 1000);
                        }
                    }
                    broadcast({
                        action: "update",
                        type: "botstatus",
                        status: botStatus,
                        global: client.global,
                    });
                    break;

                case "pause":
                    botStatus = "Paused";
                    client.global.paused = true;
                    client.rpc("update");
                    client.logger.warn("WEBUI", "Farm", "Bot Paused!");
                    broadcast({
                        action: "update",
                        type: "botstatus",
                        status: botStatus,
                        global: client.global,
                    });
                    break;

                case "resume":
                    if (client.global.paused) {
                        botStatus = "Running";
                        client.global.paused = false;
                        client.rpc("update");
                        client.logger.warn("WEBUI", "Farm", "Bot Resuming!");
                        broadcast({
                            action: "update",
                            type: "botstatus",
                            status: botStatus,
                            global: client.global,
                        });
                    }
                    break;
                case "start-extra":
                    extrabotStatus = "Running";
                    if (extraclient.global.paused) {
                        if (extraclient.global.captchadetected) {
                            extraclient.global.captchadetected = false;
                        }
                        extraclient.global.paused = false;
                        extraclient.rpc("update");

                        if (!extraclient.global.temp.started) {
                            extraclient.global.temp.started = true;

                            setTimeout(() => {
                                require("./mainHandler.js")(extraclient);
                            }, 1000);
                        }
                    }
                    broadcast({
                        action: "update",
                        type: "botstatus",
                        status: extrabotStatus,
                        global: extraclient.global,
                    });
                    break;
                case "pause-extra":
                    extrabotStatus = "Paused";
                    extraclient.global.paused = true;
                    extraclient.rpc("update");
                    extraclient.logger.warn("WEBUI", "Farm", "Bot Paused!");
                    broadcast({
                        action: "update",
                        type: "botstatus",
                        status: extrabotStatus,
                        global: extraclient.global,
                    });
                    break;
                case "resume-extra":
                    if (extraclient.global.paused) {
                        extrabotStatus = "Running";
                        extraclient.global.paused = false;
                        extraclient.rpc("update");
                        extraclient.logger.warn(
                            "WEBUI",
                            "Farm",
                            "Bot Resuming!",
                        );
                        broadcast({
                            action: "update",
                            type: "botstatus",
                            status: extrabotStatus,
                            global: extraclient.global,
                        });
                    }
                    break;
                case "reboot":
                    client.logger.warn("WEBUI", "Farm", "REBOOTING ...");
                    client.destroy();
                    process.exit(1);
                    break;
                default:
                    ws.send(
                        JSON.stringify({
                            status: botStatus,
                            message: "Unknown action",
                            global: client.global,
                        }),
                    );
                    break;
            }
        });

        ws.on("close", () => {
            websocketclientsarray = websocketclientsarray.filter(
                (client) => client !== ws,
            );
        });
    });
}

function broadcast(message) {
    websocketclientsarray.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function initializeWebSocket(client, extrac = null) {
    startWebSocketServer(client, extrac);
}

module.exports = { initializeWebSocket, broadcast };
