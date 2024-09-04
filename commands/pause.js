module.exports = {
    config: {
        name: "pause",
        aliases: ["stop"],
    },
    run: async (client, message, args) => {
        if (client.global.paused) {
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({
                    content: "Bot is already paused!!!",
                });
            }
        } else {
            client.global.paused = true;
            client.rpc("update");
            await message.delete();
            if (client.config.settings.chatfeedback) {
                await message.channel.send({ content: "Paused :)" });
            }

            // process.exit(0);
        }
    },
};
