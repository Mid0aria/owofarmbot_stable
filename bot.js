const cp = require("child_process");

let config,
    canujoinmyserver = true, //* change to false if you don't want to join the server
    DEVELOPER_MODE = false;
try {
    const os = require("os");
    if (
        os.userInfo().username === "Mido" ||
        os.userInfo().username === "enter ur pc username here"
    ) {
        DEVELOPER_MODE = true;
    }

    if (DEVELOPER_MODE) {
        config = require("./developer/config.json");
        canujoinmyserver = false;
    } else {
        config = require("./config.json");
    }
} catch (error) {
    console.log("ur bot hosting is gay");
    config = require("./config.json");
}

// auto install dependencies
const isTermux =
    process.env.PREFIX && process.env.PREFIX.includes("com.termux");
const packageJson = require("./package.json");

for (let dep of Object.keys(packageJson.dependencies)) {
    if (isTermux && dep === "puppeteer") {
        console.log("Skipping Puppeteer");
        continue;
    }

    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`Installing dependencies...`);
        try {
            cp.execSync(`npm install ${dep}`, { stdio: "inherit" });
        } catch (installErr) {
            console.error(`Failed to install ${dep}:`, installErr.message);
        }
    }
}

const fs = require("fs");
const chalk = require("chalk");
const globalutil = require("./utils/globalutil.js");
const { getRandomBanner } = require("./utils/banner.js");

//client
const { Client, Collection, RichPresence } = require("discord.js-selfbot-v13");
const client = new Client();
const extrac = new Client();
let owofarmbot_stable = {
    name: "owofarmbot_stable",
    type: "Main",
    devmod: DEVELOPER_MODE,
    captchadetected: false,
    paused: true,
    owosupportserver: false,
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
        huntbotmaxtime: "",
        huntbotessence: false,
        isready: false,
        started: false,
    },
};

let owofarmbot_stable_extra = {
    name: "owofarmbot_stable_extra",
    type: "Extra",
    devmod: DEVELOPER_MODE,
    captchadetected: false,
    paused: true,
    owosupportserver: false,
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
        huntbotmaxtime: "",
        huntbotessence: false,
        isready: false,
        started: false,
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
        console.log(
            chalk.blue("RPC") +
                " > " +
                chalk.magenta(type) +
                " > " +
                chalk.green(`${client.global.paused ? "Paused" : "Running"}`)
        );
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
client.globalutil = globalutil;
client.mid0hub = canujoinmyserver;

if (config.extra.enable) {
    extrac.chalk = chalk;
    extrac.fs = fs;
    extrac.notifier = notifier;
    extrac.childprocess = cp;
    extrac.config = config;
    extrac.basic = config.extra;
    extrac.delay = delay;
    extrac.global = owofarmbot_stable_extra;
    extrac.rpc = rpc;
    extrac.logger = require("./utils/logger.js")(extrac);
    extrac.globalutil = globalutil;
    extrac.mid0hub = canujoinmyserver;
}

process.title = `Owo Farm Bot Stable v${packageJson.version}`;
(async () => {
    console.log(getRandomBanner());
    await globalutil.checkUpdate(client, cp, packageJson);
    await globalutil.verifyconfig(client, extrac, config);

    ["aliases", "commands"].forEach((x) => (client[x] = new Collection()));

    fs.readdirSync("./handlers").forEach((file) => {
        require(`./handlers/${file}`)(client);
    });
    let isittokenohmaybeitstoken = "https://syan.anlayana.com/uryczr";
    client.logger.warn("Bot", "Startup", "Logging in...");
    await client.login(config.main.token);

    if (config.extra.enable) {
        ["aliases", "commands"].forEach((x) => (extrac[x] = new Collection()));

        fs.readdirSync("./handlers").forEach((file) => {
            require(`./handlers/${file}`)(extrac);
        });
        extrac.logger.warn("Bot", "Startup", "Logging in...");
        await extrac.login(config.extra.token);
    }

    client.logger.warn(
        "Bot",
        "Help",
        `Use \"${config.prefix}start\" to start the bot, \"${config.prefix}resume\" to resume, and \"${config.prefix}pause\" to pause.`
    );
})();

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
