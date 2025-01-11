/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Starts the OwO Farm Bot if it is paused.
 *
 * @module start
 * @property {Object} config - Configuration for the command.
 * @property {string} config.name - The name of the command.
 * @function run
 * @async
 * @param {Object} client - The client instance of the bot.
 * @param {Object} message - The message object that triggered the command.
 * @returns {Promise<void>}
 *
 * @example
 * // Usage in a Discord message
 * !start
 *
 * @description
 * This command checks if the bot is paused. If it is, it resumes the bot's operation,
 * updates the bot's status, and optionally sends feedback to the chat. If the bot is
 * already running, it informs the user that the bot is already working.
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
