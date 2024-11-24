let client, extrac;

module.exports = async (ehe, message, command, args = []) =>  {
    let channel;
    if (ehe.global.type == "Main") client = ehe;
    else extrac = ehe;
    
    if (message) channel = ehe.channels.cache.get(message.channel.id);
    
    if (!command) return;
    
    switch (command.toLowerCase()) {
        case "start":
            if (!args[0]) {
                ehe.commands.get("start").run(ehe);
            } else {
                const start = async (client) => {
                    const cmd = client.commands.get("start");
                    if (cmd) await cmd.run(client, channel);
                }
                switch (args[0].toLowerCase()) {
                    case "all":
                        await start(client);
                        await start(extrac);
                        break;
                    case "main":
                        await start(client);
                        break;
                    case "extra":
                        await start(extrac);
                        break;
                    default:
                        break;
                }
            }
            break;
        case "resume":
            if (!args[0]) {
                ehe.commands.get("resume").run(ehe);
            } else {
                const resume = async (client) => {
                    const cmd = client.commands.get("resume");
                    if (cmd) await cmd.run(client, channel);
                }
                switch (args[0].toLowerCase()) {
                    case "all":
                        await resume(client);
                        await resume(extrac);
                        break;
                    case "main":
                        await resume(client);
                        break;
                    case "extra":
                        await resume(extrac);
                        break;
                    default:
                        break;
                }
            }
            break;
        case "pause":
            if (!args[0]) {
                ehe.commands.get("pause").run(ehe);
            } else {
                const pause = async (client) => {
                    const cmd = client.commands.get("pause");
                    if (cmd) await cmd.run(client, channel);
                }
                switch (args[0].toLowerCase()) {
                    case "all":
                        await pause(client);
                        await pause(extrac);
                        break;
                    case "main":
                        await pause(client);
                        break;
                    case "extra":
                        await pause(extrac);
                        break;
                    default:
                        break;
                }
            }
            break;
        case "exit":
            ehe.commands.get("exit").run(ehe);
            break;
        default:
            break;
    }
}
