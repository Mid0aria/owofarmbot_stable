/* eslint-disable no-undef */
/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/*
 * BENDE VARRR 🤙🤙🤙🤙
 * https://open.spotify.com/track/1Ma4fLShd0hpZSNH37mEkR?si=fa52965f89434731
 */

const { connect } = require("puppeteer-real-browser");
const yargs = require("yargs");
const path = require("path");
const argv = yargs.options({
    token: {
        alias: "t",
        describe: "User token",
        type: "string",
        demandOption: true,
    },
}).argv;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    const authUrl =
        "https://discord.com/api/v9/oauth2/authorize?client_id=408785106942164992&response_type=code&redirect_uri=https%3A%2F%2Fowobot.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify%20guilds%20email%20guilds.members.read";
    const extentionpopup =
        "chrome-extension://hlifkpholllijblknnmbfagnkjneagid/popup/popup.html";

    const userToken = argv.token;

    const extensionPath = path.resolve(__dirname, "../utils/hcaptchasolver");

    const { browser, page } = await connect({
        headless: false,
        turnstile: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
        ],
    });

    await page.setViewport({
        width: 1200,
        height: 1080,
    });

    await page.goto(extentionpopup);

    await delay(3000);

    await page.evaluateOnNewDocument((token) => {
        window.localStorage.setItem("token", `"${token}"`);
    }, userToken);

    await page.goto(authUrl, { waitUntil: "load" });

    await page.waitForSelector("div.action_c5a065 button", { visible: true });
    await page.locator("div.action_c5a065 button").setTimeout(3000).click();

    await page.waitForNavigation({ waitUntil: "load" });

    const redirectedUrl = page.url();
    console.log(`Redirected URL: ${redirectedUrl}`);

    const isLoggedIn = await page.evaluate(() => {
        return !document.body.innerText.includes("Unauthorized");
    });

    if (isLoggedIn) {
        console.log("Authorization successful! The user has logged in.");

        const captchaUrl = `${redirectedUrl}captcha`;
        console.log(`Captcha URL: ${captchaUrl}`);

        await page.goto(captchaUrl, { waitUntil: "load" });
        console.log("Waiting for the captcha to be solved...");

        // let refreshCount = 0;
        // const maxRefreshAttempts = 35;

        while (true) {
            const isCaptchaOk = await page.evaluate(() => {
                if (
                    [
                        "I have verified that you're a human",
                        "You're free to go! c:",
                    ].some((text) => document.body.innerText.includes(text))
                ) {
                    return true;
                } else {
                    return false;
                }
            });

            /*  const needsRefresh = await page.evaluate(() => {
                if (
                    [
                        "Please click on the shape that breaks the pattern",
                        "Please click on the object that is not shiny",
                        "Fill the boxes with the required number of objects indicated.",
                        "click, hold and drag",
                        "click on the shape that breaks the pattern",
                    ].some((text) =>
                        document.body.innerText
                            .toLowerCase()
                            .includes(text.toLowerCase())
                    )
                ) {
                    return true;
                } else {
                    return false;
                }
            });*/

            if (isCaptchaOk) {
                console.log("Successfully solved captcha.");
                break;
            } /*else if (needsRefresh || refreshCount >= maxRefreshAttempts) {
                console.log("Refreshing captcha page...");
                await page.reload({ waitUntil: "load" });
                refreshCount = 0;
            }*/ else {
                console.log("Captcha not solved yet");
                // refreshCount++;
                await delay(2500);
            }
        }
    } else {
        console.log("Authorization failed.");
    }

    await browser.close();
})();
