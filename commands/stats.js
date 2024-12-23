/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = {
    config: {
        name: "stats",
    },
    run: async (client, message, args) => {
        let totals = client.global.total;

        let stats = `
OwO Farm Bot Stable Statistics:
===================
- Hunt: ${totals.hunt}
- Battle: ${totals.battle}
- Captcha: ${totals.captcha}
- Pray: ${totals.pray}
- Curse: ${totals.curse}
===================
        `;

        await message.delete();
        await message.channel.send("```" + stats + "```");
    },
};
