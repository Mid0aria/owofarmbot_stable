module.exports = async (client, message) => {
    let msgcontent = message.content.toLowerCase();

    if (
        !message.author.id === "408785106942164992" &&
        (message.channel.id === client.basic.commandschannelid ||
            message.channel.id === client.basic.owodmchannelid)
    ) {
        if (
        (
            msgcontent.includes("please complete your captcha") ||
            msgcontent.includes("verify that you are human") ||
            msgcontent.includes("are you a real human") ||
            msgcontent.includes("please use the link below so i can check")
        ) && !client.global.captchadetected) {
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

            if (msgcontent.includes("owobot.com/captcha")) {
                let captchabrowserexecute, executeCommand;

                switch (process.platform) {
                    case "win32":
                        captchabrowserexecute = "start";
                        executeCommand = (command) =>
                            client.childprocess.exec(command);
                        break;
                    case "darwin":
                        captchabrowserexecute = "open";
                        executeCommand = (command) =>
                            client.childprocess.spawn(command, [
                                "https://owobot.com/captcha",
                            ]);
                        break;
                    case "android":
                        return;
                    case "linux":
                        captchabrowserexecute = "xdg-open";
                        executeCommand = (command) =>
                            client.childprocess.spawn(command, [
                                "https://owobot.com/captcha",
                            ]);
                        break;
                    default:
                        client.logger.warn("Bot", "Captcha", "Unsupported platform!");
                        return;
                }

                if (captchabrowserexecute) {
                    client.logger.info("Bot", "Captcha", "Opening Browser.");
                    executeCommand(
                        `${captchabrowserexecute} https://owobot.com/captcha`
                    );
                }
            }
        }
        if (msgcontent.includes("i have verified that you are human")) {
            client.global.captchadetected = false;
            //client.global.paused = false;
            client.logger.warn("Bot", "Captcha", `Captcha Solved. Bot Resuming...`);
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
