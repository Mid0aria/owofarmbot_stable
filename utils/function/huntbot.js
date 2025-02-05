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

/**
 * Handles the huntbot functionality by sending a command to the specified channel,
 * waiting for a response, and processing the response to determine the next action.
 *
 * @async
 * @function huntbotHandler
 * @param {Object} client - The client object representing the bot.
 * @param {Object} channel - The channel object where the command will be sent.
 * @returns {Promise<void>} - A promise that resolves when the handler completes its execution.
 */

module.exports = async (client) => {
    let channel;
    if (client.basic.huntbotchannelid.length <= 0) {
        client.logger.alert(
            "Bot",
            "Config",
            "Huntbot channelid is blank, using main channelid...",
        );
        channel = client.channels.cache.get(client.basic.commandschannelid);
    } else channel = client.channels.cache.get(client.basic.huntbotchannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }

    await huntbotHandler(client, channel);
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
                if (client.global.paused || client.global.captchadetected) {
                    while (true) {
                        if (
                            !(
                                client.global.paused ||
                                client.global.captchadetected
                            )
                        )
                            break;
                        await client.delay(3000);
                    }
                }
                client.logger.alert(
                    "Farm",
                    "HuntBot",
                    "Couldn't find huntbot message! Retry after 61 seconds.",
                );
                setTimeout(async () => {
                    await huntbotHandler(client, channel);
                }, 61000);
                return;
            }

            if (!message.embeds[0]) {
                client.global.temp.huntbot.essence = true;
                client.global.temp.huntbot.maxtime =
                    client.basic.commands.huntbot.maxtime;
                setTimeout(async () => {
                    await triggerHB(client, channel);
                }, 6100);
            } else {
                let isHunting = false;

                for (const field of message.embeds[0].fields) {
                    if (field.name.includes("is currently hunting")) {
                        const regex = /(\d+)([SMHD])/g;
                        const matches = field.value.matchAll(regex);

                        let milliseconds = 0;

                        for (const match of matches) {
                            const time = parseInt(match[1]);
                            const unit = match[2];

                            if (unit === "S") {
                                milliseconds += time * 1000;
                            } else if (unit === "M") {
                                milliseconds += time * 60 * 1000;
                            } else if (unit === "H") {
                                milliseconds += time * 60 * 60 * 1000;
                            } else if (unit === "D") {
                                milliseconds += time * 24 * 60 * 60 * 1000;
                            }
                        }

                        if (milliseconds > 0) {
                            client.global.temp.huntbot.recalltime =
                                milliseconds + 5000;
                        } else {
                            if (
                                client.global.paused ||
                                client.global.captchadetected
                            ) {
                                while (true) {
                                    if (
                                        !(
                                            client.global.paused ||
                                            client.global.captchadetected
                                        )
                                    )
                                        break;
                                    await client.delay(3000);
                                }
                            }
                            client.logger.alert(
                                "Farm",
                                "HuntBot",
                                "Couldn't find valid duration format! Retry after 61 seconds.",
                            );
                            setTimeout(async () => {
                                await huntbotHandler(client, channel);
                            }, 61000);
                            return;
                        }

                        isHunting = true;
                    }
                    if (field.name.includes("Duration")) {
                        const regex = /(\d+(\.\d+)?)H/;
                        const match = field.name.match(regex);

                        if (match) {
                            const duration = match[1];
                            client.global.temp.huntbot.maxtime = duration;
                        } else {
                            client.global.temp.huntbot.maxtime =
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
                                client.global.temp.huntbot.essence = true;
                            }
                        }
                    }
                }

                if (isHunting) {
                    client.logger.warn(
                        "Farm",
                        "Huntbot",
                        `Currently hunting. It will restart in ${client.global.temp.huntbot.recalltime} milliseconds`,
                    );
                    //? will it work
                    setTimeout(async () => {
                        await huntbotHandler(client, channel);
                    }, client.global.temp.huntbot.recalltime);
                } else {
                    setTimeout(async () => {
                        await triggerHB(client, channel);
                    }, 6100);
                }
            }

            if (client.global.temp.huntbot.essence) {
                await client.delay(6100);
                await upgradeHuntbot(client, channel);
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
                client.global.temp.huntbot.maxtime
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
                    "Couldn't find huntbot captcha message! Retry in 10 mins...",
                );
                setTimeout(async () => {
                    await huntbotHandler(client, channel);
                }, 601000);
                return;
            }

            const attachment = message.attachments.first();
            const captchaImageURL = attachment.url;

            if (!captchaImageURL) {
                client.logger.warn(
                    "Farm",
                    "Huntbot",
                    "Couldn't get captcha image URL! Retry in 10 mins",
                );
                setTimeout(async () => {
                    await huntbotHandler(client, channel);
                }, 601000);
                return;
            }

            let isstartedhunting = false;
            client.logger.info("Farm", "Huntbot", "Solving captcha...");
            const solution =
                await require("../huntbot_captcha/huntbotcaptcha.js")(
                    captchaImageURL,
                );
            client.logger.info(
                "Farm",
                "Huntbot",
                "Captcha solve completed. Starting huntbot...",
            );
            await client.delay(1600);
            await channel
                .send({
                    content: `${commandrandomizer([
                        "owo",
                        client.config.settings.owoprefix,
                    ])} ${commandrandomizer([
                        "autohunt",
                        "huntbot",
                        "hb",
                        "ah",
                    ])} ${client.global.temp.huntbot.maxtime}h ${solution}`,
                })
                .then(async (msg) => {
                    let id = msg.id;
                    let huntbotsuccessmsg = await getHuntbotSuccessMessage();
                    async function getHuntbotSuccessMessage() {
                        return new Promise((resolve) => {
                            const filter = (msg) =>
                                msg.content.includes("YOU SPENT") &&
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
                                const collector =
                                    channel.createMessageCollector({
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

                    const regex = /(\d+)([SMHD])/g;
                    const matches = huntbotsuccessmsg.content.matchAll(regex);
                    let milliseconds = 0;
                    for (const match of matches) {
                        const time = parseInt(match[1]);
                        const unit = match[2];
                        if (unit === "S") {
                            milliseconds += time * 1000;
                        } else if (unit === "M") {
                            milliseconds += time * 60 * 1000;
                        } else if (unit === "H") {
                            milliseconds += time * 60 * 60 * 1000;
                        } else if (unit === "D") {
                            milliseconds += time * 24 * 60 * 60 * 1000;
                        }
                    }
                    if (milliseconds > 0) {
                        client.global.temp.huntbot.recalltime =
                            milliseconds + 5000;
                        isstartedhunting = true;
                    } else {
                        if (
                            client.global.paused ||
                            client.global.captchadetected
                        ) {
                            while (true) {
                                if (
                                    !(
                                        client.global.paused ||
                                        client.global.captchadetected
                                    )
                                )
                                    break;
                                await client.delay(3000);
                            }
                        }
                        client.logger.alert(
                            "Farm",
                            "HuntBot",
                            "Couldn't find valid duration format! Retry after 61 seconds.",
                        );
                        setTimeout(async () => {
                            await huntbotHandler(client, channel);
                        }, 61000);
                        return;
                    }
                });
            if (isstartedhunting) {
                client.global.total.huntbot++;
                client.broadcast({
                    action: "update",
                    type: "hunt",
                    progress: client.global.total.hunt,
                    global: client.global,
                });
                client.logger.info(
                    "Farm",
                    "Huntbot",
                    `Huntbot has started to hunt. It will restart in ${client.global.temp.huntbot.recalltime} milliseconds`,
                );

                //? will it work
                setTimeout(async () => {
                    await huntbotHandler(client, channel);
                }, client.global.temp.huntbot.recalltime);
            }
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
