module.exports = async (client) => {
    console.log(
        client.chalk.blue(client.chalk.bold(`Bot`)),
        client.chalk.white(`>>`),
        client.chalk.red(`${client.user.username}`),
        client.chalk.green(`is ready!`)
    );

    client.rpc("start");
};
