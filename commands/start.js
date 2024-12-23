/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = {
    config: {
        name: "start",
    },
    run: async (client, message) => {
        if (client.global.paused) {
            if (client.global.captchadetected) {
                client.global.captchadetected = false;
            }
            client.global.paused = false;
            client.rpc("update");
            await message.delete();
            if (!client.global.temp.started) {
                client.global.temp.started = true;
                if (client.config.settings.chatfeedback) {
                    await message.channel.send({
                        content: "BOT started have fun ;)",
                    });
                }

                setTimeout(() => {
                    require("../utils/mainHandler.js")(client);
                }, 1000);
            } else {
                if (client.config.settings.chatfeedback) {
                    await message.channel.send({
                        content: "Restarted BOT after a pause :3",
                    });
                }
            }
        } else {
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({
                    content: "Bot is already working!!!",
                });
            }
        }
    },
};
