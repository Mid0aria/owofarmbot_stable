/* eslint-disable no-undef */
/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/*
 * autovoter for top.gg
 * Arabam yapar hız
 * https://open.spotify.com/track/0K791kh3oLkBD5KVWg1LJ8?si=951700dbd6894508
 */

/**
 * Parses and returns command line arguments.
 *
 * @typedef {Object} Argv
 * @property {string} token - User token.
 * @property {string} botid - Id of the bot to vote for.
 *
 * @type {Argv}
 */

const { connect } = require("puppeteer-real-browser");
const yargs = require("yargs");
const argv = yargs.options({
    token: {
        alias: "t",
        describe: "User token",
        type: "string",
        demandOption: true,
    },
    botid: {
        alias: "bid",
        describe: "Id of the bot to vote for",
        type: "string",
        demandOption: true,
    },
}).argv;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    const authUrl =
        "https://discord.com/oauth2/authorize?scope=identify%20guilds%20email&redirect_uri=https%3A%2F%2Ftop.gg%2Flogin%2Fcallback&response_type=code&client_id=422087909634736160&state=Lw==";
    const { token, botid } = argv;

    const { browser, page } = await connect({
        headless: false,
        turnstile: true,
    });
    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.evaluateOnNewDocument((token) => {
        window.localStorage.setItem("token", `"${token}"`);
    }, token);

    await page.goto(authUrl, { waitUntil: "load" });

    await page.waitForSelector("div.action__3d3b0 button", { visible: true });
    await page.locator("div.action__3d3b0 button").setTimeout(3000).click();

    await page.waitForNavigation({ waitUntil: "load" });

    await delay(5000);
    const isLoggedIn = await page.evaluate(() => {
        return !document.body.innerText.includes("Login");
    });

    if (isLoggedIn) {
        let topgglink = `https://top.gg/bot/${botid}/vote`;
        await page.goto(topgglink, { waitUntil: "load" });

        while (true) {
            const isvoteable = await page.evaluate(() => {
                if (document.body.innerText.includes("You can vote now!")) {
                    return true;
                } else {
                    return false;
                }
            });

            if (isvoteable) {
                break;
            } else {
                await delay(2500);
            }
        }

        await page.evaluate(() => {
            const button = document.querySelector(
                "div.css-1yn6pjb button.chakra-button.css-1xwhzbv",
            );

            if (!button || button.disabled) {
                return;
            }

            button.click();
        });
        await delay(5000);
    } else {
        console.log("Authorization failed.");
    }

    await browser.close();
})();
