const puppeteer = require("puppeteer");
const yargs = require("yargs");
const argv = yargs.options({
    token: {
        alias: "t",
        describe: "User token",
        type: "string",
        demandOption: true,
    },
    solve: {
        alias: "s",
        describe: "Solve captcha with 3th party services",
        type: "boolean",
        demandOption: false,
    },
    service: {
        alias: "serv",
        describe: "Solve captcha with 3th party services",
        type: "string",
        demandOption: false,
    },
    servicetoken: {
        alias: "st",
        describe: "Solve captcha with 3th party services",
        type: "string",
        demandOption: false,
    },
}).argv;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    const authUrl =
        "https://discord.com/api/v9/oauth2/authorize?client_id=408785106942164992&response_type=code&redirect_uri=https%3A%2F%2Fowobot.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify%20guilds%20email%20guilds.members.read";
    const userToken = argv.token;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 1080,
    });

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
        /* try {
            await page.waitForSelector('iframe[src*="hcaptcha.com"]', {
                visible: true,
                timeout: 3000,
            });
        } catch (error) {
            console.log("iframe not found");
        }*/

        //TODO: add 3th party captcha solve services
        if (argv.solve) {
            const hcaptchaKey = await page.evaluate(() => {
                const hcaptchaElement =
                    document.querySelector("[data-sitekey]");
                return hcaptchaElement
                    ? hcaptchaElement.getAttribute("data-sitekey")
                    : null;
            }); // not sure if it works, need to test it

            const servicekey = argv.servicetoken; // service api token
            switch (argv.service) {
                case "x":
                    //code that will make captcha solve
                    break;
                case "y":
                    //code that will make captcha solve
                    break;
                default:
                    break;
            }
        }

        while (true) {
            const isCaptchaOk = await page.evaluate(() => {
                return document.body.innerText.includes(
                    "I have verified that you're a human"
                );
            });

            if (isCaptchaOk) {
                console.log("User successfully solved captcha.");
                break;
            } else {
                console.log("User did not solve the captcha.");
                await delay(2500);
            }
        }
    } else {
        console.log("Authorization failed.");
    }

    await browser.close();
})();
