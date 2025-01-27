/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Automatically joins giveaways in specified channels.
 *
 * @param {object} client - The Discord client instance.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 *
 * @async
 * @function joingiveaways
 *
 * @example
 * // Call the function with the Discord client instance
 * joingiveaways(client);
 */

const fs = require("fs");
const path = require("path");
const CHANNEL_IDS = [
    "1099453684691243098",
    "1168797748343099444",
    "1168797827464429618",
];
const OWO_ID = "408785106942164992";

module.exports = async (client) => {
    let ENTERED_GIVEAWAYS_FILE = path.join(
        __dirname,
        "../../data/enteredGiveaways.json",
    );
    if (client.global.devmod) {
        ENTERED_GIVEAWAYS_FILE = path.join(
            __dirname,
            "../../developer/enteredGiveaways.json",
        );
    }
    let enteredGiveaways = {};

    if (fs.existsSync(ENTERED_GIVEAWAYS_FILE)) {
        enteredGiveaways = JSON.parse(fs.readFileSync(ENTERED_GIVEAWAYS_FILE));
    }

    await joingiveaways(client);

    async function joingiveaways(client) {
        const mylovetiffani = client.guilds.cache.get("420104212895105044");

        for (const channelId of CHANNEL_IDS) {
            const channel = mylovetiffani.channels.cache.get(channelId);

            if (!channel || channel.type !== "GUILD_TEXT") {
                client.logger.alert(
                    "Farm",
                    "Auto Join Giveaways",
                    `Channel (${channelId}) not found or is not a text channel.`,
                );
                continue;
            }
            client.logger.info(
                "Farm",
                "Auto Join Giveaways",
                `Searching for messages in channel ${channel.name}...`,
            );

            try {
                let fetchedMessages = await channel.messages.fetch({
                    limit: 100,
                });
                fetchedMessages = fetchedMessages.filter(
                    (msg) => msg.author.id === OWO_ID,
                );

                const filteredMessages = fetchedMessages.filter(
                    (msg) => msg.embeds.length > 0 || msg.components.length > 0,
                );

                if (filteredMessages.size > 0) {
                    const buttonQueue = [];

                    filteredMessages.forEach((msg) => {
                        msg.components.forEach((row) => {
                            row.components.forEach((component) => {
                                if (
                                    component.type === "BUTTON" &&
                                    !component.disabled
                                ) {
                                    if (
                                        !hasUserEntered(msg.id, client.user.id)
                                    ) {
                                        buttonQueue.push({
                                            customId: component.customId,
                                            message: msg,
                                        });
                                    }
                                }
                            });
                        });
                    });

                    if (buttonQueue.length > 0) {
                        client.logger.info(
                            "Farm",
                            "Auto Join Giveaways",
                            `${buttonQueue.length} active and not joined giveaway queued.`,
                        );
                        await pressButtonsSequentially(client, buttonQueue);
                    } else {
                        client.logger.warn(
                            "Farm",
                            "Auto Join Giveaways",
                            `You have joined all the giveaways in the channel ${channel.name}`,
                        );
                    }
                } else {
                    client.logger.warn(
                        "Farm",
                        "Auto Join Giveaways",
                        "No giveaways found.",
                    );
                }
            } catch (error) {
                client.logger.alert(
                    "Farm",
                    "Auto Join Giveaways",
                    `Error retrieving giveaway messages from ${channel.name}: ${error}`,
                );
            }
        }
        saveEnteredGiveaways();
    }

    async function pressButtonsSequentially(client, buttonQueue) {
        for (const { customId, message } of buttonQueue) {
            try {
                client.logger.info(
                    "Farm",
                    "Auto Join Giveaways",
                    "Joining the giveaway...",
                );
                await message.clickButton(customId);
                client.logger.info(
                    "Farm",
                    "Auto Join Giveaways",
                    "Successfully joined the giveaway.",
                );
                client.global.total.giveaway++;
                client.broadcast({
                    action: "update",
                    type: "giveaway",
                    progress: client.global.total.giveaway,
                    global: client.global,
                });
                addUserEntry(message.id, client.user.id);
                await client.delay(15000);
            } catch (error) {
                client.logger.alert(
                    "Farm",
                    "Auto Join Giveaways",
                    `Error joining giveaway: ${error}`,
                );
            }
        }
    }

    function hasUserEntered(messageId, userId) {
        if (!enteredGiveaways[userId]) {
            enteredGiveaways[userId] = [];
        }
        return enteredGiveaways[userId].includes(messageId);
    }

    function addUserEntry(messageId, userId) {
        if (!enteredGiveaways[userId]) {
            enteredGiveaways[userId] = [];
        }
        if (!enteredGiveaways[userId].includes(messageId)) {
            enteredGiveaways[userId].push(messageId);
        }
    }

    function saveEnteredGiveaways() {
        fs.writeFileSync(
            ENTERED_GIVEAWAYS_FILE,
            JSON.stringify(enteredGiveaways, null, 2),
        );
    }

    client.on("messageCreate", async (message) => {
        if (
            CHANNEL_IDS.includes(message.channel.id) &&
            message.author.id === OWO_ID &&
            message.embeds.length > 0
        ) {
            const buttonQueue = [];

            message.components.forEach((row) => {
                row.components.forEach((component) => {
                    if (
                        component.type === "BUTTON" &&
                        !component.disabled &&
                        !hasUserEntered(message.id, client.user.id)
                    ) {
                        buttonQueue.push({
                            customId: component.customId,
                            message: message,
                        });
                    }
                });
            });

            if (buttonQueue.length > 0) {
                client.logger.info(
                    "Farm",
                    "Auto Join Giveaways",
                    `New giveaway detected in ${message.channel.name}, joining...`,
                );
                await pressButtonsSequentially(client, buttonQueue);
            }
        }
    });
};
