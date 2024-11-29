const fs = require("fs");
const path = require("path");

const ENTERED_GIVEAWAYS_FILE = path.join(
    __dirname,
    "../../data/enteredGiveaways.json"
);

let enteredGiveaways = {};

if (fs.existsSync(ENTERED_GIVEAWAYS_FILE)) {
    enteredGiveaways = JSON.parse(fs.readFileSync(ENTERED_GIVEAWAYS_FILE));
}

module.exports = async (client) => {
    await joingiveaways(client);
};

async function joingiveaways(client) {
    const mylovetiffani = client.guilds.cache.get("420104212895105044");

    const CHANNEL_IDS = [
        "1099453684691243098",
        "1168797748343099444",
        "1168797827464429618",
    ];
    const OWO_ID = "408785106942164992";

    for (const channelId of CHANNEL_IDS) {
        const channel = mylovetiffani.channels.cache.get(channelId);

        if (!channel || channel.type !== "GUILD_TEXT") {
            client.logger.alert(
                "Farm",
                "Auto Join Giveaways",
                `Channel (${channelId}) not found or not a text channel.`
            );
            continue;
        }
        client.logger.info(
            "Farm",
            "Auto Join Giveaways",
            `Searching for messages on channel ${channel.name}`
        );

        try {
            let fetchedMessages = await channel.messages.fetch({ limit: 100 });
            fetchedMessages = fetchedMessages.filter(
                (msg) => msg.author.id === OWO_ID
            );

            const filteredMessages = fetchedMessages.filter(
                (msg) => msg.embeds.length > 0 || msg.components.length > 0
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
                                if (!hasUserEntered(msg.id, client.user.id)) {
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
                        `${buttonQueue.length} active and not joined giveaway queued.`
                    );
                    await pressButtonsSequentially(client, buttonQueue);
                } else {
                    client.logger.warn(
                        "Farm",
                        "Auto Join Giveaways",
                        "YEEEYYY you joined in all the giveaways"
                    );
                }
            } else {
                client.logger.warn(
                    "Farm",
                    "Auto Join Giveaways",
                    "No giveaways found :("
                );
            }
        } catch (error) {
            client.logger.alert(
                "Farm",
                "Auto Join Giveaways",
                `Error receiving giveaway messages from ${channel.name}: ${error}`
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
                "Joining in the giveaway..."
            );
            await message.clickButton(customId);
            client.logger.info(
                "Farm",
                "Auto Join Giveaways",
                "Successfully joined the giveaway ^^"
            );
            addUserEntry(message.id, client.user.id);
            await client.delay(15000);
        } catch (error) {
            client.logger.alert(
                "Farm",
                "Auto Join Giveaways",
                `Error joining the giveaway: ${error}`
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
        JSON.stringify(enteredGiveaways, null, 2)
    );
}
