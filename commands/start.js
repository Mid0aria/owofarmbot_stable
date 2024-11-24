module.exports = {
    config: {
        name: "start",
    },
    run: async (client, channel, args) => {
        if (client.global.paused) {
            if (client.global.captchadetected) {
                client.global.captchadetected = false;
            }
            client.global.paused = false;
            client.rpc("update");
            if (!client.global.temp.started) {
                if (!client.global.temp.isready) {
                    client.logger.warn("Bot", "Startup", "Not ready yet!");
                    await channel.send({
                        content: `${client.global.type} thread not ready yet! Please wait...`,
                    });
                    return;
                }
                client.global.temp.started = true;
                if (client.config.settings.chatfeedback && channel) {
                    await channel.send({
                        content: `${client.global.type} thread started, have fun ;)`,
                    });
                }

                setTimeout(() => {
                    require("../utils/mainHandler.js")(client);
                }, 1000);
            } else {
                if (client.config.settings.chatfeedback && channel) {
                    await channel.send({
                        content: `Restarted ${client.global.type} thread after a pause :3`,
                    });
                }
            }
        } else {
            if (client.config.settings.chatfeedback && channel) {
                await channel.send({
                    content: `${client.global.type} thread is already working!!!`,
                });
            }
        }
    },
};
