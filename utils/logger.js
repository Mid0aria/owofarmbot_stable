const chalk = require("chalk");
let logger = [];

logger.info = (type, module, result = "") => {
    console.log(
        chalk.white(
            `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`
        ),
        chalk.blue(chalk.bold(type)),
        chalk.white(`>`),
        chalk.magenta(module),
        chalk.white(`>`),
        chalk.green(result)
    );
};

logger.warn = (type, module, result = "") => {
    console.log(
        chalk.white(
            `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`
        ),
        chalk.blue(chalk.bold(type)),
        chalk.white(`>`),
        chalk.magenta(module),
        chalk.white(`>`),
        chalk.yellow(result)
    );
};

logger.alert = (type, module, result = "") => {
    console.log(
        chalk.white(
            `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`
        ),
        chalk.blue(chalk.bold(type)),
        chalk.white(`>`),
        chalk.magenta(module),
        chalk.white(`>`),
        chalk.red(result)
    );
};

module.exports = { logger };
