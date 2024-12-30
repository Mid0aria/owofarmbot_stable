/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Generates a string containing the statistics of the OwO Farm Bot Stable.
 *
 * @param {Object} totals - An object containing the totals for various activities.
 * @param {number} totals.hunt - The total number of hunts.
 * @param {number} totals.battle - The total number of battles.
 * @param {number} totals.captcha - The total number of captchas.
 * @param {number} totals.pray - The total number of prays.
 * @param {number} totals.curse - The total number of curses.
 * @param {number} totals.vote - The total number of votes.
 * @param {number} totals.giveaway - The total number of giveaways.
 * @param {string} uptime - The uptime of the bot.
 * @returns {string} A formatted string containing the statistics.
 */

module.exports = {
    config: {
        name: "stats",
    },
    run: async (client, message) => {
        let totals = client.global.total;

        const seconds = Math.floor(process.uptime());
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const uptime = `${days}d ${hours}h ${minutes}m ${seconds % 60}s`;
        let stats = `
OwO Farm Bot Stable Statistics:
===================
- Hunt: ${totals.hunt}
- Battle: ${totals.battle}
- Captcha: ${totals.captcha}
- Pray: ${totals.pray}
- Curse: ${totals.curse}
- Vote: ${totals.vote}
- Giveaway: ${totals.giveaway}
===================
- Uptime: ${uptime}
        `;

        await message.delete();
        await message.channel.send("```" + stats + "```");
    },
};
