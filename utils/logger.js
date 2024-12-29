/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Displays logs and status information in a formatted console output.
 *
 * @param {Array} reallog - An array of log messages to be displayed.
 *
 * The function checks if the client and extrac (if available) are ready. If not, it logs the last message in the reallog array.
 * If the client and extrac are ready, it gathers various status information such as hunt count, battle count, event status,
 * coinflip count, slot count, cowoncy won, captcha detection status, and pause status from both client and extrac.
 * It then formats and displays this information in a structured console output.
 *
 * The function also includes a helper function `padder` to format the values for display.
 *
 * The output format varies based on the configuration settings for logging.
 */

let reallog = [];
let fulllog = [];
let client, extrac;
module.exports = (client) => {
    let logger = [];
    let length = client ? client.config.settings.logging.loglength : 16;
    if (client.global.type == "Main") client = client;
    else extrac = client;
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
        logging(type, module, result, client.chalk.green);
    }

    function warn(type, module, result = "") {
        logging(type, module, result, client.chalk.yellow);
    }

    function alert(type, module, result = "") {
        logging(type, module, result, client.chalk.red);
    }

    function logging(type, module, result, color) {
        const logMessage =
            `${client.chalk.white(`[${new Date().toLocaleTimeString()}]`)} ` +
            `${client.chalk.blue(client.chalk.bold(type))}` +
            `${
                // (type == "Bot" || type == "Updater") &&
                // module != "Startup" &&
                // module != "Captcha"
                //     ? "" //idk why i put this on
                //     :
                `${client.chalk.white(" >> ")}${client.chalk.cyan(
                    client.chalk.bold(client.global.type),
                )}`
            } > ` +
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
            (extrac && !extrac.global.temp.isready)
        ) {
            console.log(reallog[reallog.length - 1]);
            return;
        }

        //leave the var here if future need
        var mainHunt = client.global.total.hunt;
        var mainBattle = client.global.total.battle;
        var mainEvent = client.global.gems.isevent ? "Yes" : "No";
        var mainCF = client.global.gamble.coinflip;
        var mainSlot = client.global.gamble.slot;
        var mainCow = client.global.gamble.cowoncywon;
        var mainCaptcha = client.global.captchadetected
            ? client.chalk.red("Danger  ")
            : client.chalk.green("Safe    ");
        var mainPause = client.global.paused
            ? client.chalk.yellow("Paused  ")
            : client.chalk.cyan("Running ");

        if (extrac) {
            var extraHunt = extrac.global.total.hunt;
            var extraBattle = extrac.global.total.battle;
            var extraEvent = extrac.global.gems.isevent ? "Yes" : "No";
            var extraCF = extrac.global.gamble.coinflip;
            var extraSlot = extrac.global.gamble.slot;
            var extraCow = extrac.global.gamble.cowoncywon;
            var extraCaptcha = extrac.global.captchadetected
                ? client.chalk.red("Danger  ")
                : client.chalk.green("Safe    ");
            var extraPause = extrac.global.paused
                ? client.chalk.yellow("Paused  ")
                : client.chalk.cyan("Running ");
        }

        function padder(value) {
            let paddedText = "";
            let temp;
            if (value != null) temp = value.toString();
            else return "null";
            temp = temp.trim();

            let length = temp.length;
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
            extrac &&
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
                    extrac.global.quest.title
                }
║ ${extraCaptcha} ║ Total battle: ${padder(extraBattle, false)}║ ${
                    extrac.global.quest.reward
                }
║ ${extraPause} ║ Cowoncy won: ${padder(extraCow, false)} ║ ${
                    extrac.global.quest.progress
                }
╚══════════╩═══════════════════════╩════════════════════════════════════════════════
>>> Log`,
            );
            for (const logs of reallog) console.log(logs);
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
            for (const logs of reallog) console.log(logs);
        } else console.log(reallog[reallog.length - 1]);
    }

    return {
        info,
        warn,
        alert,
    };
};
