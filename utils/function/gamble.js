/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Executes a slot gambling function for a specified client and channel.
 * The function places bets, checks for wins or losses, and adjusts the bet amount accordingly.
 * It also handles delays and retries based on the client's global state.
 *
 * @param {Object} client - The client object containing configuration and global state.
 * @param {Object} channel - The channel object where the slot command will be sent.
 */

const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getrand = (min, max) => Math.random() * (max - min) + min;

module.exports = async (client) => {
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }

    let gamblechannel = client.channels.cache.get(client.basic.gamblechannelid);

    if (client.basic.commands.gamble.coinflip) {
        coinflip(client, gamblechannel);
        if (client.basic.commands.gamble.slot) {
            await client.delay(4000);
            slot(client, gamblechannel);
        }
    }
};

async function coinflip(client, channel) {
    let defaultBet = client.config.settings.gamble.coinflip.default_amount;
    let currentBet = defaultBet;
    let maxBet = client.config.settings.gamble.coinflip.max_amount;
    let multiplier = client.config.settings.gamble.coinflip.multiplier;

    smol();
    async function smol() {
        while (
            client.global.captchadetected ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
        ) {
            await client.delay(16000);
        }
        let interval = getrand(
            client.config.interval.coinflip.min,
            client.config.interval.coinflip.max,
        );

        try {
            channel.sendTyping();
            const content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                commandrandomizer(["coinflip", "cf"]) +
                " " +
                commandrandomizer(["heads", "tails", "h", "t"]) +
                " " +
                currentBet;

            let id;
            await channel.send({ content: `${content}` }).then((message) => {
                id = message.id;
                client.global.gamble.coinflip++;
                client.logger.info(
                    "Farm",
                    "Coinflip",
                    `Betting: ${currentBet}. Total time: ${client.global.gamble.coinflip}`,
                );

                const updateCFListener = (oldMsg, newMsg) => {
                    if (
                        newMsg.channel.id !== channel.id ||
                        newMsg.author.id !== "408785106942164992" ||
                        newMsg.id.localeCompare(id) < 0
                    )
                        return;
                    const isWin = newMsg.content.includes("and you won");
                    const isLoss = newMsg.content.includes("and you lost");

                    if (
                        (isWin || isLoss) &&
                        !oldMsg.content.includes("and you won") &&
                        !oldMsg.content.includes("and you lost")
                    ) {
                        client.global.gamble.cowoncywon += isWin
                            ? currentBet
                            : -currentBet;
                        client.logger.info(
                            "Farm",
                            "Coinflip",
                            `${isWin ? "Won" : "Lost"} ${currentBet}!`,
                        );
                        currentBet = isWin
                            ? defaultBet
                            : Math.min(
                                  Math.round(currentBet * multiplier),
                                  maxBet,
                              );

                        client.off("messageUpdate", updateCFListener);
                        clearTimeout(doublecheck);
                    }
                };

                const startCollector = () => {
                    const filter = (msg) =>
                        msg.author.id === "408785106942164992" &&
                        msg.id.localeCompare(id) > 0 &&
                        msg.content.includes("and chose");
                    const collector = channel.createMessageCollector({
                        filter,
                        time: 10000,
                    });

                    collector.on("collect", (msg) => {
                        const isWin = msg.content.includes("and you won");
                        const isLoss = msg.content.includes("and you lost");

                        if (isWin || isLoss) {
                            client.global.gamble.cowoncywon += isWin
                                ? currentBet
                                : -currentBet;
                            client.logger.info(
                                "Farm",
                                "Coinflip",
                                `${isWin ? "Won" : "Lost"} ${currentBet}!`,
                            );
                            currentBet = isWin
                                ? defaultBet
                                : Math.min(
                                      Math.round(currentBet * multiplier),
                                      maxBet,
                                  );
                        }
                    });

                    collector.on("end", (collected) => {
                        if (collected.size == 0) {
                            client.global.gamble.coinflip--;
                            client.logger.info(
                                "Farm",
                                "Coinflip",
                                "Failed to gamble!",
                            );
                        }
                    });
                };

                const doublecheck = setTimeout(() => {
                    client.off("messageUpdate", updateCFListener);
                    startCollector();
                }, 10000);

                client.on("messageUpdate", updateCFListener);
            });
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Coinflip",
                "Error while coinfliping: " + err,
            );
        } finally {
            client.broadcast({
                action: "update",
                type: "coinflip",
                progress: client.global.gamble.coinflip,
                cow: client.global.gamble.cowoncywon,
                global: client.global,
            });
            setTimeout(() => {
                smol();
            }, interval);
        }
    }
}

function slot(client, channel) {
    let defaultBet = client.config.settings.gamble.slot.default_amount;
    let currentBet = defaultBet;
    let maxBet = client.config.settings.gamble.slot.max_amount;
    let multiplier = client.config.settings.gamble.slot.multiplier;

    smol();
    async function smol() {
        while (
            client.global.captchadetected ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
        ) {
            await client.delay(16000);
        }
        let interval = getrand(
            client.config.interval.slot.min,
            client.config.interval.slot.max,
        );

        try {
            channel.sendTyping();
            const content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                commandrandomizer(["slots", "s"]) +
                " " +
                currentBet;

            let id;
            await channel.send({ content: `${content}` }).then((message) => {
                id = message.id;
                client.global.gamble.slot++;
                client.logger.info(
                    "Farm",
                    "Slot",
                    `Betting: ${currentBet}. Total time: ${client.global.gamble.slot}`,
                );

                const updateSlotListener = (oldMsg, newMsg) => {
                    if (
                        newMsg.channel.id !== channel.id ||
                        newMsg.author.id !== "408785106942164992" ||
                        newMsg.id.localeCompare(id) < 0
                    )
                        return;

                    const isWin =
                        newMsg.content.includes("and won") &&
                        !newMsg.content.includes("nothing...");
                    const isLoss =
                        newMsg.content.includes("and won nothing...");

                    if (isWin || isLoss) {
                        if (isWin) {
                            const match = newMsg.content.match(
                                /and won <:\w+:\d+> (\d[\d,]*)/,
                            );
                            let won =
                                Number(match[1].replace(/,/g, "")) - currentBet;
                            client.global.gamble.cowoncywon += won;
                            client.logger.info("Farm", "Slot", `Won ${won}!`);
                            currentBet = defaultBet;
                        } else if (isLoss) {
                            client.global.gamble.cowoncywon -= currentBet;
                            client.logger.info(
                                "Farm",
                                "Slot",
                                `Lost ${currentBet}!`,
                            );
                            currentBet = Math.min(
                                Math.round(currentBet * multiplier),
                                maxBet,
                            );
                        }

                        client.off("messageUpdate", updateSlotListener);
                        clearTimeout(doublecheck);
                    }
                };

                const startCollector = () => {
                    const filter = (msg) =>
                        msg.author.id === "408785106942164992" &&
                        msg.id.localeCompare(id) > 0 &&
                        msg.content.includes("SLOTS");
                    const collector = channel.createMessageCollector({
                        filter,
                        time: 10000,
                    });

                    collector.on("collect", (msg) => {
                        if (
                            msg.content.includes("and won") &&
                            !msg.content.includes("nothing...")
                        ) {
                            const match = msg.content.match(
                                /and won <:\w+:\d+> (\d[\d,]*)/,
                            );
                            let won =
                                Number(match[1].replace(/,/g, "")) - currentBet;
                            client.global.gamble.cowoncywon += won;
                            client.logger.info("Farm", "Slot", `Won ${won}!`);
                            currentBet = defaultBet;
                        } else if (msg.content.includes("and won nothing...")) {
                            client.global.gamble.cowoncywon -= currentBet;
                            client.logger.info(
                                "Farm",
                                "Slot",
                                `Lost ${currentBet}!`,
                            );
                            currentBet = Math.min(
                                Math.round(currentBet * multiplier),
                                maxBet,
                            );
                        }
                    });

                    collector.on("end", (collected) => {
                        if (collected.size == 0) {
                            client.global.gamble.slot--;
                            client.logger.info(
                                "Farm",
                                "Slot",
                                "Failed to gamble!",
                            );
                        }
                    });
                };

                const doublecheck = setTimeout(() => {
                    client.off("messageUpdate", updateSlotListener);
                    startCollector();
                }, 10000);

                client.on("messageUpdate", updateSlotListener);
            });
        } catch (err) {
            client.logger.alert("Farm", "Slot", "Error while sloting: " + err);
        } finally {
            client.broadcast({
                action: "update",
                type: "slot",
                progress: client.global.gamble.slot,
                cow: client.global.gamble.cowoncywon,
                global: client.global,
            });
            setTimeout(() => {
                smol();
            }, interval);
        }
    }
}
