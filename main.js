/* eslint-disable no-unused-vars */
/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */
process.emitWarning = (warning, type) => {
    if (type === "DeprecationWarning") {
        return;
    }
    console.warn(warning);
};

const cp = require("child_process");

const isTermux =
    process.env.PREFIX && process.env.PREFIX.includes("com.termux");

const packageJson = require("./package.json");

// auto install dependencies
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

const cluster = require("cluster");
const path = require("path");
const fs = require("fs").promises;
const express = require("express");
const bodyParser = require("body-parser");
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

if (cluster.isMaster) {
    const app = express();
    app.set("view engine", "ejs");
    app.use(bodyParser.json());
    app.set("views", path.join(__dirname, "webui"));
    app.use("/assets", express.static(path.join(__dirname, "webui", "assets")));

    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/api/get-config", async (req, res) => {
        try {
            let data;
            if (DEVELOPER_MODE) {
                data = await fs.readFile(
                    path.join(__dirname, "./developer/config.json"),
                    "utf8",
                );
            } else {
                data = await fs.readFile(
                    path.join(__dirname, "./config.json"),
                    "utf8",
                );
            }

            res.json(JSON.parse(data));
        } catch (err) {
            console.error("Config okuma hatası:", err);
            res.status(500).json({ error: "Failed to read config file" });
        }
    });

    async function updateConfig(settings) {
        let configPath;
        if (DEVELOPER_MODE) {
            configPath = path.join(__dirname, "./developer/config.json");
        } else {
            configPath = path.join(__dirname, "./config.json");
        }

        let currentConfig = {};
        try {
            const configFile = await fs.readFile(configPath, "utf8");
            currentConfig = JSON.parse(configFile);
        } catch (err) {
            console.error("Config okuma hatası:", err);
        }

        const convertedSettings = {};

        for (const [key, value] of Object.entries(settings)) {
            if (key === "settingtype") continue;

            const keys = key.split("-");
            let current = convertedSettings;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            const lastKey = keys[keys.length - 1];

            current[lastKey] = value;
        }

        const updatedConfig = deepMerge(currentConfig, convertedSettings);

        await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2));

        return updatedConfig;
    }

    function deepMerge(target, source) {
        if (typeof target !== "object" || typeof source !== "object")
            return source;

        for (const key in source) {
            if (
                typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }

        return target;
    }

    app.post("/save-settings", async (req, res) => {
        try {
            const settings = req.body;

            const updatedConfig = await updateConfig(settings);

            config = updatedConfig;

            res.json({
                message:
                    "Settings have been saved. Please reboot to take effect!",
                type: "warning",
            });
        } catch (error) {
            console.error("Settings kaydetme hatası:", error);
            res.status(500).json({
                message: "Settings could not be saved. Please try again!",
                type: "error",
            });
        }
    });

    cluster.fork();

    cluster.on("exit", () => {
        //this is useful when anticrash cannot anticrash, but i will make user define it
        if (config.settings.autoresume) {
            console.log("The bot is down, restarting...");
            cluster.fork();
        }
    });
} else {
    require("./bot.js");
}
