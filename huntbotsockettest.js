/**
 * This file is an example of a socket for huntbot
 * You can solve the huntbot captcha by communicating between this code and python code
 * You can change the port via socket.port in config.json (I think the current port is ideal)
 * When Huntbot is added, don't forget to add the code to start utils/huntbot/huntbotcaptcha.py in the background with childprocess
 *
 */

const io = require("socket.io-client");
const cp = require("child_process");
const config = require("./config.json");
const socket = io(`http://localhost:${config.socket.port}`); // connect to the Python server

cp.spawn("py", ["./utils/huntbot/huntbotcaptcha.py"]); // spawn huntbotcaptcha.py in headless mode

socket.on("connect", () => {
    console.log("I connected to the Hunt Bot Captcha server");

    // Send the CAPTCHA URL to the Python server
    const captchaUrl =
        "https://cdn.discordapp.com/attachments/1267791683865673738/1311700675956179015/captcha.png?ex=6749cff3&is=67487e73&hm=87546f6269e04a7d0078327f86ece562b01e3e98cbfd5d2d4b755059e4b5fcc0&"; // Buraya gerçek CAPTCHA URL'nizi koyun
    socket.emit("captcha", captchaUrl);
});

// When CAPTCHA solution is received
socket.on("captcha_solution", (solution) => {
    console.log("Solved CAPTCHA:", solution);
});
