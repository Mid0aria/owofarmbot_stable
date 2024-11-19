module.exports = async (client) => {
    client.logger.info(
        "Bot",
        "Startup",
        client.chalk.red(`${client.user.username}`) + " is ready!"
        );
    
    client.global.temp.isready = true;

    client.rpc("start");
};
