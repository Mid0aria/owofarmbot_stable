/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Retrieves the guild with the specified ID from the client's guild cache.
 *
 * @type {Guild}
 * @constant
 */

module.exports = async (client) => {
    client.logger.info(
        "Bot",
        "Startup",
        client.chalk.red(`${client.user.username}`) + " is ready!",
    );
    setupSweeper(client);

    client.global.temp.isready = true;
    if (client.config.settings.autojoingiveaways) {
        const mylovetiffani = client.guilds.cache.get("420104212895105044"); // ^^

        if (mylovetiffani) {
            client.logger.info(
                "Bot",
                "Startup",
                "You are in the OwO Bot Support server. I will automatically enter the giveaways :)",
            );
            client.global.owosupportserver = true;
        } else {
            client.logger.alert(
                "Bot",
                "Startup",
                "You are not in the OwO Bot Support server. Please join to the server and restart the bot to automatically enter giveaways",
            );
        }
    }

    client.rpc("start");
    if (client.basic.autostart) {
        if (client.global.type === "Extra") {
            await client.delay(3500);
        }
        if (client.global.paused) {
            if (client.global.captchadetected) {
                client.global.captchadetected = false;
            }
            client.global.paused = false;
            client.rpc("update");

            if (!client.global.temp.started) {
                client.global.temp.started = true;
                client.logger.info(
                    "Bot",
                    "AutoStart",
                    "BOT started have fun ;)",
                );

                setTimeout(() => {
                    require("../../utils/mainHandler.js")(client);
                }, 1000);
            } else {
                client.logger.info(
                    "Bot",
                    "AutoStart",
                    "Restarted BOT after a pause :3",
                );
            }
        } else {
            client.logger.warn("Bot", "AutoStart", "Bot is already working!!!");
        }
    }
};

function setupSweeper(botClient) {
    setInterval(
        () => {
            botClient.channels.cache.forEach((channel) => {
                if (channel.messages) {
                    const messagesArray = Array.from(
                        channel.messages.cache.values(),
                    );
                    messagesArray.sort(
                        (a, b) => a.createdTimestamp - b.createdTimestamp,
                    );
                    const messagesToDelete = Math.floor(
                        messagesArray.length * 0.85,
                    );
                    for (let i = 0; i < messagesToDelete; i++) {
                        channel.messages.cache.delete(messagesArray[i].id);
                    }
                }
            });

            botClient.logger.warn(
                "Bot",
                "Cache",
                `Cleared oldest 85% of message cache for [${botClient.user.username}].`,
            );
        },
        5 * 60 * 1000,
    );
}
