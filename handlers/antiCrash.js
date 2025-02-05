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
 */

module.exports = (client) => {
    const logError = (type, err, origin = null) => {
        const errMessage = `--------------------------------------
Error: ${err?.message || err}
Stack: ${err?.stack || "No stack trace available"}
Origin: ${origin || "N/A"}
--------------------------------------`;

        client.logger.alert(
            "Bot",
            "Anticrash",
            "An crash happened! " + type + "\n" + errMessage,
        );
    };

    process.on("unhandledRejection", (reason, p) => {
        logError("Unhandled Rejection", reason, p);
    });

    process.on("uncaughtException", (err, origin) => {
        logError("Uncaught Exception", err, origin);
    });
    /* well this and above is the same idk why
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        logError("Uncaught Exception Monitor", err, origin);
    });
*/
};
