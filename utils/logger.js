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

module.exports = (client) => {
    let reallog = [],
        fulllog = [],
        loggerextrac;

    let length = client ? client.config.settings.logging.loglength : 16;
    if (client.global.type == "Extra") {
        loggerextrac = client;
    }
    let exitlog =
        client.config.settings.logging.showlogbeforeexit &&
        client.config.settings.logging.newlog;
    process.on("SIGINT", () => {
        if (exitlog) {
            for (const logs of fulllog) console.log(logs);
            console.log("//END OF LOG//");
        }
        process.exit(0);
    });

    function info(type, module, result = "") {
        logging("ℹ️", type, module, result, client.chalk.green);
    }

    function warn(type, module, result = "") {
        logging("⚠️", type, module, result, client.chalk.yellow);
    }

    function alert(type, module, result = "") {
        logging("❗", type, module, result, client.chalk.red);
    }

    function logging(emoji, type, module, result, color) {
        const logMessage =
            `${client.chalk.white(`[${new Date().toLocaleTimeString()}]`)} ` +
            `${client.chalk.white(emoji)} ` +
            `${client.chalk.blue(client.chalk.bold(type))}` +
            `${`${client.chalk.white(" >> ")}${client.chalk.cyan(
                client.chalk.bold(client.global.type),
            )}`} > ` +
            `${client.chalk.magenta(module)} > ` +
            `${color(result)}`;

        reallog.push(logMessage);
        if (exitlog) fulllog.push(logMessage);
        if (reallog.length >= length) reallog.shift();
        showlog(reallog);
    }

    function showlog(reallog) {
        //no client
        if (
            !client.global.temp.isready ||
            (loggerextrac && !loggerextrac.global.temp.isready)
        ) {
            console.log(reallog[reallog.length - 1]);
            return;
        }

        //leave the var here if future need
        var mainHunt = client.global.total.hunt;
        var mainBattle = client.global.total.battle;
        var mainEvent = client.global.gems.isevent ? "Yes" : "No";
        // var mainCF = client.global.gamble.coinflip;
        // var mainSlot = client.global.gamble.slot;
        var mainCow = client.global.gamble.cowoncywon;
        var mainCaptcha = client.global.captchadetected
            ? client.chalk.red("Danger  ")
            : client.chalk.green("Safe    ");
        var mainPause = client.global.paused
            ? client.chalk.yellow("Paused  ")
            : client.chalk.cyan("Running ");

        if (loggerextrac) {
            var extraHunt = loggerextrac.global.total.hunt;
            var extraBattle = loggerextrac.global.total.battle;
            // var extraEvent = loggerextrac.global.gems.isevent ? "Yes" : "No";
            // var extraCF = loggerextrac.global.gamble.coinflip;
            // var extraSlot = loggerextrac.global.gamble.slot;
            var extraCow = loggerextrac.global.gamble.cowoncywon;
            var extraCaptcha = loggerextrac.global.captchadetected
                ? client.chalk.red("Danger  ")
                : client.chalk.green("Safe    ");
            var extraPause = loggerextrac.global.paused
                ? client.chalk.yellow("Paused  ")
                : client.chalk.cyan("Running ");
        }

        function padder(value) {
            let paddedText = "";
            let temp;
            if (value != null) temp = value.toString();
            else return "null";
            temp = temp.trim();

            if (temp.length < 9) {
                paddedText = temp.padEnd(8, " ");
                return paddedText;
            } else {
                paddedText = temp.slice(0, 6).padEnd(7, " ") + "+";
                return paddedText;
            }
        }

        if (
            client.config.extra.enable &&
            loggerextrac &&
            client.config.settings.logging.newlog
        ) {
            console.clear();
            console.log(
                `╔══════════╦═══════════════════════╦════════════════════════════════════════════════
║ Token    ║ Status                ║ Questing
╠══════════╬═══════════════════════╬════════════════════════════════════════════════
║ Main     ║ Total hunt: ${padder(mainHunt, false)}  ║ ${
                    client.global.quest.title
                }
║ ${mainCaptcha} ║ Total battle: ${padder(mainBattle, false)}║ ${
                    client.global.quest.reward
                }
║ ${mainPause} ║ Cowoncy won: ${padder(mainCow, false)} ║ ${
                    client.global.quest.progress
                }
╠══════════╬═══════════════════════╬════════════════════════════════════════════════
║ Extra    ║ Total hunt: ${padder(extraHunt, false)}  ║ ${
                    loggerextrac.global.quest.title
                }
║ ${extraCaptcha} ║ Total battle: ${padder(extraBattle, false)}║ ${
                    loggerextrac.global.quest.reward
                }
║ ${extraPause} ║ Cowoncy won: ${padder(extraCow, false)} ║ ${
                    loggerextrac.global.quest.progress
                }
╚══════════╩═══════════════════════╩════════════════════════════════════════════════
>>> Log`,
            );
            for (const logs of reallog) {
                console.log(logs);
            }
        } else if (client.config.settings.logging.newlog) {
            console.clear();
            console.log(
                `╔══════════════════════╦══════════╦═══════════════════════════════════════════════
║ Name                 ║ Status   ║ Questing
╠══════════════════════╬══════════╬═══════════════════════════════════════════════
║ Total hunt           ║ ${padder(mainHunt, false)} ║ > Title
║ Total battle         ║ ${padder(mainBattle, false)} ║ ${
                    client.global.quest.title
                } 
║ Having event         ║ ${padder(mainEvent, false)} ║ > Reward
║ Total cowoncy won    ║ ${padder(mainCow, false)} ║ ${
                    client.global.quest.reward
                }
║ Safety level         ║ ${mainCaptcha} ║ > Progress
║ Running?             ║ ${mainPause} ║ ${client.global.quest.progress}
╚══════════════════════╩══════════╩═══════════════════════════════════════════════
>>> Log`,
            );
            for (const logs of reallog) {
                console.log(logs);
            }
        } else {
            console.log(reallog[reallog.length - 1]);
        }
    }

    return {
        info,
        warn,
        alert,
    };
};
