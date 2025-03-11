[Version 1.0.8.8(no longer support)](https://github.com/mid0aria/owofarmbot)<br>

dWdnY2Y6Ly9iY3JhLmZjYmd2c2wucGJ6L2dlbnB4LzVwc2tIZ1B4Y3hQVkVlWGxxVVhGb1kgcm90MTM= </br>

<h1 align="center">OwO Farm Bot Stable V0.0.9.3.2(BETA) WEBUI WITH CAPTCHA SOLVER ✒️</h1>
<h2 align ="center">The best owo farm bot until i do better. coded with the great ideas and love of a Turkish engineer, mid0hub team and users.<br> 💖 Thank you to everyone who contributed 💖</h2>
<p align="center">

[![Total Views](https://hits.sh/github.com/Mid0aria/owofarmbot_stable.svg?view=today-total&label=Repo%20Today/Total%20Views&color=770ca1&labelColor=007ec6)](https://github.com/Mid0aria/owofarmbot_stable)
[![Last Commit](https://img.shields.io/github/last-commit/mid0aria/owofarmbot_stable)](https://github.com/Mid0aria/owofarmbot_stable)

## Tutorials

### Videos

- [Windows FOR V0.0.6](https://www.youtube.com/watch?v=U4Q6joLF2Qo) - Official
- [Termux](https://youtu.be/w2tvj1oRSO8?si=ueve5EIC9usVpxIT) - ZungHieu

### Text

- [🎈・Installation](#Installation)
    - [Windows / Linux](#windows--linux) - Official
    - [Android (Termux)](#android-termux) - Official

If you need the help, join the Discord server [here](https://discord.gg/WzYXVbXt6C)

<!-- To get auth key, join the Discord server [here](https://discord.gg/WzYXVbXt6C), go to [`#🤖・bot-commands`](https://discord.com/channels/1202294695091507230/1203705738770256032), and send `s!key`. The official bot will directly message you with the key. -->

</p>

# Contents

[⭐・Star History](#star-history)<br>

[❗・Important](#important-anyone-using-the-bot-is-deemed-to-have-read-and-accepted-these)<br>

[👑・Features](#features)<br>

[⚙・Config.json example](#configjson-example)<br>

[💎・Get Token](#get-token)<br>

[🖥️・WEBUI](#%EF%B8%8Fwebui)<br>

<!-- [📚・Discord RPC](#discord-rpc)<br> -->

[⚠️・Captcha Alert](#captcha-alert)<br>

[🔗・Required Links](#required-links)<br>

[🎈・Installation](#installation)<br>

[🥰・Contributors](#contributors)<br>

[📑・License](#license)<br>

## ⭐・Star History

<h2 align="center">Goal: <a href="https://github.com/Mid0aria/owofarmbot_stable/stargazers"><img src="https://img.shields.io/github/stars/Mid0aria/owofarmbot_stable" /></a> / 512</h2>
⭐⭐⭐ You can also give this repository a star so that others know we're trusted!<br>

[![Star History Chart](https://api.star-history.com/svg?repos=Mid0aria/owofarmbot_stable&type=Date)](https://star-history.com/#Mid0aria/owofarmbot_stable&Date)

## ❗・Important (Anyone using the bot is deemed to have read and accepted these)

- Use of this farm bot may lead to actions being taken against your OwO profile and/or your Discord account. We are not responsible for them.
- FARM, HUNTBOT, QUEST AND GAMBLE NEED TO PLACE IN DIFFERENT CHANNEL. That mean if you use all of them, you need four different channel. And if you use extra token, that will be eight.

## 👑・Features

- WEBUI
- Auto Join OwO Support Server Giveaways
- Discord RPC
- Auto Phrases Send
- Chat FeedBack
- All commands now controlable
- Extra Token:

    - All Maintoken feature
    - Pray/curse to main

- Auto Commands:

    - Hunt
    - Battle
    - Pray
    - Curse
    - HuntBot (with captcha solver)
    - Upgrade HuntBot
    - Gamble
        - Coinflip
        - Slot

- Questing:

    - Do quest that require one user to done
    - If extratoken is enabled, both can do quest for each other

- Animals:

    - Type:
        - Sell
        - Sacrifice
    - Choose which animal types to use

- CheckList:

    - Auto Claim Daily
    - Auto Cookie
    - Auto Vote (ONLY WORKS ON DESKTOP)

- Inventory:

    - Auto Check Inventory
    - Auto Use Lootbox
    - Auto Use Fabled Lootbox
    - Auto Use Crate
    - Auto Use Gems

- Captcha:

    - Alert Type:

        - Notification
        - Prompt
        - Webhook

    - Features:
        - Auto Solving HCAPTCHA(web captcha) with thread system(ONLY WORKS ON DESKTOP)
        - Command Randomizer
        - Suspends all farm operations when captcha is detected
        - When the captcha is solved, farm operations continue automatically

- NEW FEATURES WILL COME WITH UPDATES

## ⚙・config.json example

```
{
    "firstrun": true, / A necessary setting for the automatic config filling system. please do not change
    "prefix": "!", / SelfBot PREFIX
    "main": { / main account, required
        "token": "", / SelfBot Token (your discord token)
        "userid": "",  / SelfBot UserID (your account userid)
        "commandschannelid": "", / Farm Channel ID
        "huntbotchannelid": "", / HuntBot Channel ID
        "owodmchannelid": "", / OwO DM Channel ID
        "gamblechannelid": "", / Gamble Channel ID
        "autoquestchannelid": "", / Quest Channel ID
        "autostart": false, / set to true if you want the farm bot to run as soon as you run the code, true or false (boolean)


        "commands": {
            "hunt": true, / true or false (boolean)
            "battle": true, / true or false (boolean)
            "pray": false, / true or false (boolean)
            "curse": true, / true or false (boolean)
            "huntbot": {
                "enable": true, / true or false (boolean)
                "maxtime": 10 / If no valid duration is found for huntbot, the value here is used in hours
                "upgrade": false, / true or false (boolean)
                "upgradetype": "duration" / efficiency, duration, cost, gain, exp or radar
            },
            "gamble": {
                "coinflip": true, / true or false (boolean)
                "slot": true / true or false (boolean)
            },
            "animals": false, / true or false (boolean) (sell/sac animals or not)
            "inventory": true, / true or false (boolean)
            "checklist": true, / true or false (boolean)
            "autoquest": true / true or false (boolean)
        },
        "maximum_gem_rarity": "Mythical" / "common", "uncommon", "rare", "epic", "mythical", "legendary", "fabled"
    },
    "extra": { / not required for explain, same as main
        "enable": true,
        "token": "",
        "userid": "",
        "commandschannelid": "",
        "huntbotchannelid": "",
        "owodmchannelid": "",
        "gamblechannelid": "",
        "autoquestchannelid": "",
        "autostart": false,

        "commands": {
            "hunt": true,
            "battle": true,
            "pray": false,
            "curse": true,
            "huntbot": {
                "enable": true, / true or false (boolean)
                "maxtime": 10 / If no valid duration is found for huntbot, the value here is used in hours
                "upgrade": false, / true or false (boolean)
                "upgradetype": "duration" / efficiency, duration, cost, gain, exp or radar
            },
            "tomain": true, / use curse/pray to main token or not, true or false (boolean)
            "gamble": {
                "coinflip": true,
                "slot": true
            },
            "animals": false,
            "inventory": true,
            "checklist": true,
            "autoquest": true
        },
        "maximum_gem_rarity": "Mythical"
    },
    "settings": {
        "owoprefix": "w", / owo bot's prefix on your server (recommended)
        "discordrpc": false, / true or false (boolean)
        "chatfeedback": true, / true or false (boolean)
        "autophrases": true, / true or false (boolean)
        "autoresume": false, / auto resume bot after captcha sloved. true or false (boolean)
        "autojoingiveaways": true, / you are automatically entered into giveaways on the owo support server [you must be present on the server] (boolean)

        "checklist": {
            "types": {
                "daily": true, / true or false (boolean)
                "cookie": true, / true or false (boolean)
                "vote": true / make true if you want automatic voting. true or false (boolean)
            }
        },

        "inventory": {
            "use": {
                "lootbox": true, / true or false (boolean)
                "fabledlootbox": false, / true or false (boolean)
                "crate": true, / true or false (boolean)
                "gems": true / true or false (boolean)
            }
        },

        "gamble": {
            "coinflip": {
                "default_amount": 1000, / base bet value
                "max_amount": 250000, / max bet value, will reset to base if current bet bigger
                "multiplier": 1.0 / multiply when lose
            },
            "slot": {
                "default_amount": 1000,
                "max_amount": 250000,
                "multiplier": 1.0
            }
        }

        "logging": {
            "newlog": true, / a log with a table for controlling, will remove old log
            "loglength": 20, / how many lines of log at one moment (only affect when newlog is true)
            "showlogbeforeexit": false / show a full log when user click ctrl + c (only affect when newlog is true)
        },

        "safety": {
            "autopause": false, / emable auto pause the bot after a while
            "pauseafter": 30, / how long the bot will run until getting paused (in minutes)
            "pausefor": 5 / how long the bot will pause (in minutes)
        },

        "captcha": {
            "autosolve": true, // (set to true if you want hcaptcha to solve) true or false (boolean)
            "autosolve_thread": 1, // you choose how many threads the hcaptcha solver will run with (higher threads = faster captcha solver, you may need a powerful cpu for higher threads) (integer)
            "alerttype": {
                "webhook": true, / true or false (boolean)
                "webhookurl": "xxx"  / If you set webhook to true, enter your webhook url here
                "desktop": {
                    "force": true, / true or false (boolean). Force the bot to show alert when detect captcha
                    "notification": true, / true or false (boolean)
                    "prompt": true / true or false (boolean)
                },
                "termux": {
                    "notification": true, / true or false (boolean)
                    "vibration": true, / true or false (boolean)
                    "vibration_time": 5000, / recommended minimum of 3000 milliseconds (integer)
                    "toast": true / true or false (boolean)
                }
            }
        },
    },
    "animals": {
        "type": {
            "sell": false, / true or false (boolean)
            "sacrifice": false / true or false (boolean)
        },
        "animaltype": {
            "common": false, / true or false (boolean)
            "uncommon": false, / true or false (boolean)
            "rare": false, / true or false (boolean)
            "epic": false, / true or false (boolean)
            "mythical": false, / true or false (boolean)
            "patreon": false, / true or false (boolean)
            "cpatreon": false, / true or false (boolean)
            "legendary": false, / true or false (boolean)
            "gem": false, / true or false (boolean)
            "bot": false, / true or false (boolean)
            "distorted": false, / true or false (boolean)
            "fabled": false, / true or false (boolean)
            "special": false, / true or false (boolean)
            "hidden": false / true or false (boolean)
        }
    },
    "interval": { / interval for commands (milisecond)
        "hunt": {
            "max": 32000,
            "min": 16000
        },
        "battle": {
            "max": 32000,
            "min": 16000
        },
        "pray": {
            "max": 332000,
            "min": 316000
        },
        "coinflip": {
            "max": 32000,
            "min": 16000
        },
        "slot": {
            "max": 32000,
            "min": 16000
        },
        "animals": {
            "max": 661000,
            "min": 610000
        },
    }
    "socket": {
        "expressport": 1243/ If another program is using port 1243 on your computer (I think it shouldn't be), you can avoid the conflict by changing the port here.
    }
}



```

## 💎・Get Token

[BLOG - Geeks for Geeks - How to get discord token](https://www.geeksforgeeks.org/how-to-get-discord-token/)
[YOUTUBE - GuideRealm - How To Get Your Token In Discord](https://www.youtube.com/watch?v=7J38Uy5Y4vA)

### PC

1. Open your preferred browser (with developer tools) and login to https://discord.com/app
2. Press CTRL + Shift + I and open the Console tab.
3. Paste the following code.
4. The text returned (excluding the quotes `'`) will be your Discord account token.

```js
(webpackChunkdiscord_app.push([
    [""],
    {},
    (e) => {
        for (let t in ((m = []), e.c)) m.push(e.c[t]);
    },
]),
m)
    .find((e) => e?.exports?.default?.getToken !== void 0)
    .exports.default.getToken();
```

### Mobile/Android

1. Open Chrome
2. Create a bookmark (by clicking on star button in 3 dots menu)
3. Edit it and set name to Token Finder and url to the following code:
    ```javascript
    javascript: (webpackChunkdiscord_app.push([[""],{},(e)=>{m=[];for (let c in e.c) m.push(e.c[c]);},]),m).find((m) => m?.exports?.default?.getToken%20!==%20void%200)%20%20%20%20.exports.default.getToken();
    ```
4. Open https://discord.com/app and log in.
5. Tap on search bar and type Token Finder (don't search it just type)
6. Click on the bookmark named Token Finder.
7. A new page will open, the text in the page will be your Discord account token.

## 🖥️・WEBUI

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/assets/webui.png)

<!-- ## 📚・Discord RPC

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/images/rpc.jpg) -->

## ❗・Captcha Alert

> [!NOTE]
> If you want the captcha alert to work properly, turn off do not disturb, or you can use promt mode

Notify mode:

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/assets/notificationss.png)

Promt mode:

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/assets/promptss.png)

## 🔗・Required Links

[NodeJS (version 22.12.0)](https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi)<br>
[Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)<br>
[Farm Bot ZIP File](https://github.com/Mid0aria/owofarmbot_stable/archive/refs/heads/main.zip)

## 🎈・Installation

## For Beginners:

### 💻・Windows

```bash
irm "https://raw.githubusercontent.com/mid0aria/owofarmbot_stable/main/windows-setup.ps1" | iex
```

## For Advanced Users:

### 💻・Windows / Linux

```bash
# Check Node.js version:
node -v

# Clone the files with git:
git clone --recurse-submodules https://github.com/mid0aria/owofarmbot_stable
# Optionally you can also download from github at https://github.com/Mid0aria/owofarmbot_stable/archive/refs/heads/main.zip

# Enter into the cloned directory:
cd owofarmbot_stable

# Configure the bot:
notepad config.json # On windows
nano config.json # On linux, can also use any other preferred file writing software

# Run the bot:
node main.js

# Start Bot:
From WebUI, go to home and press the start button from the actions buttons there.

From Discord, In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Pause Bot:
From WebUI, go to home and press the pause button from the actions buttons there.

From Discord, In config.json, type [prefix]pause (example: e!pause) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
From WebUI, go to home and press the resume button from the actions buttons there.

From Discord, In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
From WebUI, go to home and press the reboot button from the actions buttons there.

From Discord, In config.json, type [prefix]stop (example: e!reboot) with the prefix you set in config.json to the channel whose ID you entered in channelid


```

### 📱・Android (Termux)

You need to download the following two applications:<br>
[Termux](https://f-droid.org/tr/packages/com.termux/)<br>
[Termux-API for notifications](https://f-droid.org/tr/packages/com.termux.api/)

```bash
# Install:
apt update -y && apt upgrade -y
curl https://raw.githubusercontent.com/mid0aria/owofarmbot_stable/main/termux-setup.sh | bash


# Configure the bot:

cd owofarmbot_stable
nano config.json

# Run the bot:
node main.js

# Start Bot:
From WebUI, go to home and press the start button from the actions buttons there.

From Discord, In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Pause Bot:
From WebUI, go to home and press the pause button from the actions buttons there.

From Discord, In config.json, type [prefix]pause (example: e!pause) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
From WebUI, go to home and press the resume button from the actions buttons there.

From Discord, In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
From WebUI, go to home and press the reboot button from the actions buttons there.

From Discord, In config.json, type [prefix]stop (example: e!reboot) with the prefix you set in config.json to the channel whose ID you entered in channelid

```

## 🥰・Contributors

- Random-629671 [(GitHub)](https://github.com/Random-629671)
- Hiếu LoneLy [(YouTube)](https://www.youtube.com/watch?v=w2tvj1oRSO8)

## 📑・License

[OwO Farm Bot Stable](https://github.com/Mid0aria/owofarmbot_stable) is licensed under the terms of [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/Mid0aria/owofarmbot_stable/blob/main/LICENSE) ("CC-BY-NC-SA-4.0"). Commercial use is not allowed under this license. This includes any kind of revenue made with or based upon the software, even donations.

The CC-BY-NC-SA-4.0 allows you to:

- [x] **Share** -- copy and redistribute the material in any medium or format
- [x] **Adapt** -- remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

More information can be found [here](https://creativecommons.org/licenses/by-nc-sa/4.0/).
