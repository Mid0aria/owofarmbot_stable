/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Executes the "curse" command in the specified channel at random intervals.
 * The function will wait if certain global conditions are met (e.g., captcha detected, paused, inventory open, checklist open).
 * It sends a typing indicator before sending the "curse" command.
 * The command can be customized based on the configuration settings.
 * The function recursively calls itself after a random interval.
 *
 * @param {Object} client - The client object containing global settings and methods.
 * @param {Object} channel - The channel object where the command will be sent.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */

const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getrand = (min, max) => Math.random() * (max - min) + min;

module.exports = async (client) => {
    let channel = client.channels.cache.get(client.basic.commandschannelid);
    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }

    if (client.basic.commands.pray) pray(client, channel);
    else if (client.basic.commands.curse) curse(client, channel);
};

async function pray(client, channel) {
    while (
        client.global.captchadetected ||
        client.global.paused ||
        client.global.inventory ||
        client.global.checklist
    ) {
        await client.delay(16000);
    }
    let interval = getrand(
        client.config.interval.pray.min,
        client.config.interval.pray.max,
    );
    try {
        channel.sendTyping();
        let content;

        if (client.basic.commands.tomain) {
            content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                "pray <@" +
                client.config.main.userid +
                ">";
        } else {
            content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                "pray";
        }
        channel
            .send({
                content: `${content}`,
            })
            .then(() => {
                client.global.total.pray++;
                client.logger.info(
                    "Farm",
                    "Pray",
                    `Total prayed time: ${client.global.total.pray}`,
                );
            });
    } catch (err) {
        client.logger.alert("Farm", "Pray", "Error while praying: " + err);
    } finally {
        setTimeout(() => {
            pray(client, channel);
        }, interval);
    }
}

async function curse(client, channel) {
    while (
        client.global.captchadetected ||
        client.global.paused ||
        client.global.inventory ||
        client.global.checklist
    ) {
        await client.delay(16000);
    }
    let interval = getrand(
        client.config.interval.pray.min,
        client.config.interval.pray.max,
    );
    try {
        channel.sendTyping();
        let content;

        if (client.basic.commands.tomain) {
            content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                "curse  <@" +
                client.config.main.userid +
                ">";
        } else {
            content =
                commandrandomizer(["owo", client.config.settings.owoprefix]) +
                "curse";
        }
        channel
            .send({
                content: `${content}`,
            })
            .then(() => {
                client.global.total.curse++;
                client.logger.info(
                    "Farm",
                    "Curse",
                    `Total prayed time: ${client.global.total.curse}`,
                );
            });
    } catch (err) {
        client.logger.alert("Farm", "Curse", "Error while cursing: " + err);
    } finally {
        setTimeout(() => {
            curse(client, channel);
        }, interval);
    }
}
