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

    while (true) {
        let needsRefresh = false;
        // Check if captcha is solved
        const isCaptchaOk = await page.evaluate(() => {
            return document.body.innerText.includes("Challenge Success!");
        });

        // Access iframe and check for captcha-related text
        const iframeHandle = await page.$(
            'iframe[src*="hcaptcha"][src*="frame=challenge"]',
        );

        if (iframeHandle) {
            const iframe = await iframeHandle.contentFrame(); // Access to iframe's content Frame object

            if (iframe) {
                const iframecontent = await iframe.evaluate(
                    () => document.body.innerText,
                );
                const captchaTexts = [
                    "Please click on the character that represents a quantity or can be used for counting",
                    "Please click, hold, and drag the shape to complete the pattern",
                    "Please click, hold, and drag one of the elements on the right to complete the pairs",
                    "Please click on the shape that breaks the pattern",
                    "Please click on the object that is not shiny",
                    "Fill the boxes with the required number of objects indicated.",
                    "click, hold and drag",
                    "click, hold, and drag",
                    "click on the shape that breaks the pattern",
                ];
                needsRefresh = captchaTexts.some((text) =>
                    iframecontent.includes(text),
                );
            }
        } else {
            console.log("Iframe with hcaptcha and frame=challenge not found.");
        }
        console.log(`Is Refresh Need?: ${needsRefresh}`);

        if (isCaptchaOk) {
            console.log("Successfully solved captcha.");
            break;
        } else if (needsRefresh) {
            console.log("Refreshing captcha page...");
            await page.reload({ waitUntil: "load" });
        } else {
            console.log("Captcha not solved yet");

            await delay(1000);
        }
    }

    await browser.close();
})();
