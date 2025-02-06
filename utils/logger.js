/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Displays logs and status information in a formatted manner.
 *
 * @param {Array} reallog - An array of log messages to be displayed.
 *
 * The function checks if the client and loggerextrac are ready. If not, it logs the last message in the reallog array.
 * If ready, it retrieves various status information from the client and loggerextrac objects, formats them, and displays them in a structured format.
 * The function also includes a helper function `padder` to format text with padding.
 *
 * The display format varies based on the configuration settings:
 * - If extra logging is enabled, it displays detailed information for both main and extra clients.
 * - If only new logging is enabled, it displays detailed information for the main client.
 * - Otherwise, it logs the last message in the reallog array.
 */
const fs = require("fs");

let reallog = [],
    fulllog = [],
    simplifylog = [],
    loggermaincl,
    loggerextrac;

const startDate = new Date();
const formattedDate = startDate.toISOString().split("T")[0];
const formattedTime = startDate.toTimeString().split(" ")[0].replace(/:/g, "-");
const logFileName = `./data/logs_${formattedDate}_${formattedTime}.log`;

module.exports = (client) => {
    const logLength = client?.config.settings.logging.loglength || 16;
    if (client.global.type === "Extra") {
        loggerextrac = client;
    } else {
        loggermaincl = client;
    }

    const exitlog =
        client.config.settings.logging.showlogbeforeexit &&
        client.config.settings.logging.newlog;
    process.on("SIGINT", () => {
        if (exitlog) {
            console.log("//START OF LOG//", ...fulllog, "//END OF LOG//");
        }
        process.exit(0);
    });

    function log(type, module, result = "", level) {
        const color = client.chalk[level];
        const emoji = { green: "🟢", yellow: "🟡", red: "🔴" }[level];
        const logMessage = `${client.chalk.white(`[${new Date().toLocaleTimeString()}]`)} ${emoji} ${client.chalk.blue(client.chalk.bold(type))} >> ${client.chalk.cyan(client.chalk.bold(client.global.type))} > ${client.chalk.magenta(module)} > ${color(result)}`;

        reallog.push(logMessage);
        if (exitlog) fulllog.push(logMessage);
        if (reallog.length > logLength) reallog.shift();

        const plainLog = `[${new Date().toLocaleTimeString()}] ${emoji} ${type} >> ${client.global.type} > ${module} > ${result}`;
        fs.appendFile(logFileName, plainLog + "\n", (err) => {
            if (err) console.error("Error writing to log file", err);
        });

        simplifylog.push(plainLog);
        if (process.send) process.send({ type: "log", message: plainLog });

        showlog(reallog);
    }

    function info(type, module, result) {
        log(type, module, result, "green");
    }
    function warn(type, module, result) {
        log(type, module, result, "yellow");
    }
    function alert(type, module, result) {
        log(type, module, result, "red");
    }

    function pad(value) {
        return value?.toString().trim().padEnd(9, " ") ?? "null";
    }

    function showlog(logs) {
        if (
            !client.global.temp.isready ||
            (loggerextrac && !loggerextrac.global.temp.isready)
        ) {
            console.log(logs[logs.length - 1]);
            return;
        }

        const mainStats = loggermaincl.global;
        const extraStats = loggerextrac?.global;

        console.clear();
        console.log(
            `╔══════════╦════════════════════════╦════════════════════════════════════════════════`,
        );
        console.log(`║ Token    ║ Status                 ║ Questing`);
        console.log(
            `╠══════════╬════════════════════════╬════════════════════════════════════════════════`,
        );
        console.log(
            `║ Main     ║ Total hunt: ${pad(mainStats.total.hunt)}  ║ ${mainStats.quest.title}`,
        );
        console.log(
            `║ ${mainStats.captchadetected ? client.chalk.red("Danger  ") : client.chalk.green("Safe    ")} ║ Total battle: ${pad(mainStats.total.battle)}║ ${mainStats.quest.reward}`,
        );
        console.log(
            `║ ${mainStats.paused ? client.chalk.yellow("Paused  ") : client.chalk.cyan("Running ")} ║ Cowoncy won: ${pad(mainStats.gamble.cowoncywon)} ║ ${mainStats.quest.progress}`,
        );

        if (extraStats) {
            console.log(
                `╠══════════╬════════════════════════╬════════════════════════════════════════════════`,
            );
            console.log(
                `║ Extra    ║ Total hunt: ${pad(extraStats.total.hunt)}  ║ ${extraStats.quest.title}`,
            );
            console.log(
                `║ ${extraStats.captchadetected ? client.chalk.red("Danger  ") : client.chalk.green("Safe    ")} ║ Total battle: ${pad(extraStats.total.battle)}║ ${extraStats.quest.reward}`,
            );
            console.log(
                `║ ${extraStats.paused ? client.chalk.yellow("Paused  ") : client.chalk.cyan("Running ")} ║ Cowoncy won: ${pad(extraStats.gamble.cowoncywon)} ║ ${extraStats.quest.progress}`,
            );
        }
        console.log(
            `╚══════════╩════════════════════════╩════════════════════════════════════════════════`,
        );
        console.log(`>>> Log`);
        logs.forEach((log) => console.log(log));
    }

    return { info, warn, alert, getSimpleLog: () => simplifylog };
};
