/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Sets up listeners to handle various types of process crashes and logs them using the client's chalk and logger utilities.
 *
 * @param {Object} client - The client object that contains the chalk and logger utilities.
 * @param {Object} client.chalk - The chalk utility for styling console output.
 * @param {Function} client.chalk.blue - Function to style text in blue.
 * @param {Function} client.chalk.bold - Function to style text in bold.
 * @param {Function} client.chalk.white - Function to style text in white.
 * @param {Function} client.chalk.magenta - Function to style text in magenta.
 * @param {Function} client.chalk.red - Function to style text in red.
 * @param {Object} client.logger - The logger utility for logging messages.
 * @param {Function} client.logger.info - Function to log informational messages.
 */

module.exports = (client) => {
    process.on("unhandledRejection", (reason, p) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Unhandled Rejection/Catch`),
            client.chalk.red(reason, p),
        );
    });
    process.on("uncaughtException", (err, origin) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Unhandled Exception/Catch`),
            client.chalk.red(err, origin),
        );
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Uncaught Exception/Catch`),
            client.chalk.red(err, origin),
        );
    });
    client.logger.info("Bot", "AntiCrash", "Ready");
};
