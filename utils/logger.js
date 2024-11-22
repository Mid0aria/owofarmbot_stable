let reallog = [];
let fulllog = [];
let client, extrac;
module.exports = (uwu) => { //plz change it when upload, u will remember it, right?
    let logger = [];
    let length = uwu ? uwu.config.settings.logging.loglength : 16;
    if (uwu.global.type == "Main") client = uwu;
    else extrac = uwu;
    let exitlog = uwu.config.settings.logging.showlogbeforeexit && uwu.config.settings.logging.newlog;
    process.on('SIGINT', () => {
        if (exitlog) {
            for (const logs of fulllog) console.log(logs);
            console.log("//END OF LOG//");
        }
        process.exit(0);
    });
            
    
    function info(type, module, result = "") {
        logging(type, module, result, client.chalk.green);
    }

    function warn(type, module, result = "") {
        logging(type, module, result, client.chalk.yellow);
    }

    function alert(type, module, result = "") {
        logging(type, module, result, client.chalk.red);
    }

    function logging(type, module, result, color) {
        const logMessage = `${client.chalk.white(`[${new Date().toLocaleTimeString()}]`)} ` +
                           `${client.chalk.blue(client.chalk.bold(type))}` +
                           `${(type == "Bot" || type == "Updater") && (module != "Startup" && module != "Captcha") ? "" : //idk why i put this on
                           `${client.chalk.white(" >> ")}${client.chalk.cyan(client.chalk.bold(uwu.global.type))}`} > ` +
                           `${client.chalk.magenta(module)} > ` +
                           `${color(result)}`;

        reallog.push(logMessage);
        if (exitlog) fulllog.push(logMessage);
        if (reallog.length >= length) reallog.shift();
        showlog(reallog);
    }

    function showlog(reallog) {
        //no client
        if (!client.global.temp.isready || !extrac.global.temp.isready) {
            console.log(reallog[reallog.length - 1]);
            return;
        }
        
        //leave the var here if future need
        var mainHunt = client.global.total.hunt;
        var mainBattle = client.global.total.battle;
        var mainEvent = client.global.gems.isevent ? "Yes" : "No";
        var mainCF = client.global.gamble.coinflip;
        var mainSlot = client.global.gamble.slot;
        var mainCow = client.global.gamble.cowoncywon;
        var mainCaptcha = client.global.captchadetected ? client.chalk.red("Danger  ") : client.chalk.green("Safe    ");
        var mainPause = client.global.paused ? client.chalk.yellow("Paused  ") : client.chalk.cyan("Running ");
        
        if (extrac) {
            var extraHunt = extrac.global.total.hunt;
            var extraBattle = extrac.global.total.battle;
            var extraEvent = extrac.global.gems.isevent ? "Yes" : "No";
            var extraCF = extrac.global.gamble.coinflip;
            var extraSlot = extrac.global.gamble.slot;
            var extraCow = extrac.global.gamble.cowoncywon;
            var extraCaptcha = extrac.global.captchadetected ? client.chalk.red("Danger  ") : client.chalk.green("Safe    ");
            var extraPause = extrac.global.paused ? client.chalk.yellow("Paused  ") : client.chalk.cyan("Running ");
        }

        
        function padder(value) {
            let paddedText = "";
            let temp;
            if (value != null) temp = value.toString();
            else return "null";
            temp = temp.trim();
            
            let length = temp.length;
            if (temp.length < 9) {
                paddedText = temp.padEnd(8, ' ');
                return paddedText;
            } else {
                paddedText = temp.slice(0, 6).padEnd(7, ' ') + "+";
                return paddedText;
            }
        }
        
        if (uwu.config.extra.enable && extrac && uwu.config.settings.logging.newlog) {
            console.clear();
            console.log(
`╔══════════╦═══════════════════════╦════════════════════════════════════════════════
║ Token    ║ Status                ║ Questing
╠══════════╬═══════════════════════╬════════════════════════════════════════════════
║ Main     ║ Total hunt: ${padder(mainHunt, false)}  ║ ${client.global.quest.title}
║ ${mainCaptcha} ║ Total battle: ${padder(mainBattle, false)}║ ${client.global.quest.reward}
║ ${mainPause} ║ Cowoncy won: ${padder(mainCow, false)} ║ ${client.global.quest.progress}
╠══════════╬═══════════════════════╬════════════════════════════════════════════════
║ Extra    ║ Total hunt: ${padder(extraHunt, false)}  ║ ${extrac.global.quest.title}
║ ${extraCaptcha} ║ Total battle: ${padder(extraBattle, false)}║ ${extrac.global.quest.reward}
║ ${extraPause} ║ Cowoncy won: ${padder(extraCow, false)} ║ ${extrac.global.quest.progress}
╚══════════╩═══════════════════════╩════════════════════════════════════════════════
>>> Log`);
            for (const logs of reallog) console.log(logs);
        } else if (uwu.config.settings.logging.newlog) {
            console.clear();
            console.log(
`╔══════════════════════╦══════════╦═══════════════════════════════════════════════
║ Name                 ║ Status   ║ Questing
╠══════════════════════╬══════════╬═══════════════════════════════════════════════
║ Total hunt           ║ ${padder(mainHunt, false)} ║ > Title
║ Total battle         ║ ${padder(mainBattle, false)} ║ ${client.global.quest.title} 
║ Having event         ║ ${padder(mainEvent, false)} ║ > Reward
║ Total cowoncy won    ║ ${padder(mainCow, false)} ║ ${client.global.quest.reward}
║ Safety level         ║ ${mainCaptcha} ║ > Progress
║ Running?             ║ ${mainPause} ║ ${client.global.quest.progress}
╚══════════════════════╩══════════╩═══════════════════════════════════════════════
>>> Log`);
            for (const logs of reallog) console.log(logs);
        } else console.log(reallog[reallog.length - 1]);
    }

    return {
        info,
        warn,
        alert,
    };
};
