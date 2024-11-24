module.exports = {
    config: {
        name: "resume",
    },
    run: async (client, channel, args) => {
        if (client.global.paused) {
            if (client.global.captchadetected) {
                client.global.captchadetected = false;
            }
            client.global.paused = false;
            client.rpc("update");
            if (client.config.settings.chatfeedback) {
                await channel.send({ content: `Resuming ${client.global.type} thread :)` });
            }
        } else {
            if (client.config.settings.chatfeedback) {
                await channel.send({
                    content: `${client.global.type} thread is already working!!!`,
                });
            }
        }
    },
};
