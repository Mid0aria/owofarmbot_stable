/**
 * This file is an example of a socket for huntbot
 * You can solve the huntbot captcha by communicating between this code and python code
 * You can change the port via socket.port in config.json (I think the current port is ideal)
 * When Huntbot is added, don't forget to add the code to start utils/huntbot/huntbotcaptcha.py in the background with childprocess
 *
 */

const io = require("socket.io-client");
const cp = require("child_process");
const net = require("net");
const config = require("./config.json");

const port = config.socket.port;

function isPortInUse(port, host = "localhost") {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close();
            resolve(false);
        });

        server.listen(port, host);
    });
}

isPortInUse(port).then((inUse) => {
    if (inUse) {
        return 0;
    } else {
        cp.spawn("py", ["./utils/huntbot/huntbotcaptcha.py"]);
    }
});

const socket = io(`http://localhost:${port}`);

socket.on("connect", () => {
    console.log("Hunt Bot Captcha sunucusuna bağlandım.");

    const captchaUrl =
        "https://cdn.discordapp.com/attachments/1267791683865673738/1311700675956179015/captcha.png?ex=6749cff3&is=67487e73&hm=87546f6269e04a7d0078327f86ece562b01e3e98cbfd5d2d4b755059e4b5fcc0&";
    socket.emit("captcha", captchaUrl);
});

socket.on("captcha_solution", (solution) => {
    console.log("Çözülen CAPTCHA:", solution);
});
