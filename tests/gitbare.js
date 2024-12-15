const { execSync } = require("child_process");
const path = require("path");
const fse = require("fs-extra");

const downloaddotgit = async (client, cp) => {
    const repoUrl = "https://github.com/Mid0aria/owofarmbot_stable.git";
    const targetFolder = path.join(__dirname, "../.git");

    if (!fse.existsSync(targetFolder)) {
        fse.mkdirSync(targetFolder, { recursive: true });
    }
    const cloneCommand = `git clone --bare ${repoUrl} ${targetFolder}`;

    cp.execSync(cloneCommand, { stdio: "inherit" });
    // await gitUpdate(client, cp);
};

await downloaddotgit();
