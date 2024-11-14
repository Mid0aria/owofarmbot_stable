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

const gitUpdate = () => {
    try {
        cp.execSync("git stash");
        cp.execSync("git pull --force");
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Git") +
            " > " + chalk.green("Git pull successful."));
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Git") +
            " > " + chalk.green("Resetting local changes..."));
        cp.execSync("git reset --hard");
    } catch (error) {
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Git") +
            " > " + chalk.red(`Error updating project from Git: ${error}`));
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
            console.log(chalk.blue("Updater") +
                " > " + chalk.magenta("Zip") +
                " > " + chalk.red("Failed To Extract Files! Please update on https://github.com/Mid0aria/owofarmbot_stable/"));
        }

        fse.copySync(updateFolder, process.cwd(), { overwrite: true });
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Zip") +
            " > " + chalk.green("Project updated successfully."));

        fs.unlinkSync(updatePath);
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Zip") +
            " > " + chalk.green("Temporary zip file deleted."));
    } catch (error) {
        console.log(chalk.blue("Updater") +
            " > " + chalk.magenta("Zip") +
            " > " + chalk.red(`Error updating project from GitHub Repo: ${error}`));
    }
};

const checkUpdate = async () => {
    console.log(
        chalk.blue(chalk.bold(`Updater`)),
        chalk.white(`>>`),
        chalk.yellow(`Checking Update`)
    );
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
            console.log(
                chalk.blue(chalk.bold("Updater")),
                chalk.white(`>>`),
                chalk.yellow("Please wait while the farm bot is updating...")
            );
            if (fs.existsSync(".git")) {
                try {
                    cp.execSync("git --version");
                    console.log(
                        chalk.blue(chalk.bold(`Git`)),
                        chalk.white(`>>`),
                        chalk.yellow(`Updating with Git...`)
                    );
                    gitUpdate();
                } catch (error) {
                    console.log(
                        chalk.blue(chalk.bold("Git")),
                        chalk.white(`>>`),
                        chalk.red(
                            "Git is not installed on this device. Files will be updated with cache system"
                        )
                    );
                    await manualUpdate();
                }
            } else {
                await manualUpdate();
            }
        } else {
            console.log(
                chalk.blue(chalk.bold("Updater")),
                chalk.white(`>>`),
                chalk.yellow("No Update Found")
            );
        }
    } catch (error) {
        console.log(
            chalk.blue(chalk.bold("Updater")),
            chalk.white(`>>`),
            chalk.red(`Failed To Check For Update: ${error}`)
        );
    }
};

checkupdate(); // for real

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
        title: "",
        reward: "",
        progress: "",
    },
    temp: {
        usedevent: false,
        usedcookie: false,
    },
};

let owofarmbot_stable_extra = {
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
        title: "",
        reward: "",
        progress: "",
    },
    temp: {
        usedevent: false,
        usedcookie: false,
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
console.log(krf);

function verifyconfig() {
    console.log("Verifing config... Please wait...");
    if ((config.main.token == config.extra.token) && config.main.token.length > 0)
        showerrcoziamlazy("Main token is same as extra token!");
    
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
                showerrcoziamlazy(`${vars[i]} is equal to ${vars[j]}`);
                console.log("Please use three different channel for one tokentype for best efficiency!");
                console.log("That mean if you use both main and extra, you need six channel!");
            }
        }
    }
    
    if (
        (config.main.commands.pray && config.main.commands.curse) ||
        (config.extra.commands.pray && config.main.commands.curse)
        )
        showerrcoziamlazy("Curse and pray cannot be turn on at the same time!");
        
    if (config.animals.type.sell && config.animals.type.sacrifice)
        showerrcoziamlazy("Sell and sacrifice cannot be turn on at the same time!");
    
    if (config.animals.interval && config.animals.interval < 16000)
        showerrcoziamlazy("Animals interval is too low!");
    
    if ((
        config.main.commands.gamble.coinflip ||
        config.main.commands.gamble.slot ||
        config.extra.commands.gamble.coinflip ||
        config.extra.commands.gamble.slot
    ) && (
        config.settings.gamble.coinflip.default_amount <= 0 ||
        config.settings.gamble.coinflip.default_amount <= 0
    )) showerrcoziamlazy("Invalid gamble amount!");
    
    function showerrcoziamlazy(err) {
        console.log(chalk.red("Config conflict: ") + err);
        setTimeout(() => {
            console.log("Exitting...");
            process.exit(16);
        }, 1600);
    }
    
    setTimeout(() => {
        console.log("Config verified, things seem to be okey :3");
    }, 3200);
}
verifyconfig();

setTimeout(() => {
    ["aliases", "commands"].forEach((x) => (client[x] = new Collection()));
    
    fs.readdirSync("./handlers").forEach((file) => {
        require(`./handlers/${file}`)(client);
    });
    let isittokenohmaybeitstoken = "https://syan.anlayana.com/uryczr";
    console.log(
        chalk.blue(chalk.bold(`Bot`)),
        chalk.white(`>>`),
        chalk.blue("Main"),
        chalk.white(`>>`),
        chalk.green(`Logging in...`)
    );
    client.login(config.main.token);
    
    if (config.extra.enable) {
        setTimeout(() => {
            ["aliases", "commands"].forEach((x) => (extrac[x] = new Collection()));
    
            fs.readdirSync("./handlers").forEach((file) => {
                require(`./handlers/${file}`)(extrac);
            });
            extrac.login(config.extra.token);
            console.log(
                chalk.blue(chalk.bold(`Bot`)),
                chalk.white(`>>`),
                chalk.blue("Extra"),
                chalk.white(`>>`),
                chalk.green(`Logging in...`)
            );
        }, 1600);
    }
}, 3200);
