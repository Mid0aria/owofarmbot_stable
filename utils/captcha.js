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

/**
 * Evaluates the page content to determine if the captcha verification is successful.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the captcha verification text is found, otherwise `false`.
 */

const { connect } = require("puppeteer-real-browser");
const yargs = require("yargs");
const path = require("path");
const config = require("../config.json");
const argv = yargs.options({
    token: {
        alias: "t",
        describe: "User token",
        type: "string",
        demandOption: true,
    },
    userid: {
        alias: "uid",
        describe: "User ID",
        type: "string",
        demandOption: true,
    },
}).argv;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    let captchasolved = false;
    let socketcaptchastatus = false;
    let socket;
    function connectWebSocket() {
        socket = new WebSocket(`ws://localhost:${config.socket.websocket}`);

        socket.onopen = function () {
            console.log("WebSocket bağlantısı başarılı.");
        };

        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log("Gelen mesaj:", data);
            if (data.action == "closechrome" && data.userid == argv.userid) {
                socketcaptchastatus = true;
            }
        };

        socket.onerror = function (error) {
            console.error("WebSocket Hatası:", error);
        };

        socket.onclose = function () {
            console.log("ws baglantisi yok amk");

            setTimeout(connectWebSocket, 1000);
        };
    }

    connectWebSocket();

    while (true) {
        const authUrl =
            "https://discord.com/api/v9/oauth2/authorize?client_id=408785106942164992&response_type=code&redirect_uri=https%3A%2F%2Fowobot.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify%20guilds%20email%20guilds.members.read";
        const extentionpopup =
            "chrome-extension://hlifkpholllijblknnmbfagnkjneagid/popup/popup.html";

        const userToken = argv.token;

        const extensionPath = path.resolve(
            __dirname,
            "../utils/hcaptchasolver",
        );

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

        await page.waitForSelector("div.action__3d3b0 button", {
            visible: true,
        });
        await page.locator("div.action__3d3b0 button").setTimeout(3000).click();

        await page.waitForNavigation({ waitUntil: "load" });

        const redirectedUrl = page.url();
        console.log(`Redirected URL: ${redirectedUrl}`);

        const isLoggedIn = await page.evaluate(() => {
            return !document.body.innerText.includes("Unauthorized");
        });
        const isInvalidAuth = await page.evaluate(() => {
            return document.body.innerText.includes(
                'Invalid "code" in request.',
            );
        });
        const isRateLimit = await page.evaluate(() => {
            return document.body.innerText.includes(
                "You are being rate limited for requesting too many tokens",
            );
        });
        if (isRateLimit) {
            console.log("Rate limit detected. Waiting for 5 minutes...");
            await browser.close();
            await delay(300000);
            continue;
        } else if (isLoggedIn && !isInvalidAuth) {
            console.log("Authorization successful! The user has logged in.");

            const captchaUrl = `https://owobot.com/captcha`;
            console.log(`Captcha URL: ${captchaUrl}`);

            await page.goto(captchaUrl, { waitUntil: "load" });
            console.log("Waiting for the captcha to be solved...");
            let refreshcount = 0;
            while (true) {
                if (socketcaptchastatus) {
                    console.log("Socket message received, closing browser...");
                    captchasolved = true;
                    await browser.close();
                    process.exit(1);
                    break;
                }
                let needsRefresh = false;
                const isCaptchaOk = await page.evaluate(() => {
                    if (
                        [
                            "I have verified that you're a human",
                            "You're free to go! c:",
                        ].some((t) => document.body.innerText.includes(t))
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                });

                const isCaptchaFail = await page.evaluate(() => {
                    if (
                        [
                            "Captcha failed",
                            "Please reload the page and try again",
                            "reload the page",
                            "failed.",
                            "the page and try again.",
                        ].some((t) => document.body.innerText.includes(t))
                    ) {
                        return true;
                    } else {
                        false;
                    }
                });

                const iframeHandle = await page.$(
                    'iframe[src*="hcaptcha"][src*="frame=challenge"]',
                );
                let iframeDocument;
                if (iframeHandle) {
                    iframe = await iframeHandle.contentFrame();

                    if (iframe) {
                        const iframecontent = await iframe.evaluate(
                            () => document.body.innerText,
                        );
                        iframeDocument = iframe.contentDocument;
                        console.log(iframeDocument);

                        const captchaTexts = [
                            "Please click on the character that represents a quantity or can be used for counting",
                            "Please click, hold, and drag the shape to complete the pattern",
                            "Please click, hold, and drag one of the elements on the right to complete the pairs",
                            "Please click on the shape that breaks the pattern",
                            "Please click on the object that is not shiny",
                            "Fill the boxes with the required number of objects indicated.",
                            "drag each missing peach",
                            "click, hold and drag",
                            "click, hold, and drag",
                            "click on the shape that breaks the pattern",
                        ];
                        needsRefresh = captchaTexts.some((text) =>
                            iframecontent.includes(text),
                        );
                    }
                } else {
                    console.log(
                        "Iframe with hcaptcha and frame=challenge not found.",
                    );
                }

                if (isCaptchaOk) {
                    console.log("Successfully solved captcha.");
                    captchasolved = true;
                    break;
                } else if (isCaptchaFail) {
                    refreshcount = 0;
                    needsRefresh = false;
                    await page.reload({ waitUntil: "load" });
                } else if (needsRefresh) {
                    console.log("Refreshing captcha...");
                    if (refreshcount < 1) {
                        await page.reload({ waitUntil: "load" });
                        refreshcount++;
                    } else {
                        /**
                         * TODO REFRESH BUTON BULMUYOR OE
                         */
                        // const refreshButton =
                        //     await iframeDocument.querySelector(".refresh.button");
                        // if (refreshButton) {
                        //     await refreshButton.click();
                        // } else {
                        //     console.log("Refresh button not found");
                        // }
                    }
                } else {
                    console.log("Captcha not solved yet");
                    await delay(1000);
                }
            }
        } else {
            console.log("Authorization failed.");
        }
        if (captchasolved) {
            await browser.close();
            process.exit(1);
            break;
        }
    }
})();
