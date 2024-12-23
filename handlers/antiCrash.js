module.exports = (client) => {
    process.on("unhandledRejection", (reason, p) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Unhandled Rejection/Catch`),
            client.chalk.red(reason, p),
        );
    });
    process.on("uncaughtException", (err, origin) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Unhandled Exception/Catch`),
            client.chalk.red(err, origin),
        );
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(
            client.chalk.blue(client.chalk.bold(`[antiCrash]`)),
            client.chalk.white(`>>`),
            client.chalk.magenta(`Uncaught Exception/Catch`),
            client.chalk.red(err, origin),
        );
    });
    client.logger.info("Bot", "AntiCrash", "Ready");
};
