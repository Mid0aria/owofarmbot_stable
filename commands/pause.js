module.exports = {
    config: {
        name: "pause",
    },
    run: async (client, channel, args) => {
        if (client.global.paused) {
            if (client.config.settings.chatfeedback) {
                await channel.send({
                    content: `${client.global.type} thread is already paused!!!`,
                });
            }
        } else {
            client.global.paused = true;
            client.rpc("update");
            if (client.config.settings.chatfeedback) {
                await channel.send({ content: `Paused ${client.global.type} thread :)` });
            }
        }
    },
};
