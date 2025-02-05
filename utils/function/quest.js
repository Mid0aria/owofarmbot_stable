/*
 * OwO Farm Bot Stable
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

/**
 * Handles the questing process for the client.
 *
 * @param {Object} client - The client object.
 * @param {Object} channel - The channel object where the quest command will be sent.
 * @param {Object} mainSender - The main sender object for duo quests.
 * @param {Object} extraSender - The extra sender object for duo quests.
 *
 * @returns {Promise<void>} - A promise that resolves when the quest handling process is complete.
 */

let type = "single";
let mainclient, extraclient, mainSender, extraSender;
let mainready = false;
let extraready = false;
const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getrand = (min, max) => Math.random() * (max - min) + min;

module.exports = async (client) => {
    let channel;

    if (client.config.extra.enable && client.config.extra.token.length > 0)
        type = "duo";

    if (client.config.settings.owoprefix.length <= 0) {
        client.config.settings.owoprefix = "owo";
    }
    if (client.global.type == "Main") {
        mainclient = client;
        channel = client.channels.cache.get(client.basic.autoquestchannelid);
        extraSender = client.channels.cache.get(
            client.config.extra.autoquestchannelid,
        );
        mainready = true;
    }
    if (client.global.type == "Extra") {
        extraclient = client;
        channel = client.channels.cache.get(client.basic.autoquestchannelid);
        mainSender = client.channels.cache.get(
            client.config.main.autoquestchannelid,
        );
        extraready = true;
    }

    client.logger.warn("Farm", "Quest", "Waiting");

    while (
        (type == "duo" && (!mainready || !extraready)) ||
        (type == "single" && !mainready)
    ) {
        await client.delay(1600);
        if (
            (type == "duo" && mainready && extraready) ||
            (type == "single" && mainready)
        ) {
            client.logger.info("Farm", "Quest", "Ready!");
            break;
        }
    }

    questHandler(client, channel, mainSender, extraSender);
};

async function questHandler(client, channel, mainSender, extraSender) {
    while (client.global.captchadetected || client.global.paused) {
        await client.delay(16000);
    }

    try {
        client.logger.info("Farm", "Questing", "Getting quest...");
        let id;
        channel.sendTyping();
        channel
            .send({
                content: `${commandrandomizer([
                    "owo",
                    client.config.settings.owoprefix,
                ])} ${commandrandomizer(["q", "quest"])}`,
            })
            .then(async (questmsg) => {
                id = questmsg.id;
                let message = await getMessage();
                async function getMessage() {
                    return new Promise((resolve) => {
                        const filter = (msg) =>
                            msg.embeds[0] &&
                            msg.embeds[0].author &&
                            msg.embeds[0].author.name.includes("Quest Log") &&
                            msg.channel.id === channel.id &&
                            msg.author.id === "408785106942164992";

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
                                "Quest",
                                "Rechecking quest...",
                            );
                            client.off("messageCreate", listener);
                            const result = (message) =>
                                message.embeds[0].author.name.includes(
                                    "Quest Log",
                                );
                            const collector = channel.createMessageCollector({
                                result,
                                time: 16000,
                            });
                            collector.on("collect", (msg) => {
                                if (
                                    msg.author.id === "408785106942164992" &&
                                    msg.id.localeCompare(id) > 0
                                ) {
                                    resolve(msg);
                                }
                            });
                            resolve(null);
                        }, 16000);

                        client.on("messageCreate", listener);
                    });
                }

                if (message == null) {
                    if (client.global.paused || client.global.captchadetected) {
                        while (true) {
                            if (
                                !(
                                    client.global.paused ||
                                    client.global.captchadetected
                                )
                            )
                                break;
                            await client.delay(3000);
                        }
                    }
                    client.logger.alert(
                        "Farm",
                        "Quest",
                        "Cannot get quest! Recheck after 61 seconds.",
                    );
                    setTimeout(() => {
                        questHandler(client, channel);
                    }, 61000);
                    return;
                }

                let questcontent = message.embeds[0].description;
                let quests = [];
                //never regex embed again, using manual method
                //wait this is split into multiple line to that is why regex not work
                const questLines = questcontent
                    .split(/\n(?=\*\*\d+\.)/)
                    .filter((line) => line.startsWith("**"));

                questLines.forEach((line) => {
                    const title = line.match(/\*\*\d+\.\s(.+?)\*\*/)[1];

                    const rewardGroup = line.match(
                        /Reward:\`\s*(?<reward>\d*)\s*<:(?<rewardtype>[\w]+):\d+>/,
                    );
                    const reward =
                        rewardGroup && rewardGroup.groups
                            ? rewardGroup.groups.reward
                            : "";
                    const type =
                        rewardGroup && rewardGroup.groups
                            ? rewardGroup.groups.rewardtype
                            : "";

                    const progressGroup = line.match(
                        /Progress:\s*\[(\d+)\/(\d+)\]/,
                    );
                    const [progress1, progress2] = progressGroup
                        ? [
                              parseInt(progressGroup[1]),
                              parseInt(progressGroup[2]),
                          ]
                        : [0, 0];

                    const isLocked = line.includes("🔒 Locked");
                    quests.push({
                        title,
                        reward,
                        type,
                        pro1: progress1,
                        pro2: progress2,
                        isLocked,
                    });
                });

                await client.delay(1600);

                if (questcontent.includes("You finished all of your quests!")) {
                    client.logger.info(
                        "Farm",
                        "Quest",
                        "All quests completed!",
                    );
                    client.global.quest.title = "All quests completed!";
                    client.global.quest.reward = "";
                    client.global.quest.progress = "";
                } else {
                    let selectedQuest = false;
                    for (const quest of quests) {
                        if (!quest.isLocked) {
                            switch (true) {
                                case quest.title.includes("Say 'owo'"):
                                    questOwO(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                case quest.title.includes("Gamble"):
                                    if (
                                        !client.basic.commands.gamble
                                            .coinflip &&
                                        !client.basic.commands.gamble.slot
                                    ) {
                                        questGamble(client, channel, quest);
                                        selectedQuest = true;
                                    }
                                    break;
                                case quest.title.includes(
                                    "Use an action command on someone",
                                ):
                                    questActionOther(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                default:
                                    break;
                            }
                            if (type == "duo" && !selectedQuest) {
                                switch (true) {
                                    case quest.title.includes(
                                        "Have a friend curse you",
                                    ):
                                        questCurse(
                                            client,
                                            channel,
                                            quest,
                                            mainSender,
                                            extraSender,
                                        );
                                        selectedQuest = true;
                                        break;
                                    case quest.title.includes(
                                        "Have a friend pray to you",
                                    ):
                                        questPray(
                                            client,
                                            channel,
                                            quest,
                                            mainSender,
                                            extraSender,
                                        );
                                        selectedQuest = true;
                                        break;
                                    case quest.title.includes(
                                        "Battle with a friend",
                                    ):
                                        questBattle(
                                            client,
                                            channel,
                                            quest,
                                            mainSender,
                                            extraSender,
                                        );
                                        selectedQuest = true;
                                        break;
                                    case quest.title.includes(
                                        "Receive a cookie from",
                                    ) &&
                                        mainclient.global.temp.usedcookie ==
                                            false &&
                                        extraclient.global.temp.usedcookie ==
                                            false:
                                        questCookie(
                                            client,
                                            channel,
                                            quest,
                                            mainSender,
                                            extraSender,
                                        );
                                        selectedQuest = true;
                                        break;
                                    case quest.title.includes(
                                        "Have a friend use an action command",
                                    ):
                                        questActionMe(
                                            client,
                                            channel,
                                            quest,
                                            mainSender,
                                            extraSender,
                                        );
                                        selectedQuest = true;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        if (selectedQuest == true) {
                            client.logger.info(
                                "Farm",
                                "Quest",
                                `Quest found: ${quest.title}`,
                            );
                            let rwKind = "";
                            switch (true) {
                                case quest.type == "weaponshard":
                                    rwKind = " Weapon Shard";
                                    break;
                                case quest.type == "cowoncy":
                                    rwKind = " Cowoncy";
                                    break;
                                case quest.type == "box":
                                    rwKind = "Bunch of lootbox";
                                    break;
                                case quest.type == "crate":
                                    rwKind = "Bunch of weapon crate";
                                    break;
                            }
                            client.global.quest.title = quest.title;
                            client.global.quest.reward = quest.reward + rwKind;
                            client.global.quest.progress =
                                quest.pro1 + " / " + quest.pro2;
                            break;
                        }
                    }

                    if (!selectedQuest) {
                        client.logger.info(
                            "Farm",
                            "Quest",
                            `No active quest found!`,
                        );

                        client.global.quest.title = "No active quest found";
                        client.global.quest.reward = "";
                        client.global.quest.progress =
                            "Recheck after 61 seconds";
                    }
                }
            });
    } catch (err) {
        client.logger.alert(
            "Farm",
            "Quest",
            "Error while getting quest: " + err + "\nRecheck after 61 seconds.",
        );
        setTimeout(() => {
            questHandler(client, channel);
        }, 61000);
    }
}

async function questOwO(client, channel, quest) {
    while (quest.pro1 - 10 < quest.pro2) {
        while (client.global.captchadetected || client.global.paused)
            await client.delay(16000);

        try {
            channel.sendTyping();
            channel
                .send({
                    content: `${commandrandomizer(["owo", "Owo", "owO", "OwO"])}`,
                })
                .then(async () => {
                    quest.pro1++;
                    client.global.quest.progress =
                        quest.pro1 + " / " + quest.pro2;
                });
            await client.delay(getrand(12000, 16000));
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Quest",
                "Error while doing quest: " + err,
            );
            quest.pro1--;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        }
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel);
    }, 16000);
}

async function questGamble(client, channel, quest) {
    while (quest.pro1 < quest.pro2) {
        while (client.global.captchadetected || client.global.paused)
            await client.delay(16000);

        try {
            channel.sendTyping();
            channel
                .send({
                    content: `${commandrandomizer([
                        "owo",
                        "Owo",
                        "owO",
                        "OwO",
                    ])} ${commandrandomizer([
                        "cf",
                        "coinflip",
                    ])} ${commandrandomizer(["head", "h", "t", "tail"])}`,
                })
                .then(async () => {
                    quest.pro1++;
                    client.global.quest.progress =
                        quest.pro1 + " / " + quest.pro2;
                });
            await client.delay(getrand(12000, 16000));
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Quest",
                "Error while doing quest: " + err,
            );
            quest.pro1--;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        }
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel);
    }, 16000);
}

async function questActionOther(client, channel, quest) {
    while (quest.pro1 < quest.pro2) {
        while (client.global.captchadetected || client.global.paused)
            await client.delay(16000);

        try {
            channel.sendTyping();
            channel
                .send({
                    content: `${commandrandomizer([
                        "owo",
                        "Owo",
                        "owO",
                        "OwO",
                    ])} ${commandrandomizer([
                        "cuddle",
                        "hug",
                        "kiss",
                        "lick",
                        "nom",
                        "pat",
                        "poke",
                        "slap",
                        "bite",
                        "punch",
                        "wave",
                        "snuggle",
                        "highfive",
                    ])} <@408785106942164992>`,
                })
                .then(async () => {
                    quest.pro1++;
                    client.global.quest.progress =
                        quest.pro1 + " / " + quest.pro2;
                });
            await client.delay(getrand(12000, 16000));
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Quest",
                "Error while doing quest: " + err,
            );
            quest.pro1--;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        }
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel);
    }, 16000);
}

//==============DUO QUEST==============

/**
 * @description Curse current token by other.
 */
async function questCurse(client, channel, quest, mainSender, extraSender) {
    let resetProp = false;
    if (client.global.type == "Main") {
        //mean main found quest: need other curse
        if (client.config.extra.commands.curse) {
            client.config.extra.commands.curse = false; //prevent self curse
            resetProp = true;
        }
        while (quest.pro1 - 1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                mainSender.sendTyping();
                mainSender
                    .send({
                        //so it will need extra to curse to main
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} curse <@${mainclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(321000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.config.extra.commands.curse = true;
    } else if (client.global.type == "Extra") {
        if (client.config.main.commands.curse) {
            client.config.main.commands.curse = false;
            resetProp = true;
        }
        while (quest.pro1 - 1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                extraSender.sendTyping();
                extraSender
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} curse <@${extraclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(321000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.config.main.commands.curse = true;
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel, mainSender, extraSender);
    }, 16000);
}

async function questPray(client, channel, quest, mainSender, extraSender) {
    let resetProp = false;
    if (client.global.type == "Main") {
        if (client.config.extra.commands.pray) {
            client.config.extra.commands.pray = false;
            resetProp = true;
        }
        while (quest.pro1 - 1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                mainSender.sendTyping();
                mainSender
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} pray <@${mainclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(321000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.config.extra.commands.pray = true;
    } else if (client.global.type == "Extra") {
        if (client.config.main.commands.pray) {
            client.config.main.commands.pray = false;
            resetProp = true;
        }
        while (quest.pro1 - 1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                extraSender.sendTyping();
                extraSender
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} pray <@${extraclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(321000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.config.main.commands.pray = true;
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel, mainSender, extraSender);
    }, 16000);
}

async function questBattle(client, channel, quest, mainSender, extraSender) {
    await client.delay(16000);
    let resetProp = false;
    if (client.global.type == "Main") {
        if (client.basic.commands.battle) {
            client.basic.commands.battle = false;
            resetProp = true;
        }
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                channel.sendTyping();
                channel
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} ${commandrandomizer(["battle", "b"])} <@${
                            extraclient.basic.userid
                        }>`,
                    })
                    .then(async () => {
                        await client.delay(4000);
                        mainSender.sendTyping();
                        mainSender.send({
                            content: `${commandrandomizer([
                                "owo",
                                client.config.settings.owoprefix,
                            ])}ab`,
                        });
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(16000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.basic.commands.battle = true;
    } else if (client.global.type == "Extra") {
        if (client.basic.commands.battle) {
            client.basic.commands.battle = false;
            resetProp = true;
        }
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected || client.global.paused)
                await client.delay(16000);

            try {
                channel.sendTyping();
                channel
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} battle <@${mainclient.basic.userid}>`,
                    })
                    .then(async () => {
                        await client.delay(4000);
                        channel.sendTyping();
                        extraSender.send({
                            content: `${commandrandomizer([
                                "owo",
                                client.config.settings.owoprefix,
                            ])}ab`,
                        });
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(16000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
        if (resetProp) client.basic.commands.battle = true;
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel, mainSender, extraSender);
    }, 16000);
}

async function questCookie(client, channel, quest, mainSender, extraSender) {
    if (client.global.type == "Main") {
        if (client.global.paused || client.global.captchadetected) {
            while (true) {
                if (!(client.global.paused || client.global.captchadetected))
                    break;
                await client.delay(3000);
            }
        }

        try {
            mainSender
                .send({
                    content: `${commandrandomizer([
                        "owo",
                        client.config.settings.owoprefix,
                    ])} cookie <@${mainclient.basic.userid}>`,
                })
                .then(async () => {
                    extraclient.global.temp.usedcookie = true;
                    quest.pro1++;
                    client.global.quest.progress =
                        quest.pro1 + " / " + quest.pro2;
                });
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Quest",
                "Error while doing quest: " + err,
            );
            quest.pro1--;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        }
    } else if (client.global.type == "Extra") {
        if (client.global.paused || client.global.captchadetected) {
            while (true) {
                if (!(client.global.paused || client.global.captchadetected))
                    break;
                await client.delay(3000);
            }
        }

        try {
            extraSender
                .send({
                    content: `${commandrandomizer([
                        "owo",
                        client.config.settings.owoprefix,
                    ])} cookie <@${extraclient.basic.userid}>`,
                })
                .then(async () => {
                    mainclient.global.temp.usedcookie = true;
                    quest.pro1++;
                    client.global.quest.progress =
                        quest.pro1 + " / " + quest.pro2;
                });
        } catch (err) {
            client.logger.alert(
                "Farm",
                "Quest",
                "Error while doing quest: " + err,
            );
            quest.pro1--;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        }
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel, mainSender, extraSender);
    }, 16000);
}

async function questActionMe(client, channel, quest, mainSender, extraSender) {
    if (client.global.type == "Main") {
        while (quest.pro1 < quest.pro2) {
            if (client.global.paused || client.global.captchadetected) {
                while (true) {
                    if (
                        !(client.global.paused || client.global.captchadetected)
                    )
                        break;
                    await client.delay(3000);
                }
            }

            try {
                mainSender.sendTyping();
                mainSender
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} ${commandrandomizer([
                            "cuddle",
                            "hug",
                            "kiss",
                            "lick",
                            "nom",
                            "pat",
                            "poke",
                            "slap",
                            "bite",
                            "punch",
                            "wave",
                            "snuggle",
                            "highfive",
                        ])} <@${mainclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(16000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
    } else if (client.global.type == "Extra") {
        while (quest.pro1 < quest.pro2) {
            if (client.global.paused || client.global.captchadetected) {
                while (true) {
                    if (
                        !(client.global.paused || client.global.captchadetected)
                    )
                        break;
                    await client.delay(3000);
                }
            }

            try {
                extraSender.sendTyping();
                extraSender
                    .send({
                        content: `${commandrandomizer([
                            "owo",
                            client.config.settings.owoprefix,
                        ])} ${commandrandomizer([
                            "cuddle",
                            "hug",
                            "kiss",
                            "lick",
                            "nom",
                            "pat",
                            "poke",
                            "slap",
                            "bite",
                            "punch",
                            "wave",
                            "snuggle",
                            "highfive",
                        ])} <@${extraclient.basic.userid}>`,
                    })
                    .then(async () => {
                        quest.pro1++;
                        client.global.quest.progress =
                            quest.pro1 + " / " + quest.pro2;
                    });
                await client.delay(16000);
            } catch (err) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Error while doing quest: " + err,
                );
                quest.pro1--;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            }
        }
    }
    client.global.quest.progress = "Completed!";

    setTimeout(() => {
        questHandler(client, channel, mainSender, extraSender);
    }, 16000);
}
