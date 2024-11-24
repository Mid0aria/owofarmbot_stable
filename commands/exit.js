module.exports = {
    config: {
        name: "exit",
    },
    run: async (client, channel, args) => {
        if (client.config.settings.chatfeedback && channel) {
            await channel.send({
                content: `Exitting...`,
            });
        }
        let exitlog = client.config.settings.logging.showlogbeforeexit && client.config.settings.logging.newlog;
        if (exitlog) {
            const fulllog = client.logger.getLog();
            console.log("//START OF LOG//");
            for (const logs of fulllog) console.log(logs);
            console.log("//END OF LOG//");
        }
        process.exit(0);
    },
};
