/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Loads event handler files from the specified directory and binds them to the client.
 *
 * @param {string} dirs - The directory name within the 'events' folder to load event handlers from.
 */

module.exports = async (client, message) => {
    const load = (dirs) => {
        const events = client.fs
            .readdirSync(`./events/${dirs}/`)
            .filter((d) => d.endsWith(".js"));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
        }
    };

    client.fs.readdirSync("./events/").forEach((x) => load(x));
};
