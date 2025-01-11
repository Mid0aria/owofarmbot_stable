/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Handles the inventory management for the client.
 *
 * @param {Object} client - The client object.
 * @param {Object} channel - The channel object where the inventory command will be sent.
 * @returns {Promise<void>} - A promise that resolves when the inventory process is complete.
 *
 * @description
 * This function checks the client's global state for captcha detection, pause status, and inventory status.
 * If any of these conditions are met, the function returns early. Otherwise, it sends a typing indicator
 * and retrieves the inventory by sending a command to the channel. It then processes the inventory message
 * to extract item codes and uses specific items based on the client's configuration and requirements.
 *
 * The function also handles gem usage based on the client's rare level and required gems. It uses a delay
 * between actions to ensure proper execution and updates the client's global state accordingly.
 */

const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client) => {
    let channel = client.channels.cache.get(client.basic.commandschannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }

    await inventory(client, channel);
};

async function inventory(client, channel) {
    if (
        client.global.captchadetected ||
        client.global.paused ||
        client.global.inventory
    )
        return;
    channel.sendTyping();
    client.global.inventory = true;
    client.logger.info(
        "Farm",
        "Inventory",
        `Paused: ${client.global.inventory}! Retrieving inventory...`,
    );
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
                        const collector = channel.createMessageCollector({
                            filter,
                            time: 6100,
                        });
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
                client.global.inventory = false;
                client.logger.alert(
                    "Farm",
                    "inventory",
                    "Couldn't retrieve inventory",
                );
                return;
            }

            if (client.global.captchadetected || client.global.paused) {
                client.global.inventory = false;
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
                                case values.includes("057") &&
                                    client.global.rareLevel >= 7:
                                    client.global.gems.use += "57 ";
                                    break;
                                case values.includes("056") &&
                                    client.global.rareLevel >= 6:
                                    client.global.gems.use += "56 ";
                                    break;
                                case values.includes("055") &&
                                    client.global.rareLevel >= 5:
                                    client.global.gems.use += "55 ";
                                    break;
                                case values.includes("054") &&
                                    client.global.rareLevel >= 4:
                                    client.global.gems.use += "54 ";
                                    break;
                                case values.includes("053") &&
                                    client.global.rareLevel >= 3:
                                    client.global.gems.use += "53 ";
                                    break;
                                case values.includes("052") &&
                                    client.global.rareLevel >= 2:
                                    client.global.gems.use += "52 ";
                                    break;
                                case values.includes("051") &&
                                    client.global.rareLevel >= 1:
                                    client.global.gems.use += "51 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "gem3":
                            switch (true) {
                                case values.includes("071") &&
                                    client.global.rareLevel >= 7:
                                    client.global.gems.use += "71 ";
                                    break;
                                case values.includes("070") &&
                                    client.global.rareLevel >= 6:
                                    client.global.gems.use += "70 ";
                                    break;
                                case values.includes("069") &&
                                    client.global.rareLevel >= 5:
                                    client.global.gems.use += "69 ";
                                    break;
                                case values.includes("068") &&
                                    client.global.rareLevel >= 4:
                                    client.global.gems.use += "68 ";
                                    break;
                                case values.includes("067") &&
                                    client.global.rareLevel >= 3:
                                    client.global.gems.use += "67 ";
                                    break;
                                case values.includes("066") &&
                                    client.global.rareLevel >= 2:
                                    client.global.gems.use += "66 ";
                                    break;
                                case values.includes("065") &&
                                    client.global.rareLevel >= 1:
                                    client.global.gems.use += "65 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "gem4":
                            switch (true) {
                                case values.includes("078") &&
                                    client.global.rareLevel >= 7:
                                    client.global.gems.use += "78 ";
                                    break;
                                case values.includes("077") &&
                                    client.global.rareLevel >= 6:
                                    client.global.gems.use += "77 ";
                                    break;
                                case values.includes("076") &&
                                    client.global.rareLevel >= 5:
                                    client.global.gems.use += "76 ";
                                    break;
                                case values.includes("075") &&
                                    client.global.rareLevel >= 4:
                                    client.global.gems.use += "75 ";
                                    break;
                                case values.includes("074") &&
                                    client.global.rareLevel >= 3:
                                    client.global.gems.use += "74 ";
                                    break;
                                case values.includes("073") &&
                                    client.global.rareLevel >= 2:
                                    client.global.gems.use += "73 ";
                                    break;
                                case values.includes("072") &&
                                    client.global.rareLevel >= 1:
                                    client.global.gems.use += "72 ";
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "star":
                            switch (true) {
                                case values.includes("085") &&
                                    client.global.rareLevel >= 7:
                                    client.global.gems.use += "85 ";
                                    break;
                                case values.includes("084") &&
                                    client.global.rareLevel >= 6:
                                    client.global.gems.use += "84 ";
                                    break;
                                case values.includes("083") &&
                                    client.global.rareLevel >= 5:
                                    client.global.gems.use += "83 ";
                                    break;
                                case values.includes("082") &&
                                    client.global.rareLevel >= 4:
                                    client.global.gems.use += "82 ";
                                    break;
                                case values.includes("081") &&
                                    client.global.rareLevel >= 3:
                                    client.global.gems.use += "81 ";
                                    break;
                                case values.includes("080") &&
                                    client.global.rareLevel >= 2:
                                    client.global.gems.use += "80 ";
                                    break;
                                case values.includes("079") &&
                                    client.global.rareLevel >= 1:
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
                        if (client.config.settings.inventory.use.lootbox)
                            await use(
                                client,
                                channel,
                                `${commandrandomizer(["lb", "lootbox"])}`,
                                "all",
                                "inventory",
                            );
                        await client.delay(2500);
                        break;
                    case "049":
                        if (client.config.settings.inventory.use.fabledlootbox)
                            await use(
                                client,
                                channel,
                                "lootbox fabled",
                                "all",
                                "inventory",
                            );
                        await client.delay(2500);
                        break;
                    case "100":
                        if (client.config.settings.inventory.use.crate)
                            await use(
                                client,
                                channel,
                                `${commandrandomizer(["wc", "crate"])}`,
                                "all",
                                "inventory",
                            );
                        await client.delay(2500);
                        break;
                    default:
                        break;
                }
            }

            if (client.global.gems.use.length > 0) {
                await use(
                    client,
                    channel,
                    `use ${client.global.gems.use}`,
                    "",
                    "inventory",
                );
                client.global.gems.need = [];
                client.global.gems.use = "";
            }
            await client.delay(3000);

            client.global.inventory = false;
            client.logger.info(
                "Farm",
                "Inventory",
                `Paused: ${client.global.inventory}`,
            );
        });
}

async function use(client, channel, item, count, where) {
    if (
        client.global.captchadetected ||
        (client.global.paused && where !== "inventory")
    )
        return;
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
