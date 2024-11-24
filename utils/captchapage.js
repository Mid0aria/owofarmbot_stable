const puppeteer = require("puppeteer");
const yargs = require("yargs");

const argv = yargs.option("token", {
    alias: "t",
    describe: "usertoken",
    type: "string",
    demandOption: true,
}).argv;

const userToken = argv.token;
(async () => {
    const authUrl =
        "https://discord.com/api/v9/oauth2/authorize?client_id=408785106942164992&response_type=code&redirect_uri=https%3A%2F%2Fowobot.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify%20guilds%20email%20guilds.members.read";

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
    console.log(`Yönlendirilen URL: ${redirectedUrl}`);

    const isLoggedIn = await page.evaluate(() => {
        return !document.body.innerText.includes("Unauthorized");
    });

    if (isLoggedIn) {
        console.log("Authorization successful! The user has logged in.");

        const captchaUrl = `${redirectedUrl}captcha`;
        console.log(`Captcha URL: ${captchaUrl}`);

        await page.goto(captchaUrl, { waitUntil: "load" });
        console.log("Waiting for the captcha to be solved...");

        // await page.waitForNavigation({ waitUntil: "load", timeout });

        await page.waitForSelector("input[type='text']", {
            visible: true,
            timeout: 160000,
        });
    } else {
        console.log("Authorization failed");
    }

    const iscaptchaok = await page.evaluate(() => {
        return document.body.innerText.includes(
            "It seems like you're not a bot"
        );
    });
    console.log(iscaptchaok);
    if (iscaptchaok) {
        console.log("User successfully solved captcha ");
    } else {
        console.log("User did not solve Captcha");
    }

    await browser.close();
})();
