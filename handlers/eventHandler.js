module.exports = async (client, message) => {
    const load = (dirs) => {
        const events = client.fs
            .readdirSync(`./events/${dirs}/`)
            .filter((d) => d.endsWith(".js"));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
        }
    };

    client.fs.readdirSync("./events/").forEach((x) => load(x));
    console.log(
        client.chalk.blue(client.chalk.bold(`Bot`)),
        client.chalk.white(`>>`),
        client.chalk.red(`Events`),
        client.chalk.green(`Succesfully loaded!`)
    );
};
