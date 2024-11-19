const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client, message) => {
    if (client.global.paused || client.global.captchadetected) return;
    
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
            coinfliping ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
        ) {
            setTimeout(smol, 16000);
            return;
        }

        coinfliping = true;
        const content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                           commandrandomizer(["coinflip", "cf"]) + " " +
                           commandrandomizer(["heads", "tails", "h", "t"]) + " " + currentBet;

        let id;
        await channel.send({ content: `${content}` }).then((message) => {
            id = message.id;
            client.global.gamble.coinflip++;
            client.logger.info(
                "Farm",
                "Coinflip",
                `Betting: ${currentBet}. Total time: ${client.global.gamble.coinflip}`);
        });

        const updateCFListener = (oldMsg, newMsg) => {
            if (newMsg.channel.id !== channel.id ||
                newMsg.author.id !== "408785106942164992" ||
                newMsg.id.localeCompare(id) < 0) return;
            const isWin = newMsg.content.includes("and you won");
            const isLoss = newMsg.content.includes("and you lost");

            if ((isWin || isLoss) &&
                (
                !oldMsg.content.includes("and you won") &&
                !oldMsg.content.includes("and you lost")
                )) {
                client.global.gamble.cowoncywon += isWin ? currentBet : -currentBet;
                client.logger.info("Farm", "Coinflip", `${isWin ? "Won" : "Lost"} ${currentBet}!`);
                currentBet = isWin ? defaultBet : Math.min(Math.round(currentBet * multiplier), maxBet);

                client.off('messageUpdate', updateCFListener);
                coinfliping = false;
                setTimeout(smol, 16000);
            }
        };

        const startCollector = () => {
            const filter = msg =>
                msg.author.id === "408785106942164992" &&
                msg.id.localeCompare(id) > 0 &&
                msg.content.includes("and chose");
            const collector = channel.createMessageCollector({ filter, time: 10000 });

            collector.on("collect", (msg) => {
                const isWin = msg.content.includes("and you won");
                const isLoss = msg.content.includes("and you lost");

                if (isWin || isLoss) {
                    client.global.gamble.cowoncywon += isWin ? currentBet : -currentBet;
                    client.logger.info("Farm", "Coinflip", `${isWin ? "Won" : "Lost"} ${currentBet}!`);
                    currentBet = isWin ? defaultBet : Math.min(Math.round(currentBet * multiplier), maxBet);
                    coinfliping = false;
                } else {
                    client.global.gamble.coinflip--;
                    client.logger.info("Farm", "Coinflip", "Failed to gamble!");
                }

                collector.stop();
            });

            collector.on("end", () => setTimeout(smol, 16000));
        };

        setTimeout(() => {
            if (coinfliping) {
                client.off('messageUpdate', updateCFListener);
                startCollector();
            }
        }, 10000);

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
            sloting ||
            client.global.paused ||
            client.global.inventory ||
            client.global.checklist
        ) {
            setTimeout(smol, 16000);
            return;
        }

        sloting = true;
        const content = commandrandomizer(["owo", client.config.settings.owoprefix]) +
                        commandrandomizer(["slots", "s"]) + " " + currentBet;

        let id;
        await channel.send({ `${content}` }).then((message) => {
            id = message.id;
            client.global.gamble.slot++;
            client.logger.info(
                "Farm",
                "Slot",
                `Betting: ${currentBet}. Total time: ${client.global.gamble.slot}`);
        });

        const updateSlotListener = (oldMsg, newMsg) => {
            if (newMsg.channel.id !== channel.id ||
                newMsg.author.id !== "408785106942164992" ||
                newMsg.id.localeCompare(id) < 0) return;
            
            const isWin = newMsg.content.includes("and won") && !newMsg.content.includes("nothing...");
            const isLoss = newMsg.content.includes("and won nothing...");
            
            if (isWin || isLoss) {
                if (isWin) {
                    const match = newMsg.content.match(/and won <:\w+:\d+> (\d[\d,]*)/);
                    let won = Number(match[1].replace(/,/g, '')) - currentBet;
                    client.global.gamble.cowoncywon += won;
                    client.logger.info("Farm", "Slot", `Won ${won}!`);
                    currentBet = defaultBet;
                } else if (isLoss) {
                    client.global.gamble.cowoncywon -= currentBet;
                    client.logger.info("Farm", "Slot", `Lost ${currentBet}!`);
                    currentBet = Math.min(Math.round(currentBet * multiplier), maxBet);
                }
                
                client.off('messageUpdate', updateSlotListener);
                sloting = false;
                setTimeout(smol, 18000);
            }
        };

        const startCollector = () => {
            const filter = msg => msg.author.id === "408785106942164992" && msg.id > id && msg.content.includes("SLOTS");
            const collector = channel.createMessageCollector({ filter, time: 10000 });

            collector.on("collect", (msg) => {
                const isWin = msg.content.includes("and won") && !msg.content.includes("nothing...");
                const isLoss = msg.content.includes("and won nothing...");

                if (isWin || isLoss) {
                    if (isWin) {
                        const match = msg.content.match(/and won <:\w+:\d+> (\d[\d,]*)/);
                        let won = Number(match[1].replace(/,/g, '')) - currentBet;
                        client.global.gamble.cowoncywon += won;
                        client.logger.info("Farm", "Slot", `Won ${won}!`);
                        currentBet = defaultBet;
                    } else {
                        client.global.gamble.cowoncywon -= currentBet;
                        client.logger.info("Farm", "Slot", `Lost ${currentBet}!`);
                        currentBet = Math.min(Math.round(currentBet * multiplier), maxBet);
                    }
                    
                    sloting = false;
                } else {
                    client.global.gamble.slot--;
                    client.logger.info("Farm", "Slot", "Failed to gamble!");
                    sloting = false;
                }

                collector.stop();
            });

            collector.on("end", () => setTimeout(smol, 16000));
        };

        setTimeout(() => {
            if (sloting) {
                client.off('messageUpdate', updateSlotListener);
                startCollector();
            }
        }, 10000);

        client.on('messageUpdate', updateSlotListener);
    }
}