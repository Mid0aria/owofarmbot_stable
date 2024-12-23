/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

const { connect } = require("puppeteer-real-browser");
const path = require("path");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
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

    const extentionpopup =
        "chrome-extension://hlifkpholllijblknnmbfagnkjneagid/popup/popup.html";

    await page.goto(extentionpopup);

    await delay(3000);

    await page.goto("https://accounts.hcaptcha.com/demo");

    let refreshCount = 0;
    const maxRefreshAttempts = 35;

    while (true) {
        const isCaptchaOk = await page.evaluate(() => {
            if (document.body.innerText.includes("Challenge Success!")) {
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
                ].some((text) => document.body.innerText.includes(text))
            ) {
                return true;
            } else {
                return false;
            }
        });*/

        if (isCaptchaOk) {
            console.log("Successfully solved captcha.");
            break;
        } /* else if (needsRefresh || refreshCount >= maxRefreshAttempts) {
            console.log("Refreshing captcha page...");
            await page.reload({ waitUntil: "load" });
            refreshCount = 0;
        }*/ else {
            console.log("Captcha not solved yet");
            refreshCount++;
            await delay(2500);
        }
    }
    await browser.close();
})();
