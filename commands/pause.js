/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/*
 * Command to pause the bot.
 *
 * @module pause
 * @property {Object} config - The configuration object for the command.
 * @property {string} config.name - The name of the command.
 * @property {Array<string>} config.aliases - The aliases for the command.
 * @function run
 * @async
 * @param {Object} client - The client instance.
 * @param {Object} message - The message object.
 * @description Pauses the bot if it is not already paused. If the bot is already paused, it sends a feedback message if chat feedback is enabled.
 */

module.exports = {
    config: {
        name: "pause",
    },
    run: async (client, message) => {
        if (client.global.paused) {
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({
                    content: "Bot is already paused!!!",
                });
            }
        } else {
            client.global.paused = true;
            client.rpc("update");
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({ content: "Paused :)" });
            }
        }
    },
};
