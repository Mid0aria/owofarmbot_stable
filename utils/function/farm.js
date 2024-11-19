const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client, message) => {
    let channel = client.channels.cache.get(client.basic.commandschannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }
    
    if (client.basic.commands.hunt) {
        hunt(client, channel);
    }
    if (client.basic.commands.battle) {
        if (client.basic.commands.hunt) {
            await client.delay(2000);
            battle(client, channel);
        }
    }
}

async function hunt(client, channel) {
    const triggerhunt = async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.inventory ||
            client.global.checklist ||
            client.global.hunt
        )
            return;
        if (client.global.battle) await client.delay(1500);
        client.global.hunt = true;
        let id;
        await channel
            .send({
                content: `${commandrandomizer([
                    "owo",
                    client.config.settings.owoprefix,
                ])} ${commandrandomizer(["h", "hunt"])}`,
            })
            .then(async (huntmsg) => {
                id = huntmsg.id;
                client.global.total.hunt++;
                client.logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.total.hunt}`
                );
                if (client.config.settings.inventory.use.gems) {
                    let message = await getMessage();
                    async function getMessage() {
                        return new Promise((resolve) => {
                            const filter = (msg) =>
                                (msg.content.includes("and caught a") || msg.content.includes("You found:")) &&
                                msg.author.id === "408785106942164992" &&
                                msg.channel.id === channel.id &&
                                msg.id.localeCompare(id) > 0;
                                
                            const listener = (msg) => {
                                if (filter(msg)) {
                                    clearTimeout(timer);
                                    client.off("messageCreate", listener);
                                    resolve(msg);
                                }
                            };
                            
                            const timer = setTimeout(() => {
                                client.off("messageCreate", listener);
                                const collector = channel.createMessageCollector({ filter, time: 6100});
                                collector.on("collect", (msg) => {
                                    if (filter(msg)) {
                                        collector.stop();
                                        resolve(msg);
                                    }
                                });
                                collector.on("end", () => resolve(null));
                            }, 6100);

                            client.on("messageCreate", listener);
                        });
                    }
                    
                    if (message == null) {
                        client.global.hunt = false;
                        client.logger.alert(
                            "Farm",
                            "Hunt",
                            "Cannot found hunt result!");
                        return;
                    }
                    
                    let huntmsgcontent = message.content;
                    client.global.gems.need = [];
                    client.global.gems.use = "";
                    if (huntmsgcontent) {
                        let requiredGems = ["gem1", "gem3", "gem4"];
                        requiredGems.forEach((gem) => {
                            if (!huntmsgcontent.includes(gem)) {
                                client.global.gems.need.push(gem);
                            }
                        });
                        
                        if (client.global.gems.isevent) {
                            if (!huntmsgcontent.includes("star")) {
                                if (!client.global.temp.usedevent) {
                                    client.global.gems.need.push("star");
                                    client.global.temp.usedevent = true;
                                } else {
                                    client.global.gems.isevent = false;
                                    client.logger.info("Farm", "Hunt", "Event not found");
                                }
                            } else client.global.temp.usedevent = false;
                        }
                        
                        if (client.global.gems.need.length > 0) {
                            client.logger.warn(
                                "Farm",
                                "Hunt",
                                `Missing gems: ${client.global.gems.need}`
                            );
                            
                            if (client.basic.commands.inventory) {
                                await client.delay(2000);
                                await require("./inventory.js")(client, message);
                            } //put it here to only check inv when missing gem
                        }
                    }
                }
                await client.delay(1000);
                client.global.hunt = false;
            });
        if (client.config.settings.autophrases) {
            await client.delay(4000);
            await elaina2(client, channel);
        }
        await client.delay(10500);
    }
    
    triggerhunt(); //same but shorter ig?
    setInterval(triggerhunt, 16200);
}

async function battle(client, channel) {
    const triggerbattle = async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.checklist ||
            client.global.inventory ||
            client.global.battle
        )
            return;
        if (client.global.hunt) await client.delay(1500);
        client.global.battle = true;
        await channel
            .send({
                content: `${commandrandomizer([
                    "owo",
                    client.config.settings.owoprefix,
                ])} ${commandrandomizer(["b", "battle"])}`,
            })
            .then(() => {
                client.global.total.battle++;
                client.logger.info(
                    "Farm",
                    "Battle",
                    `Total Battle: ${client.global.total.battle}`
                );
                client.global.battle = false;
            });
    }
    
    triggerbattle();
    setInterval(triggerbattle, 19000);
}

async function elaina2(client, channel) {
    if (client.global.captchadetected || client.global.paused) return;
    client.fs.readFile("./phrases/phrases.json", "utf8", async (err, data) => {
        const phrasesObject = JSON.parse(data);
        const phrases = phrasesObject.phrases;

        if (!phrases || !phrases.length) {
            return client.logger.alert(
                "Farm",
                "Phrases",
                "Phrases array is undefined or empty."
            );
        }
        let result = Math.floor(Math.random() * phrases.length);
        let ilu = phrases[result];

        // await channel.sendTyping();
        await channel.send({ content: ilu });
        client.logger.info("Farm", "Phrases", `Successfuly Sended`);
    });
}
