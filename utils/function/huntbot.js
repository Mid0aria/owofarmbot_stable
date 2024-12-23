/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/*
 *idea to remember:
 *first run: check if huntbot is ready (whether non-embed (hunt result) or embed (running or free))
 *then, if free or found hunt result, run the huntbot again with captcha solver
 *if fail, report to the user (idk how)
 */

const io = require("socket.io-client");

module.exports = async (client) => {
    let channel = client.channels.cache.get(client.basic.huntbotchannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }

    huntbotHandler(client, channel);
};

const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function huntbotHandler(client, channel) {
    client.logger.info("Farm", "Huntbot", "Getting huntbot...");

    channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["huntbot", "hb"])}`,
        })
        .then(async (msg) => {
            let id = msg.id;
            let message = await getMessage();

            async function getMessage() {
                return new Promise((resolve) => {
                    const filter = (msg) =>
                        (msg.content.includes("BEEP BOOP. I AM BACK WITH") ||
                            (msg.embeds[0] &&
                                msg.embeds[0].author &&
                                msg.embeds[0].author.name.includes(
                                    "HuntBot",
                                ))) &&
                        msg.author.id === "408785106942164992" &&
                        msg.channel.id === channel.id &&
                        msg.id.localeCompare(id) > 0;

                    const listener = (msg) => {
                        if (filter(msg)) {
                            clearTimeout(timer);
                            client.off("messageCreate", listener);
                            resolve(msg);
                        }
                    };

                    const timer = setTimeout(() => {
                        client.off("messageCreate", listener);
                        const collector = channel.createMessageCollector({
                            filter,
                            time: 6100,
                        });
                        collector.on("collect", (msg) => {
                            if (filter(msg)) {
                                collector.stop();
                                resolve(msg);
                            }
                        });
                        collector.on("end", () => resolve(null));
                    }, 6100);

                    client.on("messageCreate", listener);
                });
            }

            if (message == null) {
                client.logger.alert(
                    "Farm",
                    "HuntBot",
                    "Couldn't find huntbot message!",
                );
                return;
            }

            if (!message.embeds[0]) {
                client.global.temp.huntbotessence = true;
                client.global.temp.huntbotmaxtime =
                    client.basic.commands.huntbot.maxtime;
                setTimeout(() => {
                    triggerHB(client, channel);
                }, 6100);
            } else {
                let isHunting = false;

                for (const field of message.embeds[0].fields) {
                    if (field.name.includes("is currently hunting")) {
                        const regex = /(\d+)([SMHD])/;
                        const match = field.value.match(regex);

                        if (match) {
                            const time = parseInt(match[1]);
                            const unit = match[2];

                            console.log(time + unit);
                            let milliseconds = 0;

                            if (unit === "S") {
                                milliseconds = time * 1000;
                            } else if (unit === "M") {
                                milliseconds = time * 60 * 1000;
                            } else if (unit === "H") {
                                milliseconds = time * 60 * 60 * 1000;
                            } else if (unit === "D") {
                                milliseconds = time * 24 * 60 * 60 * 1000;
                            }
                            //TODO use for interval ^^
                            console.log(milliseconds);
                        } else {
                            console.log("No valid duration format found.");
                        }

                        isHunting = true;
                    }
                    if (field.name.includes("Duration")) {
                        const regex = /(\d+(\.\d+)?)H/;
                        const match = field.name.match(regex);

                        if (match) {
                            const duration = match[1];
                            client.global.temp.huntbotmaxtime = duration;
                        } else {
                            client.global.temp.huntbotmaxtime =
                                client.basic.commands.huntbot.maxtime;
                        }
                    }
                    if (field.name.includes("Animal Essence")) {
                        const match = field.name.match(
                            /Animal Essence - `(\d[\d,]*)`/,
                        );
                        if (match) {
                            const essence = parseInt(
                                match[1].replace(/,/g, ""),
                                10,
                            );
                            if (essence > 0) {
                                client.global.temp.huntbotessence = true;
                            }
                        }
                    }
                }

                if (isHunting) {
                    client.logger.warn("Farm", "Huntbot", "Currently hunting.");
                } else {
                    setTimeout(() => {
                        triggerHB(client, channel);
                    }, 6100);
                }
            }

            if (client.global.temp.huntbotessence) {
                await client.delay(6100);
                upgradeHuntbot(client, channel);
            }
        });
}

async function triggerHB(client, channel) {
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["autohunt", "huntbot", "hb", "ah"])} ${
                client.global.temp.huntbotmaxtime
            }h`,
        })
        .then(async (msg) => {
            let id = msg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filter = (msg) =>
                        msg.content.includes("Here is your password") &&
                        msg.author.id === "408785106942164992" &&
                        msg.channel.id === channel.id &&
                        msg.id.localeCompare(id) > 0;

                    const listener = (msg) => {
                        if (filter(msg)) {
                            clearTimeout(timer);
                            client.off("messageCreate", listener);
                            resolve(msg);
                        }
                    };

                    const timer = setTimeout(() => {
                        client.off("messageCreate", listener);
                        const collector = channel.createMessageCollector({
                            filter,
                            time: 6100,
                        });
                        collector.on("collect", (msg) => {
                            if (filter(msg)) {
                                collector.stop();
                                resolve(msg);
                            }
                        });
                        collector.on("end", () => resolve(null));
                    }, 6100);

                    client.on("messageCreate", listener);
                });
            }

            if (message == null) {
                client.logger.alert(
                    "Farm",
                    "HuntBot",
                    "Couldn't find huntbot captcha message!",
                );
                return;
            }

            const attachment = message.attachments.first();
            const captchaImageURL = attachment.url;

            if (!captchaImageURL) {
                client.logger.warn(
                    "Farm",
                    "Huntbot",
                    "Couldn't get captcha image URL!",
                );
                return;
            }
            const socket = io(`http://localhost:${client.config.socket.port}`);

            socket.on("connect", () => {
                socket.emit("captcha", captchaImageURL);
            });

            socket.on("captcha_solution", async (solution) => {
                await client.delay(1600);
                await channel.send({
                    content: `${commandrandomizer([
                        "owo",
                        client.config.settings.owoprefix,
                    ])} ${commandrandomizer([
                        "autohunt",
                        "huntbot",
                        "hb",
                        "ah",
                    ])} ${client.global.temp.huntbotmaxtime}h ${solution}`,
                });

                client.logger.info("Farm", "Huntbot", "Huntbot is hunting.");
            });
        });
}

async function upgradeHuntbot(client, channel) {
    if (!client.basic.commands.huntbot.upgrade) return;

    channel.send({
        content: `${commandrandomizer([
            "owo",
            client.config.settings.owoprefix,
        ])} ${commandrandomizer(["upg", "upgrade"])} ${
            client.basic.commands.huntbot.upgradetype
        } all`,
    });

    client.logger.info(
        "Farm",
        "Huntbot",
        "Upgraded trait: " + client.basic.commands.huntbot.upgradetype,
    );
}
