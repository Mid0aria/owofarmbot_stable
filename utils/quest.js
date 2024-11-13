const fs = require("fs");
let type = "single";
let mainclient, extraclient;
const commandrandomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = async (client, message) => {
    if (client.global.paused || client.global.captchadetected) return;
    
    let channel;
    if (client.global.type == "Main") {
        mainclient = client;
        channel = client.channels.cache.get(client.basic.autoquestchannelid);
    }
    if (client.global.type == "Extra") {
        extraclient = client;
        channel = client.channels.cache.get(client.basic.autoquestchannelid);
        type = "duo";
    }
    
    if (client.basic.commands.autoquest) setTimeout(() => {
        questHandler(client, channel);
    }, 16000);
}

async function questHandler(client, channel) {
    if (
        client.global.paused ||
        client.global.captchadetected
        ) return;
    
    client.logger.info("Farm", "Questing", "Getting quest...");
    let id;
    channel
        .send({
            content: `${commandrandomizer([
                "owo",
                client.config.settings.owoprefix,
            ])} ${commandrandomizer(["q", "quest"])}`,
        }).then(async (questmsg) => {
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
                            "Rechecking quest..."
                            );
                        client.off("messageCreate", listener);
                        const result = message => message.embeds[0].author.name.includes("Quest Log");
                        const collector = channel.createMessageCollector({ result, time: 16000});
                        collector.on("collect", (msg) => {
                            if (msg.author.id === "408785106942164992" &&
                                msg.id.localeCompare(id) > 0) {
                                resolve(msg);
                            }
                        });
                        resolve(null);
                    }, 16000);

                    client.on("messageCreate", listener);
                });
            }
            
            if (message == null) {
                client.logger.alert(
                    "Farm",
                    "Quest",
                    "Cannot get quest! Recheck after 61 secs");
                setTimeout(() => {
                    questHandler(client, channel);
                }, 61000);
                return;
            }
            
            let questcontent = message.embeds[0].description;
            let quests = [];
            //never regex embed again, using manual method
            //wait this is split into multiple line to that is why regex not work
            const questLines = questcontent.split(/\n(?=\*\*\d+\.)/).filter(line => line.startsWith("**"));

            questLines.forEach(line => {
                const title = line.match(/\*\*\d+\.\s(.+?)\*\*/)[1];

                const rewardGroup = line.match(/Reward:\`\s*(?<reward>\d*)\s*<:(?<rewardtype>[\w]+):\d+>/);
                const reward = rewardGroup && rewardGroup.groups ? rewardGroup.groups.reward : "";
                const type = rewardGroup && rewardGroup.groups ? rewardGroup.groups.rewardtype : "";
                
                const progressGroup = line.match(/Progress:\s*\[(\d+)\/(\d+)\]/);
                const [progress1, progress2] = progressGroup ? [parseInt(progressGroup[1]), parseInt(progressGroup[2])] : [0, 0];

                const isLocked = line.includes("🔒 Locked");
                quests.push({
                    title,
                    reward,
                    type,
                    pro1: progress1,
                    pro2: progress2,
                    isLocked
                });
            });
            
            await client.delay(1600);
            
            if (questcontent.includes("You finished all of your quests!")) {
                client.logger.info("Farm", "Quest", "All quest completed!");
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
                                if (!client.basic.commands.gamble.coinflip &&
                                    !client.basic.commands.gamble.slot) {
                                        questGamble(client, channel, quest);
                                        selectedQuest = true;
                                    }
                                break;
                            case quest.title.includes("Use an action command on someone"):
                                questActionOther(client, channel, quest);
                                selectedQuest = true;
                                break;
                            default:
                                break;
                        }
                        if (type == "duo" && !selectedQuest) {
                            switch (true) {
                                case quest.title.includes("Have a friend curse you"):
                                    questCurse(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                case quest.title.includes("Have a friend pray to you"):
                                    questPray(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                case quest.title.includes("Battle with a friend"):
                                    questBattle(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                case quest.title.includes("Receive a cookie from") &&
                                     (!mainclient.global.temp.usedcookie &&
                                      !extraclient.global.temp.usedcookie):
                                    questCookie(client, channel, quest);
                                    selectedQuest = true;
                                    break;
                                case quest.title.includes("Have a friend use an action command"):
                                    questActionMe(client, channel, quest);
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
                            `Quest found: ${quest.title}`
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
                        client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
                        break;
                    }
                }
                
                client.logger.info(
                    "Farm",
                    "Quest",
                    `No active quest found!`
                    );
            }
        });
}

async function questOwO(client, channel, quest) {
    while (quest.pro1 - 10 < quest.pro2) { // minus 10 to make sure
        while (client.global.captchadetected) {
            await client.delay(16000);
            if (!client.global.captchadetected) break;
        }
        channel.send({
            content: `${commandrandomizer(["owo", "Owo", "owO", "OwO"])}`
        }).then(async () => {
            quest.pro1++;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        });
        await client.delay(12345);
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questGamble(client, channel, quest) {
    while (quest.pro1 < quest.pro2) {
        while (client.global.captchadetected) {
            await client.delay(16000);
            if (!client.global.captchadetected) break;
        }
        channel.send({
            content: `${commandrandomizer(["owo", "Owo", "owO", "OwO"])}` + 
                     `${commandrandomizer(["cf", "coinflip"])}` +
                     `${commandrandomizer(["head", "h", "t", "tail"])}`
        }).then(async () => {
            quest.pro1++;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        });
        await client.delay(12345);
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questActionOther(client, channel, quest) {
    while (quest.pro1 < quest.pro2) {
        while (client.global.captchadetected) {
            await client.delay(16000);
            if (!client.global.captchadetected) break;
        }
        channel.send({
            content: `${commandrandomizer(["owo", "Owo", "owO", "OwO"])} hug <@408785106942164992>`
        }).then(async () => {
            quest.pro1++;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        });
        await client.delay(12345);
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

//==============DUO QUEST==============

/**
 * @description Curse current token by other.
 */
async function questCurse(client, channel, quest) {
    let resetProp = false;
    let currentchannel;
    if (client.global.type == "Main") { //mean main found quest: need other curse
        if (client.basic.commands.curse) {
            client.basic.commands.curse = false; //prevent self curse
            resetProp = true;
        }
        currentchannel = extraclient.channels.cache.get(extraclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            extraclient.currentchannel.send({ //so it will need extra to curse to main
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} curse <@${mainclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(321000);
        }
        if (resetProp) client.basic.commands.curse = true;
    } else if (client.global.type == "Extra") {
        if (client.basic.commands.curse) {
            client.basic.commands.curse = false;
            resetProp = true;
        }
        currentchannel = mainclient.channels.cache.get(mainclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            mainclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} curse <@${extraclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(321000);
        }
        if (resetProp) client.basic.commands.curse = true;
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questPray(client, channel, quest) {
    let resetProp = false;
    let currentchannel;
    if (client.global.type == "Main") {
        if (client.basic.commands.pray) {
            client.basic.commands.pray = false;
            resetProp = true;
        }
        currentchannel = extraclient.channels.cache.get(extraclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            extraclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} pray <@${mainclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(321000);
        }
        if (resetProp) client.basic.commands.pray = true;
    } else if (client.global.type == "Extra") {
        if (client.basic.commands.pray) {
            client.basic.commands.pray = false;
            resetProp = true;
        }
        currentchannel = mainclient.channels.cache.get(mainclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            mainclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} pray <@${extraclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(321000);
        }
        if (resetProp) client.basic.commands.pray = true;
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questBattle(client, channel, quest) {
    let resetProp = false;
    let currentchannel;
    if (client.global.type == "Main") {
        if (client.basic.commands.battle) {
            client.basic.commands.battle = false;
            resetProp = true;
        }
        currentchannel = extraclient.channels.cache.get(extraclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            extraclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} ${commandrandomizer(["battle", "b"])} <@${mainclient.basic.userid}>`
            }).then(async () => {
                await client.delay(4000);
                mainclient.currentchannel.send({
                    content: `${commandrandomizer(["owo", client.config.settings.owoprefix])}ab`
                });
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(16000);
        }
        if (resetProp) client.basic.commands.battle = true;
    } else if (client.global.type == "Extra") {
        if (client.basic.commands.battle) {
            client.basic.commands.battle = false;
            resetProp = true;
        }
        currentchannel = mainclient.channels.cache.get(mainclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            mainclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} battle <@${extraclient.basic.userid}>`
            }).then(async () => {
                await client.delay(4000);
                extraclient.currentchannel.send({
                    content: `${commandrandomizer(["owo", client.config.settings.owoprefix])}ab`
                });
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(16000);
        }
        if (resetProp) client.basic.commands.battle = true;
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questCookie(client, channel, quest) {
    let currentchannel;
    if (client.global.type == "Main") {
        currentchannel = extraclient.channels.cache.get(extraclient.basic.autoquestchannelid);
        while (client.global.captchadetected) {
            await client.delay(16000);
            if (!client.global.captchadetected) break;
        }
        extraclient.currentchannel.send({
            content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} cookie <@${mainclient.basic.userid}>`
        }).then(async () => {
            extraclient.global.temp.usedcookie = true;
            quest.pro1++;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        });
    } else if (client.global.type == "Extra") {
        currentchannel = mainclient.channels.cache.get(mainclient.basic.autoquestchannelid);
        while (client.global.captchadetected) {
            await client.delay(16000);
            if (!client.global.captchadetected) break;
        }
        mainclient.currentchannel.send({
            content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} cookie <@${extraclient.basic.userid}>`
        }).then(async () => {
            mainclient.global.temp.usedcookie = true;
            quest.pro1++;
            client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
        });
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}

async function questActionMe(client, channel, quest) {
    let currentchannel;
    if (client.global.type == "Main") {
        currentchannel = extraclient.channels.cache.get(extraclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            extraclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} ${commandrandomizer(["hug", "kiss"])} <@${mainclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(16000);
        }
    } else if (client.global.type == "Extra") {
        currentchannel = mainclient.channels.cache.get(mainclient.basic.autoquestchannelid);
        while (quest.pro1 < quest.pro2) {
            while (client.global.captchadetected) {
                await client.delay(16000);
                if (!client.global.captchadetected) break;
            }
            mainclient.currentchannel.send({
                content: `${commandrandomizer(["owo", client.config.settings.owoprefix])} ${commandrandomizer(["hug", "kiss"])} <@${extraclient.basic.userid}>`
            }).then(async () => {
                quest.pro1++;
                client.global.quest.progress = quest.pro1 + " / " + quest.pro2;
            });
            await client.delay(16000);
        }
    }
    
    setTimeout(() => {
        questHandler(client, channel)
    }, 16000);
}
