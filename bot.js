/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/*
 * Represents the extra configuration and state for the owofarmbot.
 * @typedef {Object} owofarmbot_stable_extra
 * @property {string} name - The name of the configuration.
 * @property {string} type - The type of the configuration.
 * @property {boolean} devmod - Indicates if the developer mode is enabled.
 * @property {boolean} istermux - Indicates if the bot is running on Termux.
 * @property {boolean} captchadetected - Indicates if a captcha has been detected.
 * @property {boolean} paused - Indicates if the bot is paused.
 * @property {boolean} owosupportserver - Indicates if the bot is connected to the owo support server.
 * @property {boolean} use - Indicates if the bot is in use.
 * @property {boolean} inventory - Indicates if the inventory feature is enabled.
 * @property {boolean} checklist - Indicates if the checklist feature is enabled.
 * @property {boolean} hunt - Indicates if the hunt feature is enabled.
 * @property {boolean} battle - Indicates if the battle feature is enabled.
 * @property {Object} total - The total counts of various activities.
 * @property {number} total.hunt - The total number of hunts.
 * @property {number} total.battle - The total number of battles.
 * @property {number} total.captcha - The total number of captchas.
 * @property {number} total.pray - The total number of prays.
 * @property {number} total.curse - The total number of curses.
 * @property {number} total.vote - The total number of votes.
 * @property {number} total.giveaway - The total number of giveaways.
 * @property {Object} gems - The configuration for gems.
 * @property {Array} gems.need - The list of needed gems.
 * @property {string} gems.use - The gem currently in use.
 * @property {boolean} gems.isevent - Indicates if there is an ongoing event.
 * @property {string} gems.rareLevel - The rare level of the gem.
 * @property {Object} gamble - The configuration for gambling.
 * @property {number} gamble.coinflip - The number of coin flips.
 * @property {number} gamble.slot - The number of slots played.
 * @property {number} gamble.cowoncywon - The amount of cowoncy won.
 * @property {Object} quest - The current quest information.
 * @property {string} quest.title - The title of the current quest.
 * @property {string} quest.reward - The reward for the current quest.
 * @property {string} quest.progress - The progress of the current quest.
 * @property {Object} temp - Temporary state information.
 * @property {boolean} temp.usedevent - Indicates if an event has been used.
 * @property {boolean} temp.usedcookie - Indicates if a cookie has been used.
 * @property {string} temp.animaltype - The type of animal currently being used.
 * @property {Object} temp.huntbot - The configuration for the hunt bot.
 * @property {string} temp.huntbot.maxtime - The maximum time for the hunt bot.
 * @property {number} temp.huntbot.recalltime - The recall time for the hunt bot.
 * @property {boolean} temp.huntbot.essence - Indicates if the hunt bot has essence.
 * @property {boolean} temp.isready - Indicates if the bot is ready.
 * @property {boolean} temp.started - Indicates if the bot has started.
 */

const cp = require("child_process");

let config,
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
    if (isTermux && (dep === "puppeteer" || dep === "puppeteer-real-browser")) {
        console.log("Skipping Puppeteer in Termux environment");
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

const additionalDeps = ["puppeteer", "puppeteer-real-browser"];

for (let dep of additionalDeps) {
    if (isTermux) {
        console.log(`Termux environment detected. Skipping ${dep}.`);
        continue;
    }

    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`${dep} is not installed. Installing ${dep}...`);
        try {
            cp.execSync(`npm install ${dep}`, { stdio: "inherit" });
        } catch (installErr) {
            console.error(`Failed to install ${dep}:`, installErr.message);
        }
    }
}

const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "webui"));
app.use("/assets", express.static(path.join(__dirname, "webui", "assets")));
app.get("/", (req, res) => {
    res.render("index");
});

const { initializeWebSocket, broadcast } = require("./utils/webserver.js");
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
    istermux: isTermux,
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
        solvedcaptcha: 0,
        pray: 0,
        curse: 0,
        vote: 0,
        giveaway: 0,
        huntbot: 0,
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
        huntbot: {
            maxtime: "",
            recalltime: 0,
            essence: false,
        },

        isready: false,
        started: false,
    },
};

let owofarmbot_stable_extra = {
    name: "owofarmbot_stable_extra",
    type: "Extra",
    devmod: DEVELOPER_MODE,
    istermux: isTermux,
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
        solvedcaptcha: 0,
        pray: 0,
        curse: 0,
        vote: 0,
        giveaway: 0,
        huntbot: 0,
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
        huntbot: {
            maxtime: "",
            recalltime: 0,
            essence: false,
        },
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
                chalk.green(`${client.global.paused ? "Paused" : "Running"}`),
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
client.broadcast = broadcast;

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
    extrac.broadcast = broadcast;
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

    client.logger.warn("Bot", "Startup", "Logging in...");
    await client.login(config.main.token);

    if (config.extra.enable) {
        ["aliases", "commands"].forEach((x) => (extrac[x] = new Collection()));

        fs.readdirSync("./handlers").forEach((file) => {
            require(`./handlers/${file}`)(extrac);
        });
        extrac.logger.warn("Bot", "Startup", "Logging in...");
        await extrac.login(config.extra.token);
        client.logger.warn("WebUI", "Startup", "Web Server Starting...");
        initializeWebSocket(client, extrac);
    } else {
        client.logger.warn("Bot", "Startup", "Web Server Starting...");
        initializeWebSocket(client);
    }

    client.logger.warn(
        "Bot",
        "Help",
        `Use \"${config.prefix}start\" to start the bot, \"${config.prefix}resume\" to resume, and \"${config.prefix}pause\" to pause.`,
    );

    app.listen(config.socket.expressport, () => {
        client.logger.info(
            "WebUI",
            "Startup",
            `WebUI started on http://localhost:${config.socket.expressport}`,
        );
    });
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
