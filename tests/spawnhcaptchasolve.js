const cp = require("child_process");

for (let spawncount = 0; spawncount < 5; spawncount++) {
    try {
        cp.spawn("node", ["./hcaptchasolve.js"], { stdio: "inherit" });
    } catch (error) {
        console.error("Error spawning process:", error);
    }
}
