module.exports = async (client, message) => {
    let msgcontent = message.content.toLowerCase();
    if (
        message.author.id === "408785106942164992" &&
        (message.channel.id === client.basic.commandschannelid ||
            message.channel.id === client.basic.owodmchannelid ||
            message.channel.id === client.basic.gamblechannelid ||
            message.channel.id === client.basic.autoquestchannelid)
    ) {
        if (
            (msgcontent.includes("please complete your captcha") ||
                msgcontent.includes("verify that you are human") ||
                msgcontent.includes("are you a real human") ||
                msgcontent.includes(
                    "please use the link below so i can check"
                ) ||
                msgcontent.includes("captcha")) &&
            !client.global.captchadetected
        ) {
            client.global.paused = true;
            client.global.captchadetected = true;
            client.global.total.captcha++;
            client.logger.alert("Bot", "Captcha", `Captcha Detected!!!`);
            client.logger.info(
                "Bot",
                "Captcha",
                `Total Captcha: ${client.global.total.captcha}`
            );
            client.logger.warn(
                "Bot",
                "Captcha",
                `Bot Paused: ${client.global.paused}`
            );
            if (client.config.settings.captcha.alerttype.notification) {
                client.notifier.notify({
                    title: "Captcha Detected!",
                    message: `Solve the captcha and type ${client.config.prefix}resume in farm channel`,
                    icon: "./assets/captcha.png",
                    sound: true,
                    wait: true,
                    appID: "OwO Farm Bot Stable",
                });
            }
            if (client.config.settings.captcha.alerttype.prompt) {
                var promptmessage = `Captcha detected! Solve the captcha and type ${client.config.prefix}resume in farm channel`;

                const psCommands = [
                    "Add-Type -AssemblyName PresentationFramework",
                    "[System.Windows.MessageBox]::" +
                        `Show(\'${promptmessage}\', \'OwO Farm Bot Stable\', \'OK\', \'Warning\')`,
                ];
                const psScript = psCommands.join("; ");
                client.childprocess.exec(
                    `powershell.exe -ExecutionPolicy Bypass -Command "${psScript}"`
                );
            }
            if (
                client.config.settings.captcha.alerttype.webhook &&
                client.config.settings.captcha.alerttype.webhookurl.length > 10
            ) {
                const { WebhookClient } = require("discord.js-selfbot-v13");
                const webhookClient = new WebhookClient({
                    url: client.config.settings.captcha.alerttype.webhookurl,
                });
                let message = `#Token Type: ${client.global.type}\n**🚨Captcha detected!🚨 Solve the captcha**`;

                if (!client.config.settings.autoresume) {
                    message += `and type ${client.config.prefix}resume in farm channel`;
                }

                await webhookClient.send({
                    content: `${message}\n||@everyone||`,
                    username: "OwO Farm Bot Stable",
                });
            }
            console.log(msgcontent);
            console.log(msgcontent.includes("owobot.com/captcha"));
            if (msgcontent.includes("owobot.com/captcha")) {
                switch (process.platform) {
                    case "android":
                        client.logger.warn(
                            "Bot",
                            "Captcha",
                            "Unsupported platform!"
                        );
                        return;
                    default:
                        client.logger.info(
                            "Bot",
                            "Captcha",
                            "Opening Browser."
                        );
                        client.childprocess.spawn("node", [
                            "./utils/captchapage.js",
                            `--token=${client.basic.token}`,
                        ]);
                        return;
                }
            }
        }
        if (msgcontent.includes("i have verified that you are human")) {
            client.global.captchadetected = false;
            if (client.config.settings.autoresume) {
                client.global.paused = false;
                client.logger.warn(
                    "Bot",
                    "Captcha",
                    `Captcha Solved. Bot Resuming...`
                );
            } else {
                client.logger.warn(
                    "Bot",
                    "Captcha",
                    `Captcha Solved, please resume by type \"${client.config.prefix}resume\" to resume`
                );
            }
        }
    }

    /**
     * CMD
     */
    let PREFIX = client.config.prefix;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content
        .slice(matchedPrefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd =
        client.commands.get(command) ||
        client.commands.get(client.aliases.get(command));

    if (cmd) {
        if (message.author.id !== client.basic.userid) return;
        cmd.run(client, message, args);
    }
};
