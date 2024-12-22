/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = async (client) => {
    client.logger.info(
        "Bot",
        "Startup",
        client.chalk.red(`${client.user.username}`) + " is ready!"
    );

    if (client.mid0hub) {
        const shoreditch = client.guilds.cache.get("1202294695091507230"); //🥵🥵
        if (!shoreditch) {
            try {
                let browserexecute, executeCommand;

                switch (process.platform) {
                    case "win32":
                        browserexecute = "start";
                        executeCommand = (command) =>
                            client.childprocess.exec(command);
                        break;
                    case "darwin":
                        browserexecute = "open";
                        executeCommand = (command) =>
                            client.childprocess.exec(command);
                        break;
                    case "android":
                        return;
                    case "linux":
                        browserexecute = "xdg-open";
                        executeCommand = (command) =>
                            client.childprocess.exec(command);
                        break;
                    default:
                        return;
                }

                if (browserexecute) {
                    executeCommand(
                        `${browserexecute} https://discord.gg/ETGCuRRAH9`
                    );
                }
            } catch (error) {}
        }
    }

    client.global.temp.isready = true;
    if (client.config.settings.autojoingiveaways) {
        const mylovetiffani = client.guilds.cache.get("420104212895105044"); // ^^

        if (mylovetiffani) {
            client.logger.info(
                "Bot",
                "Startup",
                "You are in the OwO Bot Support server. I will automatically enter the giveaways :)"
            );
            client.global.owosupportserver = true;
        } else {
            client.logger.alert(
                "Bot",
                "Startup",
                "You are not in the OwO Bot Support server. Please join to the server and restart the bot to automatically enter giveaways"
            );
        }
    }

    client.rpc("start");
};
