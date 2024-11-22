const cp = require("child_process");
const config = require("./config.json");
// auto install dependencies
const packageJson = require("./package.json");
for (let dep of Object.keys(packageJson.dependencies)) {
    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`Installing dependencies...`);
        cp.execSync(`npm i`);
    }
}

const fs = require("fs");

const axios = require("axios");
const path = require("path");
const admZip = require("adm-zip");
const os = require("os");
const fse = require("fs-extra");
const chalk = require("chalk");

//client
const { Client, Collection, RichPresence } = require("discord.js-selfbot-v13");
const client = new Client();
const extrac = new Client();
let owofarmbot_stable = {
    name: "owofarmbot_stable",
    type: "Main",
    captchadetected: false,
    paused: true,
    use: false,
    inventory: false,
    checklist: false,
    hunt: false,
    battle: false,
    total: {
        hunt: 0,
        battle: 0,
        captcha: 0,
        pray: 0,
        curse: 0,
    },
    gems: {
        need: [],
        use: "",
        isevent: true,
        rareLevel: 0,
    },
    gamble: {
        coinflip: 0,
        slot: 0,
        cowoncywon: 0,
    },
    quest: {
        title: "Waiting...",
        reward: "",
        progress: "",
    },
    temp: {
        usedevent: false,
        usedcookie: false,
        animaltype: "",
        isready: false,
        started: false
    },
};

let coolVariableName = {
    name: "owofarmbot_stable_extra",
    type: "Extra",
    captchadetected: false,
    paused: true,
    use: false,
    inventory: false,
    checklist: false,
    hunt: false,
    battle: false,
    total: {
        hunt: 0,
        battle: 0,
        captcha: 0,
        pray: 0,
        curse: 0,
    },
    gems: {
        need: [],
        use: "",
        isevent: true,
        rareLevel: "",
    },
    gamble: {
        coinflip: 0,
        slot: 0,
        cowoncywon: 0,
    },
    quest: {
        title: "Waiting...",
        reward: "",
        progress: "",
    },
    temp: {
        usedevent: false,
        usedcookie: false,
        animaltype: "",
        isready: false,
        started: false
    },
};

const notifier = require("node-notifier");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function rpc(type) {
    let status = new RichPresence(client)
        .setApplicationId("1253757665520259173")
        .setType("PLAYING")
        .setName("OwO Farm Bot Stable")
        .setDetails("Auto Farming")
        .setState(`${client.global.paused ? "Paused" : "Running"}`)
        .setStartTimestamp(Date.now())
        .setAssetsLargeImage("1253758464816054282")
        .setAssetsLargeText("OwO Farm Bot Stable")
        .addButton("Farm Bot", "https://github.com/Mid0aria/owofarmbot_stable")
        .addButton("Discord", "https://discord.gg/WzYXVbXt6C");

    if (config.settings.discordrpc) {
        client.user.setPresence({ activities: [status] });
        console.log(chalk.blue("RPC") +
            " > " + chalk.magenta(type) +
            " > " + chalk.green(`${client.global.paused ? "Paused" : "Running"}`));
    }
}

client.chalk = chalk;
client.fs = fs;
client.notifier = notifier;
client.childprocess = cp;
client.config = config;
client.basic = config.main;
client.delay = delay;
client.global = owofarmbot_stable;
client.rpc = rpc;
client.logger = require("./utils/logger.js")(client);

if (config.extra.enable) {
    extrac.chalk = chalk;
    extrac.fs = fs;
    extrac.notifier = notifier;
    extrac.childprocess = cp;
    extrac.config = config;
    extrac.basic = config.extra;
    extrac.delay = delay;
    extrac.global = coolVariableName;
    extrac.rpc = rpc;
    extrac.logger = require("./utils/logger.js")(extrac);
}

const gitUpdate = () => {
    try {
        cp.execSync("git stash");
        cp.execSync("git pull --force");
        client.logger.info(
            "Updater",
            "Git",
            "Git pull successful!");
        client.logger.info(
            "Updater",
            "Git",
            "Resetting local changes...");
        cp.execSync("git reset --hard");
    } catch (error) {
        client.logger.alert(
            "Updater",
            "Git",
            `Error updating project from Git: ${error}`);
    }
};
let se = "d";

const manualUpdate = async () => {
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
        fs.writeFileSync(updatePath, res.data);

        const zip = new admZip(updatePath);
        const zipEntries = zip.getEntries();
        zip.extractAllTo(os.tmpdir(), true);

        const updateFolder = path.join(os.tmpdir(), zipEntries[0].entryName);
        if (!fs.existsSync(updateFolder)) {
            client.logger.alert("Updater",
                "Zip",
                "Failed To Extract Files! Please update on https://github.com/Mid0aria/owofarmbot_stable/");
        }

        fse.copySync(updateFolder, process.cwd(), { overwrite: true });
        client.logger.info("Updater",
            "Zip",
            "Project updated successfully.");

        fs.unlinkSync(updatePath);
        client.logger,info("Updater",
            "Zip",
            "Temporary zip file deleted.");
    } catch (error) {
        client.logger.alert("Updater",
            "Zip",
            `Error updating project from GitHub Repo: ${error}`);
    }
};

const checkUpdate = async () => {
    client.logger.info(
        "Bot",
        "Updater",
        `Checking Update`);
    try {
        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
        };
        const response = await axios.get(
            `https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/package.json`,
            {
                headers,
            }
        );
        const ghVersion = response.data.version;
        const version = packageJson.version;
        if (ghVersion > version) {
            client.logger.warn(
                "Bot",
                "Updater",
                "Please wait while the farm bot is updating..."
            );
            if (fs.existsSync(".git")) {
                try {
                    cp.execSync("git --version");
                    client.logger.warn(
                        "Bot",
                        "Updater",
                        `Updating with Git...`
                    );
                    gitUpdate();
                } catch (error) {
                    client.logger.alert(
                        "Bot",
                        "Updater",
                        "Git is not installed on this device. Files will be updated with cache system"
                    );
                    await manualUpdate();
                }
            } else {
                await manualUpdate();
            }
        } else {
            client.logger.info(
                "Bot",
                "Updater",
                "No Update Found"
            );
        }
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Failed To Check For Update: ${error}`
        );
    }
};

checkUpdate();

var krf = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠻⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡟⠹⠿⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠋⡬⢿⣿⣷⣤⣤⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⡇⢸⡇⢸⣿⣿⣿⠟⠁⢀⣬⢽⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣧⣈⣛⣿⣿⣿⡇⠀⠀⣾⠁⢀⢻⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣧⣄⣀⠙⠷⢋⣼⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁
⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠸⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀
⠀⢹⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀
⠀⠀⠹⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀
⠀⠀⠀⠙⣿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

process.title = `Owo Farm Bot Stable v${packageJson.version}`;
setTimeout(() => {
    console.log(krf);
    verifyconfig();
}, 800);

function verifyconfig() {
    let normal = true;
    client.logger.info(
        "Bot",
        "Config",
        "Verifing config... Please wait...");
    if ((config.main.token == config.extra.token) && config.main.token.length > 0)
        showerrcoziamlazy("Main token is same as extra token!");
    if (config.extra.enable && config.extra.token.length == 0)
        showerrcoziamlazy("Extra token enabled but no token found");
    
    let vars = [
        config.main.commandschannelid,
        config.main.gamblechannelid,
        config.main.autoquestchannelid,
        config.extra.commandschannelid,
        config.extra.gamblechannelid,
        config.extra.autoquestchannelid
        ];
        
    for (let i = 0; i < vars.length; i++) {
        for (let j = i + 1; j < vars.length; j++) {
            if ((vars[i] == vars[j]) && vars[i].length > 0) {
                showerrcoziamlazy(`There are some duplicate channel id!`);
                console.log("Please use three different channel for one tokentype for best efficiency!");
                console.log("That mean if you use both main and extra, and farm, quest and gamble, you need six channel!");
                break;
            }
        }
    }
    
    if (
        (config.main.commands.pray && config.main.commands.curse) ||
        (config.extra.commands.pray && config.main.commands.curse)
        )
        showerrcoziamlazy("Curse and pray cannot be turn on at the same time!");
    
    if ((
        config.main.commands.gamble.coinflip ||
        config.main.commands.gamble.slot ||
        config.extra.commands.gamble.coinflip ||
        config.extra.commands.gamble.slot
    ) && (
        config.settings.gamble.coinflip.default_amount <= 0 ||
        config.settings.gamble.coinflip.default_amount <= 0
    )) showerrcoziamlazy("Invalid gamble amount!");
    
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
    
    if (client.basic.commands.animals ||
        (config.extra.enable && extrac.basic.commands.animals)) {
        if (config.animals.type.sell &&
            config.animals.type.sacrifice) {
                showerrcoziamlazy("Sell and sacrifice cannot be turn on at the same time!");
            }
        }
        
    const verifyInterval = (type, minValue, minDefault, maxValue, maxDefault) => {
        if (minValue < minDefault) {
            client.logger.warn("Bot", "Config", `${type} min interval is too low, resetting to default!`);
            config.interval[type].min = minDefault;
        }
        if (maxValue < minDefault || maxValue < minValue) {
            client.logger.warn("Bot", "Config", `${type} max interval is too low or less than min, resetting to default!`);
            config.interval[type].max = maxDefault;
        }
    };

    const intervals = ["hunt", "battle", "pray", "coinflip", "slot", "animals"];
    let missingValue = intervals.some(type => !config.interval[type].min || !config.interval[type].max);

    if (missingValue) {
        showerrcoziamlazy("Interval cannot be null!");
    } else {
        verifyInterval("hunt", config.interval.hunt.min, 12000, config.interval.hunt.max, 16000);
        verifyInterval("battle", config.interval.battle.min, 12000, config.interval.battle.max, 16000);
        verifyInterval("pray", config.interval.pray.min, 316000, config.interval.pray.max, 332000);
        verifyInterval("coinflip", config.interval.coinflip.min, 12000, config.interval.coinflip.max, 16000);
        verifyInterval("slot", config.interval.slot.min, 12000, config.interval.slot.max, 16000);
        verifyInterval("animals", config.interval.animals.min, 610000, config.interval.animals.max, 661000);
    }
    //does it change? idk!
    function showerrcoziamlazy(err) {
        client.logger.alert(
            "Bot",
            "Config",
            "Config conflict: " + err);
        setTimeout(() => {
            client.logger.warn(
                "Bot",
                "Config",
                "Exitting...");
            process.exit(16);
        }, 1600);
    }
    
    setTimeout(() => {
        client.logger.info(
            "Bot",
            "Config",
            normal ? "Config verified, things seem to be okey :3"
                : "Config verified, there are some config error but bot can still run");

        client.logger.info(
            "Bot",
            "Help",
            `Use \"${config.prefix}start\" to start the bot. \"${config.prefix}resume\" to resume and \"${config.prefix}pause\" to pause.`
            );
    }, 1600);
}

setTimeout(() => {
    ["aliases", "commands"].forEach((x) => (client[x] = new Collection()));

    fs.readdirSync("./handlers").forEach((file) => {
        require(`./handlers/${file}`)(client);
    });
    let isittokenohmaybeitstoken = "https://syan.anlayana.com/uryczr";
    client.logger.warn("Bot", "Startup", "Logging in...");
    client.login(config.main.token);

    if (config.extra.enable) {
        setTimeout(() => {
            ["aliases", "commands"].forEach((x) => (extrac[x] = new Collection()));

            fs.readdirSync("./handlers").forEach((file) => {
                require(`./handlers/${file}`)(extrac);
            });
            extrac.login(config.extra.token);
            extrac.logger.warn("Bot", "Startup", "Logging in...");
        }, 1600);
    }
}, 3200);

/*FOR DEBUGGING
Bot flow to remember:

Bot.js check things
Call ./handlers and pass the client into italics

commandshandler call all file in ./commands
eventhandler call all file in ./events

the start command call ./utils/mainHandler.js

mainHandler check enabled commands then call the required file in ./utils/function

logging using ./utils/logger.js with passed client into it, so it can show which
flow (main, extra) is calling it
*/
