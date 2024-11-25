[Version 1.0.8.8(no longer support)](https://github.com/mid0aria/owofarmbot)<br>

dWdnY2Y6Ly9iY3JhLmZjYmd2c2wucGJ6L2dlbnB4LzVwc2tIZ1B4Y3hQVkVlWGxxVVhGb1kgcm90MTM= </br>

<h1 align="center">OwO Farm Bot Stable V0.0.3(BETA)</h1>
<p align="center">

[![Total Views](https://hits.sh/github.com/Mid0aria/owofarmbot_stable.svg?view=today-total&label=Repo%20Today/Total%20Views&color=770ca1&labelColor=007ec6)](https://github.com/Mid0aria/owofarmbot_stable)
[![Last Commit](https://img.shields.io/github/last-commit/mid0aria/owofarmbot_stable)](https://github.com/Mid0aria/owofarmbot_stable)

## Tutorials

### Videos

-   [Windows](https://youtu.be/ceTXgTorn30) - Official
-   [Termux](https://youtu.be/w2tvj1oRSO8?si=ueve5EIC9usVpxIT) - ZungHieu

### Text

-   [🎈・Installation](#Installation)
    -   [Windows / Linux](#windows--linux) - Official
    -   [Android / iOS (Termux)](#android--ios-termux) - Official

To get auth key, join the Discord server [here](https://discord.gg/WzYXVbXt6C), go to [`#🤖・bot-commands`](https://discord.com/channels/1202294695091507230/1203705738770256032), and send `s!key`. The official bot will directly message you with the key.

</p>

# Contents

[⭐・Star History](#star-history)<br>

[❗・Important](#important-anyone-using-the-bot-is-deemed-to-have-read-and-accepted-these)<br>

[👑・Features](#features)<br>

[⚙・Config.json example](#configjson-example)<br>

[💎・Get Token](#get-token)<br>

[📚・Discord RPC](#discord-rpc)<br>

[⚠️・Captcha Alert](#captcha-alert)<br>

[🔗・Required Links](#required-links)<br>

[🎈・Installation](#installation)<br>

[🥰・Contributors](#contributors)<br>

[📑・License](#license)<br>

[🤓・For the curious](#for-the-curious)<br>

## ⭐・Star History

<h2 align="center">Goal: <a href="https://github.com/Mid0aria/owofarmbot_stable/stargazers"><img src="https://img.shields.io/github/stars/Mid0aria/owofarmbot_stable" /></a> / 512</h2>
⭐⭐⭐ You can also give this repository a star so that others know we're trusted!<br>

[![Star History Chart](https://api.star-history.com/svg?repos=Mid0aria/owofarmbot_stable&type=Date)](https://star-history.com/#Mid0aria/owofarmbot_stable&Date)

## ❗・Important (Anyone using the bot is deemed to have read and accepted these)

-   Use of this farm bot may lead to actions being taken against your OwO profile and/or your Discord account. We are not responsible for them.
-   Discord may restart as a result of discord RPC overload.
-   FARM, QUEST AND GAMBLE NEED TO PLACE IN DIFFERENT CHANNEL. That mean if you use all of them, you need three different channel. And if you use extra token, that will be six.

## 👑・Features

-   Auto Commands:

    -   Hunt
    -   Battle
    -   Pray
    -   Curse
    -   Gamble
        -   Coinflip
        -   Slot

-   Questing:

    -   Do quest that require one user to done
    -   If extratoken is enabled, both can do quest for each other

-   Animals:

    -   Type:
        -   Sell
        -   Sacrifice
    -   Choose which animal types to use

-   CheckList:

    -   Auto Claim Daily
    -   Auto Cookie
    -   Auto Open Vote PAGE

-   Inventory:

    -   Auto Check Inventory
    -   Auto Use Lootbox
    -   Auto Use Fabled Lootbox
    -   Auto Use Crate
    -   Auto Use Gems

-   Captcha:

    -   Alert Type:

        -   Notification
        -   Prompt

    -   Features:
        -   Command Randomizer
        -   Suspends all farm operations when captcha is detected
        -   When the captcha is solved, farm operations continue automatically
        -   NEW CAPTCHA FEATURES WILL COME WITH UPDATES

-   Discord RPC
-   Auto Phrases Send
-   Chat FeedBack
-   Extra Token:
    -   All Maintoken feature
    -   Pray/curse to main
-   All commands now controlable

-   NEW FEATURES WILL COME WITH UPDATES

## ⚙・config.json example

```
{
    "midoservices_authkey": "", / Mido services AUTH KEY
    "prefix": "!", / SelfBot PREFIX
    "main": { / main account, required
        "token": "", / SelfBot Token (your discord token)
        "userid": "",  / SelfBot UserID (your account userid)
        "commandschannelid": "", / Farm Channel ID
        "owodmchannelid": "", / OwO DM Channel ID
        "gamblechannelid": "", / Gamble Channel ID
        "autoquestchannelid": "", / Quest Channel ID

        "commands": {
            "hunt": true, / true or false (boolean)
            "battle": true, / true or false (boolean)
            "pray": false, / true or false (boolean)
            "curse": true, / true or false (boolean)
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
    "extra": { / not required, same as main
        "enable": true,
        "token": "",
        "userid": "",
        "commandschannelid": "",
        "owodmchannelid": "",
        "gamblechannelid": "",
        "autoquestchannelid": "",

        "commands": {
            "hunt": true,
            "battle": true,
            "pray": false,
            "curse": true,
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
        "logging": {
            "newlog": true, / a log with a table for controlling, will remove old log
            "loglength": 20, / how many lines of log at one moment (only affect when newlog is true)
            "showlogbeforeexit": false / show a full log when user click ctrl + c (only affect when newlog is true)
        },
        "checklist": {
            "types": {
                "daily": true, / true or false (boolean)
                "cookie": true, / true or false (boolean)
                "vote": true / true or false (boolean)
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
        "captcha": {
            "alerttype": {
                "notification": true, / true or false (boolean)
                "prompt": true / true or false (boolean)
                "webhook": true, / true or false (boolean)
                "webhookurl": "xxx"  / If you set webhook to true, enter your webhook url here
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
        }
    }
}



```

## 💎・Get Token

[Geeks for Geeks - How to get discord token](https://www.geeksforgeeks.org/how-to-get-discord-token/)

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

## 📚・Discord RPC

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/images/rpc.jpg)

## ❗・Captcha Alert

> [!NOTE]
> If you want the captcha alert to work properly, turn off do not disturb, or you can use promt mode

Notify mode:

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/assets/notificationss.png)

Promt mode:

![](https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/assets/promptss.png)

## 🔗・Required Links

[NodeJS](https://nodejs.org/en/)<br>
[Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)<br>
[Farm Bot ZIP File](https://github.com/Mid0aria/owofarmbot_stable/archive/refs/heads/main.zip)

## 🎈・Installation

### 💻・Windows / Linux

```bash
# Check Node.js version:
node -v

# Clone the files with git:
git clone https://github.com/Mid0aria/owofarmbot_stable
# Optionally you can also download from github at https://github.com/Mid0aria/owofarmbot_stable/archive/refs/heads/main.zip

# Enter into the cloned directory:
cd owofarmbot_stable

# Configure the bot:
notepad config.json # On windows
nano config.json # On linux, can also use any other preferred file writing software

# Run the bot:
start ./start.bat
or
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid
```

### 📱・Android / iOS (Termux)

```bash
# Install:

apt update -y && apt upgrade -y && pkg install wget
wget https://raw.githubusercontent.com/mid0aria/owofarmbot_stable/main/termux-setup.sh
sh termux-setup.sh

# Configure the bot:

cd owofarmbot_stable
nano config.json

# Run the bot:
sh start.sh
or
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid
```

## 🥰・Contributors

-   Random-629671 [(GitHub)](https://github.com/Random-629671)
-   Hiếu LoneLy [(YouTube)](https://www.youtube.com/watch?v=w2tvj1oRSO8)

## 📑・License

[OwO Farm Bot Stable](https://github.com/Mid0aria/owofarmbot_stable) is licensed under the terms of [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/Mid0aria/owofarmbot_stable/blob/main/LICENSE) ("CC-BY-NC-SA-4.0"). Commercial use is not allowed under this license. This includes any kind of revenue made with or based upon the software, even donations.

The CC-BY-NC-SA-4.0 allows you to:

-   [x] **Share** -- copy and redistribute the material in any medium or format
-   [x] **Adapt** -- remix, transform, and build upon the material

Under the following terms:

-   **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
-   **NonCommercial** — You may not use the material for commercial purposes.
-   **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

More information can be found [here](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## 🤓・For the curious

> Which module was used for what:

```bash
Update System:
adm-zip
axios
fs-extra

Selfbot System:
discord.js-selfbot-v13

Captcha System:
node-notifier

Diagnostic System: (disabled for now)
axios
systeminformation


```
