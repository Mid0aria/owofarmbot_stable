const notifier = require("node-notifier");
const config = require("../../config.json");

notifier.notify({
    title: "Captcha Detected!",
    message: `Solve the captcha and type ${config.prefix}resume in farm channel`,
    icon: "./assets/captcha.png",
    sound: true,
    wait: true,
    appID: "OwO Farm Bot Stable",
});
