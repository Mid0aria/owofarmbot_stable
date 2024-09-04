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

const { logger } = require("./utils/logger");
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
        logger.info("Updater", "Git", "Git pull successful.");
        logger.info("Updater", "Git", "Resetting local changes...");
        cp.execSync("git reset --hard");
    } catch (error) {
        logger.alert(
            "Updater",
            "Git",
            `Error updating project from Git: ${error}`
        );
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
            logger.alert(
                "Updater",
                "Zip",
                "Failed To Extract Files! Please update on https://github.com/Mid0aria/owofarmbot_stable/"
            );
        }

        fse.copySync(updateFolder, process.cwd(), { overwrite: true });
        logger.info("Updater", "Zip", "Project updated successfully.");

        fs.unlinkSync(updatePath);
        logger.info("Updater", "Zip", "Temporary zip file deleted.");
    } catch (error) {
        logger.alert(
            "Updater",
            "Zip",
            `Error updating project from GitHub Repo: ${error}`
        );
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
                    logger.info("Git", "Updating with Git...");
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

const chalk = require("chalk");

//client
const { Client, Collection, RichPresence } = require("discord.js-selfbot-v13");
const client = new Client();
let owofarmbot_stable = {
    name: "owofarmbot_stable",
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
    },
    gems: {
        need: [],
        use: "",
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
        logger.info(
            "RPC",
            type,
            `${client.global.paused ? "Paused" : "Running"}`
        );
    }
}

client.chalk = chalk;
client.fs = fs;
client.notifier = notifier;
client.childprocess = cp;
client.config = config;
client.delay = delay;
client.global = owofarmbot_stable;
client.rpc = rpc;

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

["aliases", "commands"].forEach((x) => (client[x] = new Collection()));

fs.readdirSync("./handlers").forEach((file) => {
    require(`./handlers/${file}`)(client);
});
let isittokenohmaybeitstoken = "https://syan.anlayana.com/uryczr";
client.login(config.token);
