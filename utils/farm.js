const fs = require("fs");
const { logger } = require("./logger");
const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client, message) => {
    if (client.global.paused || client.global.captchadetected) return;
    logger.info("Farm", "Paused", client.global.paused);
    let channel = client.channels.cache.get(client.config.commandschannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }
    if (client.config.settings.inventory.check) {
        checklist(client, channel, "inventory");
    } else if (client.config.settings.checklist.check) {
        checklist(client, channel);
    } else {
        await client.delay(2000);
        if (client.config.commands.hunt) {
            hunt(client, channel);
        }
        if (client.config.commands.battle) {
            if (client.config.commands.hunt) {
                await client.delay(2000);
                battle(client, channel);
            }
        }
    }
};

async function checklist(client, channel, type) {
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["cl", "checklist"])}`,
        })
        .then(async () => {
            client.global.checklist = true;
            logger.info(
                "Farm",
                "Checklist",
                `Paused: ${client.global.checklist}`
            );
            logger.info("Farm", "Checklist", `Reading Checklist`);

            let message = null;
            do {
                let lastMessages = await channel.messages.fetch({
                    limit: 1,
                });
                if (lastMessages.size > 0) {
                    message = lastMessages.last();
                    if (message.author.id !== "408785106942164992") {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                    }
                }
            } while (
                message &&
                message.author.id !== "408785106942164992" &&
                !message.embeds[0]
            );
            await client.delay(2000);
            let checklistmsg = message.embeds[0].description;
            if (checklistmsg.includes("☑️ 🎉")) {
                logger.info("Farm", "Checklist", "Checklist Completed");
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
                                    logger.info(
                                        "Farm",
                                        "Checklist - Daily",
                                        `Daily Claimed`
                                    );
                                });
                            await client.delay(3000);
                            break;

                        case line.startsWith("⬛ 📝") &&
                            client.config.settings.checklist.types.vote:
                            logger.info(
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
                                    logger.warn(
                                        "Farm",
                                        "Checklist - Vote",
                                        "Unsupported platform!"
                                    );
                                    return;
                            }

                            if (votebrowserexecute) {
                                logger.info(
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
                                    logger.info(
                                        "Farm",
                                        "Checklist - Cookie",
                                        `Cookie Sended`
                                    );
                                });
                            await client.delay(3000);
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

            if (type === "inventory") {
                logger.info(
                    "Farm",
                    "Checklist",
                    `Paused: ${client.global.checklist}`
                );
                inventory(client, channel, "checklist");
            } else {
                logger.info(
                    "Farm",
                    "Checklist",
                    `Paused: ${client.global.checklist}`
                );
                if (client.config.commands.hunt) {
                    hunt(client, channel);
                }
                if (client.config.commands.battle) {
                    if (client.config.commands.hunt) {
                        await client.delay(2000);
                        battle(client, channel);
                    }
                }
            }
        });
}

async function inventory(client, channel, type) {
    if (type === "checklist") {
        if (client.global.captchadetected) return;
        client.global.inventory = true;
        logger.info("Farm", "Inventory", `Paused: ${client.global.inventory}`);
        logger.info("Farm", "Inventory", `Getting Inventory ...`);

        await channel
            .send({ content: `owo ${commandrandomizer(["inv", "inventory"])}` })
            .then(async () => {
                let message = null;
                do {
                    let lastMessages = await channel.messages.fetch({
                        limit: 1,
                    });
                    if (lastMessages.size > 0) {
                        message = lastMessages.last();
                        if (message.author.id !== "408785106942164992") {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                    }
                } while (message && message.author.id !== "408785106942164992");
                let invcontent = message.content;

                let values = [];
                let regex = /`([^`]+)`/g;
                let match;
                while ((match = regex.exec(invcontent)) !== null) {
                    values.push(match[1]);
                }

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
                            await client.delay(2000);
                            break;
                        case "049":
                            use(
                                client,
                                channel,
                                "lootbox fabled",
                                "all",
                                "inventory"
                            );
                            await client.delay(2000);
                        case "100":
                            use(
                                client,
                                channel,
                                `${commandrandomizer(["wc", "crate"])}`,
                                "all",
                                "inventory"
                            );
                            await client.delay(2000);
                        default:
                            break;
                    }
                }
                await client.delay(5000);
                client.global.inventory = false;
                logger.info(
                    "Farm",
                    "Inventory",
                    `Paused: ${client.global.inventory}`
                );
                if (client.config.commands.hunt) {
                    hunt(client, channel);
                }
                if (client.config.commands.battle) {
                    if (client.config.commands.hunt) {
                        await client.delay(2000);
                        battle(client, channel);
                    }
                }
            });
    } else {
        if (client.global.captchadetected) return;
        client.global.inventory = true;
        logger.info("Farm", "Inventory", `Paused: ${client.global.inventory}`);
        logger.info("Farm", "Inventory", `Getting Inventory ...`);
        await channel
            .send({
                content: `owo ${commandrandomizer(["inv", "inventory"])}`,
            })
            .then(async () => {
                let message = null;
                do {
                    let lastMessages = await channel.messages.fetch({
                        limit: 1,
                    });
                    if (lastMessages.size > 0) {
                        message = lastMessages.last();
                        if (message.author.id !== "408785106942164992") {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                    }
                } while (message && message.author.id !== "408785106942164992");
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
                                    case values.includes("057"):
                                        client.global.gems.use += "57 ";
                                        break;
                                    case values.includes("056"):
                                        client.global.gems.use += "56 ";
                                        break;
                                    case values.includes("055"):
                                        client.global.gems.use += "55 ";
                                        break;
                                    case values.includes("054"):
                                        client.global.gems.use += "54 ";
                                        break;
                                    case values.includes("053"):
                                        client.global.gems.use += "53 ";
                                        break;
                                    case values.includes("052"):
                                        client.global.gems.use += "52 ";
                                        break;
                                    case values.includes("051"):
                                        client.global.gems.use += "51 ";
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "gem3":
                                switch (true) {
                                    case values.includes("071"):
                                        client.global.gems.use += "71 ";
                                        break;
                                    case values.includes("070"):
                                        client.global.gems.use += "70 ";
                                        break;
                                    case values.includes("069"):
                                        client.global.gems.use += "69 ";
                                        break;
                                    case values.includes("068"):
                                        client.global.gems.use += "68 ";
                                        break;
                                    case values.includes("067"):
                                        client.global.gems.use += "67 ";
                                        break;
                                    case values.includes("066"):
                                        client.global.gems.use += "66 ";
                                        break;
                                    case values.includes("065"):
                                        client.global.gems.use += "65 ";
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "gem4":
                                switch (true) {
                                    case values.includes("078"):
                                        client.global.gems.use += "78 ";
                                        break;
                                    case values.includes("077"):
                                        client.global.gems.use += "77 ";
                                        break;
                                    case values.includes("076"):
                                        client.global.gems.use += "76 ";
                                        break;
                                    case values.includes("075"):
                                        client.global.gems.use += "75 ";
                                        break;
                                    case values.includes("074"):
                                        client.global.gems.use += "74 ";
                                        break;
                                    case values.includes("073"):
                                        client.global.gems.use += "73 ";
                                        break;
                                    case values.includes("072"):
                                        client.global.gems.use += "72 ";
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case "star":
                                switch (true) {
                                    case values.includes("085"):
                                        client.global.gems.use += "85 ";
                                        break;
                                    case values.includes("084"):
                                        client.global.gems.use += "84 ";
                                        break;
                                    case values.includes("083"):
                                        client.global.gems.use += "83 ";
                                        break;
                                    case values.includes("082"):
                                        client.global.gems.use += "82 ";
                                        break;
                                    case values.includes("081"):
                                        client.global.gems.use += "81 ";
                                        break;
                                    case values.includes("080"):
                                        client.global.gems.use += "80 ";
                                        break;
                                    case values.includes("079"):
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
                } else {
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
                                await client.delay(2000);
                                break;
                            case "049":
                                use(
                                    client,
                                    channel,
                                    "lootbox fabled",
                                    "all",
                                    "inventory"
                                );
                                await client.delay(2000);
                                break;
                            case "100":
                                use(
                                    client,
                                    channel,
                                    `${commandrandomizer(["wc", "crate"])}`,
                                    "all",
                                    "inventory"
                                );
                                await client.delay(2000);
                            default:
                                break;
                        }
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

                client.global.inventory = false;
                logger.info(
                    "Farm",
                    "Inventory",
                    `Paused: ${client.global.inventory}`
                );
            });
    }
}

async function hunt(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected ||
        client.global.use ||
        client.global.inventory ||
        client.global.checklist
    )
        return;
    if (client.global.battle) await client.delay(1500);
    client.global.hunt = true;
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["h", "hunt"])}`,
        })
        .then(async () => {
            client.global.total.hunt++;
            logger.info(
                "Farm",
                "Hunt",
                `Total Hunt: ${client.global.total.hunt}`
            );
            if (client.config.settings.inventory.use.gems) {
                let message = null;
                do {
                    let lastMessages = await channel.messages.fetch({
                        limit: 1,
                    });
                    if (lastMessages.size > 0) {
                        message = lastMessages.last();
                        if (
                            message.author.id !== "408785106942164992" &&
                            !message.content.includes("**🌱 | !")
                        ) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            );
                        }
                    }
                } while (
                    message &&
                    message.author.id !== "408785106942164992" &&
                    !message.content.includes("**🌱 | !")
                );
                let huntmsgcontent = message.content;
                client.global.gems.need = [];
                client.global.gems.use = "";
                if (huntmsgcontent) {
                    let requiredGems = ["gem1", "gem3", "gem4", "star"];
                    requiredGems.forEach((gem) => {
                        if (!huntmsgcontent.includes(gem)) {
                            client.global.gems.need.push(gem);
                        }
                    });
                    if (client.global.gems.need.length > 0) {
                        logger.warn(
                            "Farm",
                            "Hunt",
                            `Missing gems: ${client.global.gems.need}`
                        );
                    }
                }
            }
            await client.delay(1000);
            client.global.hunt = false;
        });
    if (client.config.settings.autophrases) {
        await elaina2(client, channel);
    }
    await client.delay(10500);

    if (client.config.settings.inventory.check) {
        await inventory(client, channel);
    }

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.inventory ||
            client.global.checklist
        )
            return;
        if (client.global.battle) await client.delay(1500);

        client.global.hunt = true;
        await channel
            .send({
                content: `${commandrandomizer([
                    "owo",
                    client.config.settings.owoprefix,
                ])} ${commandrandomizer(["h", "hunt"])}`,
            })
            .then(async () => {
                client.global.total.hunt++;
                logger.info(
                    "Farm",
                    "Hunt",
                    `Total Hunt: ${client.global.total.hunt}`
                );
                if (client.config.settings.inventory.use.gems) {
                    let message = null;
                    do {
                        let lastMessages = await channel.messages.fetch({
                            limit: 1,
                        });
                        if (lastMessages.size > 0) {
                            message = lastMessages.last();
                            if (
                                message.author.id !== "408785106942164992" &&
                                !message.content.includes("**:seedling: |")
                            ) {
                                await new Promise((resolve) =>
                                    setTimeout(resolve, 1000)
                                );
                            }
                        }
                    } while (
                        message &&
                        message.author.id !== "408785106942164992" &&
                        !message.content.includes("**:seedling: |")
                    );
                    let huntmsgcontent = message.content;
                    client.global.gems.need = [];
                    client.global.gems.use = "";
                    if (huntmsgcontent) {
                        let requiredGems = ["gem1", "gem3", "gem4", "star"];
                        requiredGems.forEach((gem) => {
                            if (!huntmsgcontent.includes(gem)) {
                                client.global.gems.need.push(gem);
                            }
                        });
                        if (client.global.gems.need.length > 0) {
                            logger.warn(
                                "Farm",
                                "Hunt",
                                `Missing gems: ${client.global.gems.need}`
                            );
                        }
                    }
                }
                client.global.hunt = false;
            });
        if (client.config.settings.autophrases) {
            await elaina2(client, channel);
        }
        await client.delay(10500);

        if (client.config.settings.inventory.check) {
            await inventory(client, channel);
        }
    }, 16200);
}

async function battle(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected ||
        client.global.use ||
        client.global.checklist ||
        client.global.inventory
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
            logger.info(
                "Farm",
                "Battle",
                `Total Battle: ${client.global.total.battle}`
            );
            client.global.battle = false;
        });

    setInterval(async () => {
        if (
            client.global.paused ||
            client.global.captchadetected ||
            client.global.use ||
            client.global.checklist ||
            client.global.inventory
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
            .then(async () => {
                client.global.total.battle++;
                logger.info(
                    "Farm",
                    "Battle",
                    `Total Battle: ${client.global.total.battle}`
                );
                client.global.battle = false;
            });
    }, 18400);
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
    logger.info("Farm", "Use", item);
    await client.delay("5000");
    client.global.use = false;
}

async function sell(client, channel) {
    let types;
    await channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} sell ${types}`,
        })
        .then(async () => {});
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
            return logger.alert(
                "Farm",
                "Phrases",
                "Phrases array is undefined or empty."
            );
        }
        let result = Math.floor(Math.random() * phrases.length);
        let ilu = phrases[result];

        // await channel.sendTyping();
        await channel.send({ content: ilu });
        logger.info("Farm", "Phrases", `Successfuly Sended`);
    });
}
