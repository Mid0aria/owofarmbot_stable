/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = {
    config: {
        name: "resume",
    },
    run: async (client, message) => {
        if (client.global.paused) {
            if (client.global.captchadetected) {
                client.global.captchadetected = false;
            }
            client.global.paused = false;
            client.rpc("update");
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({ content: "Resuming :)" });
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
