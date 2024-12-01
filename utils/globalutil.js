/**
 * TODO backup the config file before updates and integrate it into the new config
 *
 */

const axios = require("axios");
const path = require("path");
const admZip = require("adm-zip");
const os = require("os");
const fse = require("fs-extra");
const net = require("net");
const readline = require("readline");

/**
 *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *
 */

exports.checkUpdate = async (client, cp, packageJson) => {
    const askUser = (question) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim().toLowerCase());
            });
        });
    };
    client.logger.info("Bot", "Updater", `Checking Update`);
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const response = await axios.get(
            `https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/package.json`,
            { headers }
        );
        const ghVersion = response.data.version;
        const version = packageJson.version;
        if (ghVersion > version) {
            client.logger.warn("Bot", "Updater", "A new update is available.");
            client.logger.info(
                "Bot",
                "Updater"`New Version Notes: ${response.data.version_note}`
            );
            const userResponse = await askUser(
                "Would you like to update now? (yes/no): "
            );

            if (userResponse === "yes" || userResponse === "y") {
                client.logger.warn(
                    "Bot",
                    "Updater",
                    "Please wait while the farm bot is updating..."
                );
                if (fse.existsSync(".git")) {
                    try {
                        cp.execSync("git --version");
                        client.logger.warn(
                            "Bot",
                            "Updater",
                            `Updating with Git...`
                        );
                        gitUpdate(client, cp);
                    } catch (error) {
                        client.logger.alert(
                            "Bot",
                            "Updater",
                            "Git is not installed on this device. Files will be updated with cache system"
                        );
                        await manualUpdate(client);
                    }
                } else {
                    await manualUpdate(client);
                }
            } else {
                client.logger.info("Bot", "Updater", "Update skipped by user.");
            }
        } else {
            client.logger.info("Bot", "Updater", "No Update Found");
        }
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Failed To Check For Update: ${error}`
        );
    }
};

const gitUpdate = (client, cp) => {
    try {
        cp.execSync("git stash");
        cp.execSync("git pull --force");
        client.logger.info("Updater", "Git", "Git pull successful!");
        client.logger.info("Updater", "Git", "Resetting local changes...");
        cp.execSync("git reset --hard");
    } catch (error) {
        client.logger.alert(
            "Updater",
            "Git",
            `Error updating project from Git: ${error}`
        );
    }
};

const manualUpdate = async (client) => {
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const res = await axios.get(
            `https://github.com/Mid0aria/owofarmbot_stable/archive/master.zip`,
            {
                responseType: "arraybuffer",
                headers,
            }
        );

        const updatePath = path.resolve(__dirname, "updateCache.zip");
        fse.writeFileSync(updatePath, res.data);

        const zip = new admZip(updatePath);
        const zipEntries = zip.getEntries();
        zip.extractAllTo(os.tmpdir(), true);

        const updateFolder = path.join(os.tmpdir(), zipEntries[0].entryName);
        if (!fse.existsSync(updateFolder)) {
            client.logger.alert(
                "Updater",
                "Zip",
                "Failed To Extract Files! Please update on https://github.com/Mid0aria/owofarmbot_stable/"
            );
        }

        fse.copySync(updateFolder, process.cwd(), { overwrite: true });
        client.logger.info("Updater", "Zip", "Project updated successfully.");

        fse.unlinkSync(updatePath);
        client.logger, info("Updater", "Zip", "Temporary zip file deleted.");
    } catch (error) {
        client.logger.alert(
            "Updater",
            "Zip",
            `Error updating project from GitHub Repo: ${error}`
        );
    }
};

/**
 *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *
 */

exports.verifyconfig = async (client, extrac, config) => {
    let normal = true;
    client.logger.info("Bot", "Config", "Verifying Config... Please wait...");
    if (config.main.token == config.extra.token && config.main.token.length > 0)
        showerrcoziamlazy("Main token is same as extra token!");
    if (config.extra.enable && config.extra.token.length == 0)
        showerrcoziamlazy("Extra token enabled but no token found");

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
        for (let j = i + 1; j < vars.length; j++) {
            if (vars[i] == vars[j] && vars[i].length > 0) {
                showerrcoziamlazy(`There are some duplicate channel id!`);
                console.log(
                    "Please use four different channel for one tokentype for best efficiency!"
                );
                console.log(
                    "That mean if you use both main and extra, and farm, huntbot, quest and gamble, you need eight channel!"
                );
                break;
            }
        }
    }

    if (
        (config.main.commands.pray && config.main.commands.curse) ||
        (config.extra.commands.pray && config.main.commands.curse)
    )
        showerrcoziamlazy("Curse and pray cannot be turn on at the same time!");

    if (
        (config.main.commands.gamble.coinflip ||
            config.main.commands.gamble.slot ||
            config.extra.commands.gamble.coinflip ||
            config.extra.commands.gamble.slot) &&
        (config.settings.gamble.coinflip.default_amount <= 0 ||
            config.settings.gamble.coinflip.default_amount <= 0)
    )
        showerrcoziamlazy("Invalid gamble amount!");

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
                        "Bot" + chalk.white(" >> ") + client.global.type,
                        "Config",
                        "Gem rarity: Invalid value. Valid value is: \n\tfabled, legendary, mythical, epic, rare, uncommon, common"
                    ); //not a critical error, no halting
                    client.global.rareLevel = 7;
                    break;
            }
        }

        if (client.basic.commands.animals) {
            let type = "";
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
                    "Bot" + chalk.white(" >> ") + client.global.type,
                    "Config",
                    "Animals: no active animaltype found!?"
                );
            }
        }
    }

    if (
        client.basic.commands.animals ||
        (config.extra.enable && extrac.basic.commands.animals)
    ) {
        if (config.animals.type.sell && config.animals.type.sacrifice) {
            showerrcoziamlazy(
                "Sell and sacrifice cannot be turn on at the same time!"
            );
        }
    }

    const verifyInterval = (
        type,
        minValue,
        minDefault,
        maxValue,
        maxDefault
    ) => {
        if (minValue < minDefault) {
            client.logger.warn(
                "Bot",
                "Config",
                `${type} min interval is too low, resetting to default!`
            );
            config.interval[type].min = minDefault;
        }
        if (maxValue < minDefault || maxValue < minValue) {
            client.logger.warn(
                "Bot",
                "Config",
                `${type} max interval is too low or less than min, resetting to default!`
            );
            config.interval[type].max = maxDefault;
        }
    };

    const intervals = ["hunt", "battle", "pray", "coinflip", "slot", "animals"];
    let missingValue = intervals.some(
        (type) => !config.interval[type].min || !config.interval[type].max
    );

    if (missingValue) {
        showerrcoziamlazy("Interval cannot be null!");
    } else {
        verifyInterval(
            "hunt",
            config.interval.hunt.min,
            12000,
            config.interval.hunt.max,
            16000
        );
        verifyInterval(
            "battle",
            config.interval.battle.min,
            12000,
            config.interval.battle.max,
            16000
        );
        verifyInterval(
            "pray",
            config.interval.pray.min,
            316000,
            config.interval.pray.max,
            332000
        );
        verifyInterval(
            "coinflip",
            config.interval.coinflip.min,
            12000,
            config.interval.coinflip.max,
            16000
        );
        verifyInterval(
            "slot",
            config.interval.slot.min,
            12000,
            config.interval.slot.max,
            16000
        );
        verifyInterval(
            "animals",
            config.interval.animals.min,
            610000,
            config.interval.animals.max,
            661000
        );
    }
    //does it change? idk!
    function showerrcoziamlazy(err) {
        client.logger.alert("Bot", "Config", "Config conflict: " + err);
        setTimeout(() => {
            client.logger.warn("Bot", "Config", "Exitting...");
            process.exit(16);
        }, 1600);
    }

    client.logger.info(
        "Bot",
        "Config",
        normal
            ? "Config verified, things seem to be okey :3"
            : "Config verified, there are some config error but bot can still run"
    );
};

/**
 *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *  *
 *
 *
 *
 *
 *
 *
 */
exports.isPortInUse = (port, host = "localhost") => {
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
