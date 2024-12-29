/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Reads the command files from the './commands/' directory and filters out only the JavaScript files.
 *
 * @constant {string[]} commands - An array of filenames that end with '.js' in the './commands/' directory.
 */

module.exports = async (client) => {
    const commands = client.fs
        .readdirSync(`./commands/`)
        .filter((d) => d.endsWith(".js"));
    for (let file of commands) {
        let pull = require(`../commands/${file}`);
        client.commands.set(pull.config.name, pull);
        if (pull.config.aliases)
            pull.config.aliases.forEach((a) =>
                client.aliases.set(a, pull.config.name),
            );
    }
};
