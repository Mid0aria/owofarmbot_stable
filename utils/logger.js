let reallog = [];
let client, extrac;
module.exports = (uwu) => { //plz change it when upload, u will remember it, right?
    const chalk = require("chalk");
    let logger = [];
    let length = uwu.config.settings.loglength;
    if (uwu.basic.enable) extrac = uwu;
    else client = uwu;

    function info(type, module, result = "") {
        reallog.push(
            chalk.white(
                `[${new Date().toLocaleTimeString()}]`
            ) + " " +
            chalk.blue(chalk.bold(type)) + chalk.white(` >> `) +
            chalk.cyan(chalk.bold(uwu.global.type)) +
            chalk.white(` > `) +
            chalk.magenta(module) +
            chalk.white(` > `) +
            chalk.green(result)
        );
        if (reallog.length >= length) reallog.shift();
        showlog(reallog);
    };

    function warn(type, module, result = "") {
        reallog.push(
            chalk.white(
                `[${new Date().toLocaleTimeString()}]`
            ) + " " +
            chalk.blue(chalk.bold(type)) + chalk.white(` >> `) +
            chalk.cyan(chalk.bold(uwu.global.type)) +
            chalk.white(` > `) +
            chalk.magenta(module) +
            chalk.white(` > `) +
            chalk.yellow(result)
        );
        if (reallog.length >= length) reallog.shift();
        showlog(reallog);
    };

    function alert(type, module, result = "") {
        reallog.push(
            chalk.white(
                `[${new Date().toLocaleTimeString()}]`
            ) + " " +
            chalk.blue(chalk.bold(type)) + chalk.white(` >> `) +
            chalk.cyan(chalk.bold(uwu.global.type)) +
            chalk.white(` > `) +
            chalk.magenta(module) +
            chalk.white(` > `) +
            chalk.red(result)
        );
        if (reallog.length >= length) reallog.shift();
        showlog(reallog);
    };

    function showlog(reallog) {
        var mainHunt = client.global.total.hunt;
        var mainBattle = client.global.total.battle;
        var mainEvent = client.global.gems.isevent;
        var mainCF = client.global.gamble.coinflip;
        var mainSlot = client.global.gamble.slot;
        var mainCow = client.global.gamble.cowoncywon;
        
        var extraHunt = extrac.global.total.hunt;
        var extraBattle = extrac.global.total.battle;
        var extraEvent = extrac.global.gems.isevent;
        var extraCF = extrac.global.gamble.coinflip;
        var extraSlot = extrac.global.gamble.slot;
        var extraCow = extrac.global.gamble.cowoncywon;

        
        function padder(value, start) {
            let paddedText = "";
            let temp;
            if (value != null) temp = value.toString();
            else return "null";
            temp = temp.trim();
            
            let length = temp.length;
            
            if (start == true) {
                if (temp.length < 8) {
                    paddedText = temp.padStart(7, ' ');
                    return paddedText;
                } else {
                    paddedText = temp.slice(0, 5).padStart(6, ' ') + "+";
                    return paddedText;
                }
            } else {
                if (temp.length < 8) {
                    paddedText = temp.padEnd(7, ' ');
                    return paddedText;
                } else {
                    paddedText = temp.slice(0, 5).padEnd(6, ' ') + "+";
                    return paddedText;
                }
            }
        }
        
        if (uwu.config.extra.enable && uwu.config.settings.newlog) {
            console.clear();
            console.log(
`==================================================================
Status               || Main   ||  Extra
==================================================================
Total cowoncy won    || ${padder(mainCow, false)}||${padder(extraCow, true)}
==================================================================
>>>Questing
                     || ${client.global.quest.title}
Main                 || ${client.global.quest.reward}
                     || ${client.global.quest.progress}
                     || ${extrac.global.quest.title}
Extra                || ${extrac.global.quest.reward}
                     || ${extrac.global.quest.progress}
>>> Log`);
            for (const logs of reallog) console.log(logs);
        } else if (uwu.config.settings.newlog) {
            console.clear();
            console.log(
`==================================================================
Status               || Value
==================================================================
Total hunt           || ${client.global.total.hunt}
Total battle         || ${client.global.total.battle}
Having event         || ${client.global.gems.isevent}
Total coinflip       || ${client.global.gamble.coinflip}
Total slot           || ${client.global.gamble.slot}
Total cowoncy won    || ${client.global.gamble.cowoncywon}
==================================================================
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
