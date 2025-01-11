/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Command to resume the bot's operations if it is paused.
 *
 * @module resume
 * @property {Object} config - Configuration for the command.
 * @property {string} config.name - The name of the command.
 * @function run
 * @async
 * @param {Object} client - The client instance of the bot.
 * @param {Object} message - The message object that triggered the command.
 * @returns {Promise<void>}
 * @description This command checks if the bot is paused. If it is, it resumes the bot's operations and sends a feedback message if chat feedback is enabled. If the bot is not paused, it informs the user that the bot is already working.
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
