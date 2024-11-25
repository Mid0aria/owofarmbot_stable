/**
 * This file is an example of a socket for huntbot
 * You can solve the huntbot captcha by communicating between this code and python code
 * You can change the port via socket.port in config.json (I think the current port is ideal)
 * When Huntbot is added, don't forget to add the code to start utils/huntbot/huntbotcaptcha.py in the background with childprocess
 *
 */

const io = require("socket.io-client");
const config = require("./config.json");
const socket = io(`http://localhost:${config.socket.port}`); // connect to the Python server

socket.on("connect", () => {
    console.log("I connected to the Hunt Bot Captcha server");

    // Send the CAPTCHA URL to the Python server
    const captchaUrl =
        "https://cdn.discordapp.com/attachments/1309535845925261323/1310672570651250738/captcha.png?ex=67461273&is=6744c0f3&hm=1478ec27f1d44e1c0cfbb769722f72a4a54c61414a8d12dfc9294d742be2117c&"; // Buraya gerçek CAPTCHA URL'nizi koyun
    socket.emit("captcha", captchaUrl);
});

// When CAPTCHA solution is received
socket.on("captcha_solution", (solution) => {
    console.log("Solved CAPTCHA:", solution);
});
