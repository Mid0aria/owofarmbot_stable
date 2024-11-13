const fs = require("fs");
const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client, message) => {
    if (client.global.paused || client.global.captchadetected) return;
    client.logger.info("Farm", "Paused", client.global.paused);
    
    let channel = client.channels.cache.get(client.basic.commandschannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }
    
    if (client.basic.commands.checklist) {
        checklist(client, channel);
    } else {
        await client.delay(2000);
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
    await client.delay(2000);
    
    let rarity = client.basic.maximum_gem_rarity;
    if (rarity.length > 0) {
        switch (client.basic.maximum_gem_rarity.toLowerCase()) {
            case "fabled":
                client.global.rareLevel = 7;
                break;
            case "legendary":
                client.global.rareLevel = 6;
                break;
            case "mythical":
                client.global.rareLevel = 5;
                break;
            case "epic":
                client.global.rareLevel = 4;
                break;
            case "rare":
                client.global.rareLevel = 3;
                break;
            case "uncommon":
                client.global.rareLevel = 2;
                break;
            case "common":
                client.global.rareLevel = 1;
                break;
            default:
                client.logger.warn(
                    "Farm",
                    "Config",
                    "Invalid value. Valid value is: " +
                    "fabled, legendary, mythical, epic, rare, uncommon, common"
                    );
                client.global.rareLevel = 7;
                break;
        }
    }
    
    await client.delay(16000); //reduce bot rate
    let gamblechannel = client.channels.cache.get(client.basic.gamblechannelid);
    if (client.basic.commands.gamble.coinflip) {
        coinflip(client, gamblechannel);
        if (client.basic.commands.gamble.slot) {
            await client.delay(4000);
            slot(client, gamblechannel);
        }
    }
    
    await client.delay(16000);
    if (client.basic.commands.autoquest) require("./quest.js")(client, message);
    
    await client.delay(16000);
    if (client.basic.commands.pray) pray(client, channel);
    else if (client.basic.commands.curse) curse(client, channel);
    
    await client.delay(16000);
    if (client.basic.animals) {
        let type = "";
        let animaltype = client.config.settings.animaltype;
        switch (true) {
            case animaltype.common:
                type += " c";
                break;
            case animaltype.uncommon:
                type += " u";
                break;
            case animaltype.rare:
                type += " r";
                break;
            case animaltype.epic:
                type += " e";
                break;
            case animaltype.mythical:
                type += " m";
                break;
            case animaltype.patreon:
                type += " p";
                break;
            case animaltype.cpatreon:
                type += " cp";
                break;
            case animaltype.legendary:
                type += " l";
                break;
            case animaltype.gem:
                type += " g";
                break;
            case animaltype.bot:
                type += " b";
                break;
            case animaltype.distorted:
                type += " d";
                break;
            case animaltype.fabled:
                type += " f";
                break;
            case animaltype.special:
                type += " s";
                break;
            case animaltype.hidden:
                type += " h";
                break;
            default:
                break;
        }
        if (type.length < 1) {
            logger.err(
                "Config",
                "Animals",
                "Config conflict: no active animaltype found!?"
                );
        } else {
            if (client.config.settings.animals.sell) {
                setInterval(() => {
                    sell(client, channel, "sell", type)
                }, client.config.settings.animals.interval);
            }
            if (client.config.settings.animals.sacrifice) {
                setInterval(() => {
                    sell(client, channel, "sacrifice", type)
                }, client.config.settings.animals.interval);
            }
        }
    }
};

async function checklist(client, channel) {
    let id;
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["cl", "checklist"])}`,
        })
        .then(async (clmsg) => {
            client.global.checklist = true;
            id = clmsg.id;
            client.logger.info(
                "Farm",
                "Checklist",
                `Paused: ${client.global.checklist}! Reading Checklist`
            );
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filter = (msg) =>
                        msg.embeds[0] &&
                        msg.embeds[0].author &&
                        msg.embeds[0].author.name.includes("Checklist") &&
                        msg.author.id === "408785106942164992" &&
                        msg.channel.id === channel.id;
                        
                    const listener = (msg) => {
                        if (filter(msg) && msg.id.localeCompare(id) > 0) {
                            clearTimeout(timer);
                            client.off("messageCreate", listener);
                            resolve(msg);
                        }
                    };
                    
                    const timer = setTimeout(() => {
                        client.logger.warn(
                            "Farm",
                            "Checklist",
                            "Rechecking checklist..."
                            );
                        client.off("messageCreate", listener);
                        const result = message => message.embeds[0].author.name.includes("Checklist");
                        const collector = channel.createMessageCollector({ result, time: 10000});
                        collector.on("collect", (msg) => {
                            if (msg.author.id === "408785106942164992" &&
                                msg.id.localeCompare(id) > 0) {
                                resolve(msg);
                            }
                        });
                        resolve(null);
                    }, 10000);

                    client.on("messageCreate", listener);
                });
            }
            
            if (message == null) {
                client.global.Checklist = false;
                client.logger.alert(
                    "Farm",
                    "Checklist",
                    "Cannot get checklist");
                if (client.basic.commands.hunt) {
                    hunt(client, channel);
                }
                if (client.basic.commands.battle) {
                    if (client.basic.commands.hunt) {
                        await client.delay(2000);
                        battle(client, channel);
                    }
                }
                return;
            }
            
            await client.delay(2000);
            let checklistmsg = message.embeds[0].description;
            if (checklistmsg.includes("☑️ 🎉")) {
                client.logger.info("Farm", "Checklist", "Checklist Completed");
            } else {
                const checklistlines = checklistmsg.trim().split("\n");
                checklistlines.forEach(async (line) => {
                    switch (true) {
                        case line.startsWith("⬛ 🎁") &&
                            client.config.settings.checklist.types.daily:
                            await client.delay(3000);
                            await channel
                                .send({
                                    content: `${commandrandomizer([
                                        "owo",
                                        client.config.settings.owoprefix,
                                    ])} daily`,
                                })
                                .then(() => {
                                    client.logger.info(
                                        "Farm",
                                        "Checklist - Daily",
                                        `Daily Claimed`
                                    );
                                });
                            await client.delay(3000);
                            break;

                        case line.startsWith("⬛ 📝") &&
                            client.config.settings.checklist.types.vote:
                            client.logger.info(
                                "Farm",
                                "Checklist - Vote",
                                `Platform: ${process.platform}`
                            );

                            let votebrowserexecute, executeCommand;

                            switch (process.platform) {
                                case "win32":
                                    votebrowserexecute = "start";
                                    executeCommand = (command) =>
                                        client.childprocess.exec(command);
                                    break;
                                case "darwin":
                                    votebrowserexecute = "open";
                                    executeCommand = (command) =>
                                        client.childprocess.spawn(command, [
                                            "https://top.gg/bot/408785106942164992/vote",
                                        ]);
                                    break;
                                case "android":
                                    return;
                                case "linux":
                                    votebrowserexecute = "xdg-open";
                                    executeCommand = (command) =>
                                        client.childprocess.spawn(command, [
                                            "https://top.gg/bot/408785106942164992/vote",
                                        ]);
                                    break;
                                default:
                                    client.logger.warn(
                                        "Farm",
                                        "Checklist - Vote",
                                        "Unsupported platform!"
                                    );
                                    return;
                            }

                            if (votebrowserexecute) {
                                client.logger.info(
                                    "Farm",
                                    "Checklist - Vote",
                                    "Opening Browser."
                                );
                                executeCommand(
                                    `${votebrowserexecute} https://top.gg/bot/408785106942164992/vote`
                                );
                            }
                            break;

                        case line.startsWith("⬛ 🍪") &&
                            client.config.settings.checklist.types.cookie:
                            await client.delay(3000);
                            await channel
                                .send({
                                    content: `${commandrandomizer([
                                        "owo",
                                        client.config.settings.owoprefix,
                                    ])} cookie <@408785106942164992>`,
                                })
                                .then(() => {
                                    client.global.temp.usedcookie = true;
                                    client.logger.info(
                                        "Farm",
                                        "Checklist - Cookie",
                                        `Cookie Sended`
                                    );
                                });
                            await client.delay(3000);
                            break;
                            
                        case line.startsWith("️☑️ 🍪"):
                            client.global.temp.usedcookie = true;
                            break;

                        case line.startsWith("☑️ 💎"):
                            client.logger.info("Farm", "Checklist", "Completed daily lootbox");
                            break;

                        case line.startsWith("☑️ ⚔"):
                            client.logger.info("Farm", "Checklist", "Completed daily crate");
                            break;
                    }
                });
            }
            await client.delay(2000);
            for (let i = 0; i < 1000; i++) {
                if (client.global.captchadetected === false) {
                    client.global.checklist = false;

                    break;
                }
                await client.delay(1000);
            }
            
            client.logger.info(
                "Farm",
                "Checklist",
                `Paused: ${client.global.checklist}`
            );
            if (client.basic.commands.hunt) {
                hunt(client, channel);
            }
            if (client.basic.commands.battle) {
                if (client.basic.commands.hunt) {
                    await client.delay(2000);
                    battle(client, channel);
                }
            }
        });
}

async function inventory(client, channel) {
    if (client.global.captchadetected ||
        client.global.inventory) return;
    client.global.inventory = true;
    client.logger.info("Farm", "Inventory", `Paused: ${client.global.inventory}! Getting Inventory ...`);
    let id;
    await channel
        .send({
            content: `owo ${commandrandomizer(["inv", "inventory"])}`,
        })
        .then(async (invmessage) => {
            id = invmessage.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filter = (msg) =>
                        msg.content.includes("Inventory =") &&
                        msg.author.id === "408785106942164992" &&
                        msg.channel.id === channel.id;
                        
                    const listener = (msg) => {
                        if (filter(msg) && msg.id.localeCompare(id) > 0) {
                            clearTimeout(timer);
                            client.off("messageCreate", listener);
                            resolve(msg);
                        }
                    };
                    
                    const timer = setTimeout(() => {
                        client.off("messageCreate", listener);
                        const result = message => message.content.includes("Inventory =");
                        const collector = channel.createMessageCollector({ result, time: 6100});
                        collector.on("collect", (msg) => {
                            if (msg.author.id === "408785106942164992" &&
                                msg.id.localeCompare(id) > 0) {
                                resolve(msg);
                            }
                        });
                        resolve(null);
                    }, 6100);

                    client.on("messageCreate", listener);
                });
            }
            
            if (message == null) {
                client.global.inventory = false;
                client.logger.alert(
                    "Farm",
                    "inventory",
                    "Cannot get inventory");
                return;
            }
            
            let invcontent = message.content;

            let values = [];
            let regex = /`([^`]+)`/g;
            let match;
            while ((match = regex.exec(invcontent)) !== null) {
                values.push(match[1]);
            }

            if (
                client.global.gems.need.length > 0 &&
                client.config.settings.inventory.use.gems
            ) {
                client.global.gems.need.forEach((gem) => {
                    /**
                     *! don't touch the spaces
                     */
                    switch (gem) {
                        case "gem1":
                            switch (true) {
                                case (values.includes("057") && client.global.rareLevel >= 7):
                                    client.global.gems.use += "57 ";
                                    break;
                                case (values.includes("056") && client.global.rareLevel >= 6):
                                    client.global.gems.use += "56 ";
                                    break;
                                case (values.includes("055") && client.global.rareLevel >= 5):
                                    client.global.gems.use += "55 ";
                                    break;
                                case (values.includes("054") && client.global.rareLevel >= 4):
                                    client.global.gems.use += "54 ";
                                    break;
                                case (values.includes("053") && client.global.rareLevel >= 3):
                                    client.global.gems.use += "53 ";
                                    break;
                                case (values.includes("052") && client.global.rareLevel >= 2):
                                    client.global.gems.use += "52 ";
                                    break;
                                case (values.includes("051") && client.global.rareLevel >= 1):
                                    client.global.gems.use += "51 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "gem3":
                            switch (true) {
                                case (values.includes("071") && client.global.rareLevel >= 7):
                                    client.global.gems.use += "71 ";
                                    break;
                                case (values.includes("070") && client.global.rareLevel >= 6):
                                    client.global.gems.use += "70 ";
                                    break;
                                case (values.includes("069") && client.global.rareLevel >= 5):
                                    client.global.gems.use += "69 ";
                                    break;
                                case (values.includes("068") && client.global.rareLevel >= 4):
                                    client.global.gems.use += "68 ";
                                    break;
                                case (values.includes("067") && client.global.rareLevel >= 3):
                                    client.global.gems.use += "67 ";
                                    break;
                                case (values.includes("066") && client.global.rareLevel >= 2):
                                    client.global.gems.use += "66 ";
                                    break;
                                case (values.includes("065") && client.global.rareLevel >= 1):
                                    client.global.gems.use += "65 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "gem4":
                            switch (true) {
                                case (values.includes("078") && client.global.rareLevel >= 7):
                                    client.global.gems.use += "78 ";
                                    break;
                                case (values.includes("077") && client.global.rareLevel >= 6):
                                    client.global.gems.use += "77 ";
                                    break;
                                case (values.includes("076") && client.global.rareLevel >= 5):
                                    client.global.gems.use += "76 ";
                                    break;
                                case (values.includes("075") && client.global.rareLevel >= 4):
                                    client.global.gems.use += "75 ";
                                    break;
                                case (values.includes("074") && client.global.rareLevel >= 3):
                                    client.global.gems.use += "74 ";
                                    break;
                                case (values.includes("073") && client.global.rareLevel >= 2):
                                    client.global.gems.use += "73 ";
                                    break;
                                case (values.includes("072") && client.global.rareLevel >= 1):
                                    client.global.gems.use += "72 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "star":
                            switch (true) {
                                case (values.includes("085") && client.global.rareLevel >= 7):
                                    client.global.gems.use += "85 ";
                                    break;
                                case (values.includes("084") && client.global.rareLevel >= 6):
                                    client.global.gems.use += "84 ";
                                    break;
                                case (values.includes("083") && client.global.rareLevel >= 5):
                                    client.global.gems.use += "83 ";
                                    break;
                                case (values.includes("082") && client.global.rareLevel >= 4):
                                    client.global.gems.use += "82 ";
                                    break;
                                case (values.includes("081") && client.global.rareLevel >= 3):
                                    client.global.gems.use += "81 ";
                                    break;
                                case (values.includes("080") && client.global.rareLevel >= 2):
                                    client.global.gems.use += "80 ";
                                    break;
                                case (values.includes("079") && client.global.rareLevel >= 1):
                                    client.global.gems.use += "79 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
            
            await client.delay(4000);
            
            for (let value of values) {
                switch (value) {
                    case "050":
                        use(
                            client,
                            channel,
                            `${commandrandomizer(["lb", "lootbox"])}`,
                            "all",
                            "inventory"
                        );
                        await client.delay(2500);
                        break;
                    case "049":
                        use(
                            client,
                            channel,
                            "lootbox fabled",
                            "all",
                            "inventory"
                        );
                        await client.delay(2500);
                        break;
                    case "100":
                        use(
                            client,
                            channel,
                            `${commandrandomizer(["wc", "crate"])}`,
                            "all",
                            "inventory"
                        );
                        await client.delay(2500);
                    default:
                        break;
                }
            }
            
            if (client.global.gems.use.length > 0) {
                use(
                    client,
                    channel,
                    `use ${client.global.gems.use}`,
                    "",
                    "inventory"
                );
                client.global.gems.need = [];
                client.global.gems.use = "";
            }
            await client.delay(3000);

            client.global.inventory = false;
            client.logger.info(
                "Farm",
                "Inventory",
                `Paused: ${client.global.inventory}`
            );
        });
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
                                msg.channel.id === channel.id;
                                
                            const listener = (msg) => {
                                if (filter(msg) && msg.id.localeCompare(id) > 0) {
                                    clearTimeout(timer);
                                    client.off("messageCreate", listener);
                                    resolve(msg);
                                }
                            };
                            
                            const timer = setTimeout(() => {
                                client.off("messageCreate", listener);
                                const result = message => message.content.includes("and caught a") || message.content.includes("You found:");
                                const collector = channel.createMessageCollector({ result, time: 5000});
                                collector.on("collect", (msg) => {
                                    if (msg.author.id === "408785106942164992" &&
                                        msg.id.localeCompare(id) > 0) {
                                        resolve(msg);
                                    }
                                });
                                resolve(null);
                            }, 5000);

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
                                await inventory(client, channel);
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

async function use(client, channel, item, count, where) {
    if (client.global.paused && where !== "inventory") return;
    client.global.use = true;
    await channel.send({
        content: `${commandrandomizer([
            "owo",
            client.config.settings.owoprefix,
        ])} ${item} ${count}`,
    });
    client.logger.info("Farm", "Use", item);
    await client.delay(5000);
    client.global.use = false;
}

async function sell(client, channel, choose, types) {
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${choose} ${types}`,
        });
}

/**
 * OTHER FUNCTIONS
 *
 */

async function elaina2(client, channel) {
    if (client.global.captchadetected) return;
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

async function coinflip(client, channel) {
    let defaultBet = client.config.settings.gamble.coinflip.default_amount;
    let currentBet = defaultBet;
    let maxBet = client.config.settings.gamble.coinflip.max_amount;
    let multiplier = client.config.settings.gamble.coinflip.multiplier;
    let coinfliping = false;
    
    smol();
    async function smol() {
        if (
            client.global.captchadetected ||
            coinfliping == true ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
            ) {
                setTimeout(() => { smol() }, 16000);
                return;
            }
        
        coinfliping = true;
        function head() {
            return commandrandomizer(["owo", client.config.settings.owoprefix]) +
                   commandrandomizer(["coinflip", "cf"]) + " " +
                   commandrandomizer(["heads", "h"]) + " " + currentBet;
        }
        function tail() {
            return commandrandomizer(["owo", client.config.settings.owoprefix]) +
                   commandrandomizer(["coinflip", "cf"]) + " " +
                   commandrandomizer(["tails", "t"]) + " " + currentBet;
        }
        
        const choose = commandrandomizer([head, tail]);
        const content = choose();
        let id;

        await channel.send({
            content: `${content}`,
            }).then((message) => {
                id = message.id;
                client.global.gamble.coinflip++;
                client.logger.info(
                    "Farm",
                    "Coinflip",
                    `Betting: ${currentBet}. Total time: ${client.global.gamble.coinflip}`
                );
            }
        );
        
        const updateCFListener = async (oldMsg, newMsg) => {
            if (newMsg.channel.id !== channel.id) return;
            if (newMsg.author.id === "408785106942164992" && 
                newMsg.content.includes("and chose") &&
                newMsg.id > id &&
                (
                !oldMsg.content.includes("and you won") || 
                !oldMsg.content.includes("and you lost") 
                )
                ) {
                if (newMsg.content.includes("and you won")) {
                    client.global.gamble.cowoncywon += currentBet;
                    client.logger.info(
                        "Farm",
                        "Coinflip",
                        `Won ${currentBet}! `
                    );
                    currentBet = defaultBet;
                    client.off('messageUpdate', updateCFListener);
                    coinfliping = false;
                    setTimeout(() => { smol() }, 16000);
                    return; //to make sure
                }
                if (newMsg.content.includes("and you lost")) {
                    client.global.gamble.cowoncywon -= currentBet;
                    client.logger.info(
                        "Farm",
                        "Coinflip",
                        `Lost ${currentBet}! `
                    );
                    currentBet = Math.round(currentBet * multiplier);
                    if (currentBet > maxBet)
                        currentBet = defaultBet;
                    client.off('messageUpdate', updateCFListener);
                    coinfliping = false;
                    setTimeout(() => { smol() }, 16000);
                    return;
                }
            }
            
            setTimeout(() => {
                if (coinfliping == true) {
                    client.off('messageUpdate', updateCFListener);
                    const result = message => message.content.includes("and chose");
                    const collector = channel.createMessageCollector({ result, time: 10000});
                    collector.on("collect", (msg) => {
                        if (msg.author.id === "408785106942164992" && msg.id > id) {
                            if (
                            msg.content.includes("and you won")
                            ) {
                                client.global.gamble.cowoncywon += currentBet;
                                client.logger.info(
                                    "Farm",
                                    "Coinflip",
                                    `Won ${currentBet}! `
                                );
                                currentBet = defaultBet;
                                coinfliping = false;
                                return;
                            } else if (msg.content.includes("and you lost")) {
                                client.global.gamble.cowoncywon -= currentBet;
                                client.logger.info(
                                    "Farm",
                                    "Coinflip",
                                    `Lost ${currentBet}! `
                                );
                                currentBet = Math.round(currentBet * multiplier);
                                if (currentBet > maxBet)
                                    currentBet = defaultBet;
                                coinfliping = false;
                                return;
                            } else {
                                client.global.gamble.coinflip--;
                                client.logger.info(
                                    "Farm",
                                    "Coinflip",
                                    `Failed to gamble! `
                                );
                                sloting = false;
                            }
                        }
                    });
                    setTimeout(() => { smol() }, 16000);
                }
            }, 10000); //incase bot overload
        };
        
        client.on('messageUpdate', updateCFListener);
    }
}

function slot(client, channel) {
    let defaultBet = client.config.settings.gamble.slot.default_amount;
    let currentBet = defaultBet;
    let maxBet = client.config.settings.gamble.slot.max_amount;
    let multiplier = client.config.settings.gamble.slot.multiplier;
    let sloting = false;
    
    smol();
    async function smol() {
        if (
            client.global.captchadetected ||
            sloting == true ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
            ) {
                setTimeout(() => { smol() }, 16000);
                return;
            }
        
        sloting = true;
        const content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                        commandrandomizer(["slots", "s"]) + " " +
                        currentBet;
        let id;

        await channel.send({
            content: `${content}`,
            }).then((message) => {
                id = message.id;
                client.global.gamble.slot++;
                client.logger.info(
                    "Farm",
                    "Slot",
                    `Betting: ${currentBet}. Total time: ${client.global.gamble.slot}`
                );
            }
        );
        
        const updateSlotListener = async (oldMsg, newMsg) => {
            if (newMsg.channel.id !== channel.id) return;
            if (newMsg.author.id === "408785106942164992" && 
                newMsg.content.includes(`SLOTS`) &&
                newMsg.id > id
                ) {
                if (
                    newMsg.content.includes("and won") &&
                    !newMsg.content.includes("nothing...")
                    ) {
                    let match = newMsg.content.match(/and won <:\w+:\d+> (\d[\d,]*)/);
                    let won = Number(match[1].replace(/,/g, '')) - currentBet;
                    //send a thanks to someone idk for regex
                    client.global.gamble.cowoncywon += won;
                    client.logger.info(
                        "Farm",
                        "Slot",
                        `Won ${won}!`
                    );
                    currentBet = defaultBet;
                    client.off('messageUpdate', updateSlotListener);
                    sloting = false;
                    setTimeout(() => { smol() }, 18000);
                    return;
                }
                if (newMsg.content.includes("and won nothing...")) {
                    client.global.gamble.cowoncywon -= currentBet;
                    client.logger.info(
                        "Farm",
                        "Slot",
                        `Lost ${currentBet}! `
                    );
                    currentBet = Math.round(currentBet * multiplier);
                    if (currentBet > maxBet)
                        currentBet = defaultBet;
                    client.off('messageUpdate', updateSlotListener);
                    sloting = false;
                    setTimeout(() => { smol() }, 18000);
                    return;
                }
            }
            
            setTimeout(() => {
                if (sloting == true) {
                    client.off('messageUpdate', updateSlotListener);
                    const result = message => message.content.includes("SLOTS");
                    const collector = channel.createMessageCollector({ result, time: 10000});
                    collector.on("collect", (msg) => {
                        if (msg.author.id === "408785106942164992" && msg.id > id) {
                            if (
                            msg.content.includes("and won") &&
                            !msg.content.includes("nothing")
                            ) {
                                let match = newMsg.content.match(/and won <:\w+:\d+> (\d[\d,]*)/);
                                let won = Number(match[1].replace(/,/g, '')) - currentBet;
                                client.global.gamble.cowoncywon += won;
                                client.logger.info(
                                    "Farm",
                                    "Slot",
                                    `Won ${won}!`
                                );
                                currentBet = defaultBet;
                                sloting = false;
                                return;
                            } else if (msg.content.includes("and won nothing...")) {
                                client.global.gamble.cowoncywon -= currentBet;
                                client.logger.info(
                                    "Farm",
                                    "Slot",
                                    `Lost ${currentBet}! `
                                );
                                currentBet = Math.round(currentBet * multiplier);
                                if (currentBet > maxBet)
                                    currentBet = defaultBet;
                                sloting = false;
                                return;
                            } else {
                                client.global.gamble.slot--;
                                client.logger.info(
                                    "Farm",
                                    "Slot",
                                    `Failed to gamble! `
                                );
                                sloting = false;
                            }
                        }
                    });
                    setTimeout(() => { smol() }, 16000);
                }
            }, 10000); //incase bot overload
        };
        
        client.on('messageUpdate', updateSlotListener);
    }
}

function pray(client, channel) {
    while (client.global.captchadetected ||
           client.global.paused ||
           client.global.inventory ||
           client.global.checklist
          ) {
        if (!client.global.captchadetected &&
            !client.global.paused &&
            !client.global.inventory &&
            !client.global.checklist) break;
    }
    let content;
    if(client.basic.tomain) {
        content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                    "pray <@" + client.config.main.userid + ">";
    } else {
        content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                    "pray";
    }
    channel.send({
        content: `${content}`,
        }).then(() => {
        client.global.total.pray++;
        client.logger.info(
            "Farm",
            "Pray",
            `Total prayed time: ${client.global.total.pray}`
            )
    });
    
    setTimeout(() => {
        pray(client, channel);
    }, 336000);
}

function curse(client, channel) {
    while (client.global.captchadetected ||
           client.global.paused ||
           client.global.inventory ||
           client.global.checklist
          ) {
        if (!client.global.captchadetected &&
            !client.global.paused &&
            !client.global.inventory &&
            !client.global.checklist) break;
    }
    let content;
    if(client.basic.tomain) {
        content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                    "curse  <@" + client.config.main.userid + ">";
    } else {
        content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                    "curse";
    }
    channel.send({
        content: `${content}`,
    }).then(() => {
        client.global.total.curse++;
        client.logger.info(
            "Farm",
            "Curse",
            `Total prayed time: ${client.global.total.curse}`
            )
    });
    
    setTimeout(() => {
        curse(client, channel);
    }, 336000);
}
