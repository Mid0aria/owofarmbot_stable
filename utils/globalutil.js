/* eslint-disable no-control-regex */
/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * ! zip updater not working properly, missing variables are not printed when printing back after config backup
 *
 */

/**
 * Backs up the configuration file to a temporary directory.
 *
 * @param {Object} client - The client object that contains the logger.
 * @param {string} configPath - The path to the configuration file to be backed up.
 * @returns {Promise<string>} - A promise that resolves to the path of the backup file.
 * @throws {Error} - Throws an error if the temp directory or config file does not exist, or if the backup fails.
 */

const path = require("path");
const fse = require("fs-extra");
const net = require("net");
const readline = require("readline");
exports.askUser = async (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};

exports.verifyconfig = async (client, extrac, config) => {
    let normal = true;
    client.logger.info("Bot", "Config", "Verifying Config... Please wait...");
    if (
        config.main.token == config.extra.token &&
        config.main.token.length > 0
    ) {
        normal = false;
        showerrcoziamlazy("Main token is same as extra token!");
    }
    if (config.extra.enable && config.extra.token.length == 0) {
        normal = false;
        showerrcoziamlazy("Extra token enabled but no token found");
    }

    let vars = [
        config.main.commandschannelid,
        config.main.huntbotchannelid,
        config.main.gamblechannelid,
        config.main.autoquestchannelid,
        config.extra.commandschannelid,
        config.extra.huntbotchannelid,
        config.extra.gamblechannelid,
        config.extra.autoquestchannelid,
    ];

    for (let i = 0; i < vars.length; i++) {
        let c = false;
        for (let j = i + 1; j < vars.length; j++) {
            if (vars[i] == vars[j] && vars[i].length > 0) {
                c = true;
                normal = false;
                showerrcoziamlazy(`There are some duplicate channel id!`);
                console.log(
                    "Please use four different channel for one tokentype for best efficiency!",
                );
                console.log(
                    "That mean if you use both main and extra, and farm, huntbot, quest and gamble, you need eight channel!",
                );
                break;
            }
        }
        if (c) break;
    }

    if (config.main.commands.pray && config.main.commands.curse) {
        config.main.commands.curse = false;
        client.basic.curse = false;

        showerrcoziamlazy(
            "Curse and pray cannot be turn on at the same time! By default pray will be used.",
        );
    }
    if (config.extra.commands.pray && config.extra.commands.curse) {
        config.extra.commands.curse = false;
        client.basic.curse = false;
        showerrcoziamlazy(
            "Curse and pray cannot be turn on at the same time! By default pray will be used.",
        );
    }
    if (
        (config.main.commands.gamble.coinflip ||
            config.main.commands.gamble.slot ||
            config.extra.commands.gamble.coinflip ||
            config.extra.commands.gamble.slot) &&
        (config.settings.gamble.coinflip.default_amount <= 0 ||
            config.settings.gamble.coinflip.default_amount <= 0)
    ) {
        normal = false;
        showerrcoziamlazy("Invalid gamble amount!");
    }

    let clients = [client];
    if (config.extra.enable) clients.push(extrac);
    for (const client of clients) {
        if (client.basic.maximum_gem_rarity.length > 0) {
            switch (client.basic.maximum_gem_rarity.toLowerCase()) {
                case "fabled":
                    client.global.rareLevel = 7;
                    break;
                case "legendary":
                    client.global.rareLevel = 6;
                    break;
                case "mythical":
                    client.global.rareLevel = 5;
                    break;
                case "epic":
                    client.global.rareLevel = 4;
                    break;
                case "rare":
                    client.global.rareLevel = 3;
                    break;
                case "uncommon":
                    client.global.rareLevel = 2;
                    break;
                case "common":
                    client.global.rareLevel = 1;
                    break;
                default:
                    normal = false;
                    client.logger.warn(
                        "Bot" + client.chalk.white(" >> ") + client.global.type,
                        "Config",
                        "Gem rarity: Invalid value. Valid value is: \n\tfabled, legendary, mythical, epic, rare, uncommon, common",
                    ); //not a critical error, no halting
                    client.global.rareLevel = 7;
                    break;
            }
        }

        if (client.basic.commands.animals) {
            // let type = "";
            let animaltypes = client.config.animals.animaltype;
            for (const [type, isEnabled] of Object.entries(animaltypes)) {
                if (!isEnabled) continue;

                switch (type) {
                    case "common":
                        client.global.temp.animaltype += " c";
                        break;
                    case "uncommon":
                        client.global.temp.animaltype += " u";
                        break;
                    case "rare":
                        client.global.temp.animaltype += " r";
                        break;
                    case "epic":
                        client.global.temp.animaltype += " e";
                        break;
                    case "mythical":
                        client.global.temp.animaltype += " m";
                        break;
                    case "patreon":
                        client.global.temp.animaltype += " p";
                        break;
                    case "cpatreon":
                        client.global.temp.animaltype += " cp";
                        break;
                    case "legendary":
                        client.global.temp.animaltype += " l";
                        break;
                    case "gem":
                        client.global.temp.animaltype += " g";
                        break;
                    case "bot":
                        client.global.temp.animaltype += " b";
                        break;
                    case "distorted":
                        client.global.temp.animaltype += " d";
                        break;
                    case "fabled":
                        client.global.temp.animaltype += " f";
                        break;
                    case "special":
                        client.global.temp.animaltype += " s";
                        break;
                    case "hidden":
                        client.global.temp.animaltype += " h";
                        break;
                    default:
                        break;
                }
            }
            if (client.global.temp.animaltype.length < 1) {
                normal = false;
                client.logger.warn(
                    "Bot" + client.chalk.white(" >> ") + client.global.type,
                    "Config",
                    "Animals: no active animaltype found!?",
                );
            }
        }
    }

    if (
        client.basic.commands.animals ||
        (config.extra.enable && extrac.basic.commands.animals)
    ) {
        if (config.animals.type.sell && config.animals.type.sacrifice) {
            normal = false;
            showerrcoziamlazy(
                "Sell and sacrifice cannot be turn on at the same time!",
            );
        }
    }

    const verifyInterval = (
        type,
        minValue,
        minDefault,
        maxValue,
        maxDefault,
    ) => {
        if (minValue < minDefault) {
            client.logger.warn(
                "Bot",
                "Config",
                `${type} min interval is too low, resetting to default!`,
            );
            config.interval[type].min = minDefault;
        }
        if (maxValue < minDefault || maxValue < minValue) {
            client.logger.warn(
                "Bot",
                "Config",
                `${type} max interval is too low or less than min, resetting to default!`,
            );
            config.interval[type].max = maxDefault;
        }
    };

    const intervals = ["hunt", "battle", "pray", "coinflip", "slot", "animals"];
    let missingValue = intervals.some(
        (type) => !config.interval[type].min || !config.interval[type].max,
    );

    if (missingValue) {
        showerrcoziamlazy("Interval cannot be null!");
    } else {
        verifyInterval(
            "hunt",
            config.interval.hunt.min,
            12000,
            config.interval.hunt.max,
            16000,
        );
        verifyInterval(
            "battle",
            config.interval.battle.min,
            12000,
            config.interval.battle.max,
            16000,
        );
        verifyInterval(
            "pray",
            config.interval.pray.min,
            316000,
            config.interval.pray.max,
            332000,
        );
        verifyInterval(
            "coinflip",
            config.interval.coinflip.min,
            12000,
            config.interval.coinflip.max,
            16000,
        );
        verifyInterval(
            "slot",
            config.interval.slot.min,
            12000,
            config.interval.slot.max,
            16000,
        );
        verifyInterval(
            "animals",
            config.interval.animals.min,
            610000,
            config.interval.animals.max,
            661000,
        );
    }
    //does it change? idk!
    function showerrcoziamlazy(err) {
        client.logger.alert("Bot", "Config", "Config conflict: " + err);
    }

    if (normal) {
        client.logger.info(
            "Bot",
            "Config",
            "Config verified, things seem to be okey :3",
        );
    } else {
        setTimeout(() => {
            client.logger.warn("Bot", "Config", "Exiting...");
            process.exit(0);
        }, 1600);
        client.logger.alert(
            "Bot",
            "Config",
            "Config is not verified or contains errors, please check the logs and fix the errors!",
        );
    }
};

exports.isPortInUse = async (port, host = "localhost") => {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.once("error", (err) => {
            if (err.code === "ECONNREFUSED") {
                resolve(false);
            } else {
                reject(err);
            }
        });

        socket.once("connect", () => {
            resolve(true);
            socket.end();
        });

        socket.connect(port, host);
    });
};

exports.removeInvisibleChars = (str) => {
    const invisibleRegex = /[\u0000-\u001F\u007F\u200B-\u200D\uFEFF]/g;
    return str.replace(invisibleRegex, "");
};

exports.gatherUserDetails = async (config, tokentype, client) => {
    const askValidInput = async (question, validator) => {
        let input;
        do {
            input = await exports.askUser(question);
            if (!validator(input)) {
                console.log("❌ Invalid value! Please try again.");
            }
        } while (!validator(input));
        return input;
    };

    const isValidToken = (token) =>
        /^[\w-]{24}\.[\w-]{6}\.[\w-]{27}$|^mfa\.[\w-]+$|^[\w-]+\.[\w-]+\.[\w-]+$/.test(
            token,
        );

    const isValidID = (id) => /^\d+$/.test(id);

    if (tokentype == "main") {
        const existingConfig = { ...config.main };

        const updatedValues = {
            token: await askValidInput("Enter your token: ", isValidToken),
            userid: (
                await askValidInput("Enter your user ID: ", isValidID)
            ).toString(),
            commandschannelid: (
                await askValidInput(
                    "Enter your commands channel ID: ",
                    isValidID,
                )
            ).toString(),
            huntbotchannelid: (
                await askValidInput(
                    "Enter your hunt bot channel ID: ",
                    isValidID,
                )
            ).toString(),
            owodmchannelid: (
                await askValidInput("Enter your OwO DM channel ID: ", isValidID)
            ).toString(),
            gamblechannelid: (
                await askValidInput("Enter your gamble channel ID: ", isValidID)
            ).toString(),
            autoquestchannelid: (
                await askValidInput(
                    "Enter your autoquest channel ID: ",
                    isValidID,
                )
            ).toString(),
        };
        config.firstrun = false;
        config.main = {
            ...existingConfig,
            ...updatedValues,
        };

        const configPath = client.global.devmod
            ? path.join(__dirname, "../developer/config.json")
            : path.join(__dirname, "../config.json");

        fse.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");

        console.log("✅ Config updated successfully!");
    }

    if (tokentype == "extra") {
        const existingConfig = { ...config.extra };
        const updatedValues = {
            token: await askValidInput(
                "Enter your Extra account token: ",
                isValidToken,
            ),
            userid: await askValidInput(
                "Enter your Extra account user ID: ",
                isValidID,
            ),
            commandschannelid: await askValidInput(
                "Enter your Extra account commands channel ID: ",
                isValidID,
            ),
            huntbotchannelid: await askValidInput(
                "Enter your Extra account hunt bot channel ID: ",
                isValidID,
            ),
            owodmchannelid: await askValidInput(
                "Enter your Extra account OwO DM channel ID: ",
                isValidID,
            ),
            gamblechannelid: await askValidInput(
                "Enter your Extra account gamble channel ID: ",
                isValidID,
            ),
            autoquestchannelid: await askValidInput(
                "Enter your Extra account autoquest channel ID: ",
                isValidID,
            ),
        };
        config.firstrun = false;
        config.extra = {
            ...existingConfig,
            ...updatedValues,
        };

        const configPath = client.global.devmod
            ? path.join(__dirname, "../developer/config.json")
            : path.join(__dirname, "../config.json");

        fse.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
        console.log("✅ Config updated successfully!");
    }
};
