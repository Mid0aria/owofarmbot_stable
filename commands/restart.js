/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = {
    config: {
        name: "restart",
        aliases: ["reboot", "stop"],
    },
    run: async (client, message) => {
        await message.channel.send("The bot is being restarted...");
        client.destroy();

        setTimeout(() => {
            process.exit(1);
        }, 1000);
    },
};
