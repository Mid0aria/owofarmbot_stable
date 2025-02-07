const path = require("path");
const axios = require("axios");
const os = require("os");
const fse = require("fs-extra");

exports.checkUpdate = async (client, cp, packageJson) => {
    client.logger.info("Bot", "Updater", "Checking for updates...");
    try {
        const ghVersion = await fetchLatestVersion();
        const currentVersion = packageJson.version;

        if (!isNewerVersion(ghVersion, currentVersion)) {
            client.logger.info("Bot", "Updater", "No updates available.");
            return;
        }

        await handleUpdate(client, cp, ghVersion);
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Update check failed: ${error.message}`,
        );
    }
};

const fetchLatestVersion = async () => {
    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };

    try {
        const response = await axios.get(
            "https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/package.json",
            { headers },
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch version: ${error.message}`);
    }
};

const isNewerVersion = (ghData, currentVersion) => {
    if (ghData.version > currentVersion) {
        return true;
    }
    return false;
};

const handleUpdate = async (client, cp, ghData) => {
    client.logger.warn("Bot", "Updater", "A new update is available.");
    client.logger.info(
        "Bot",
        "Updater",
        `New Version Notes: ${ghData.version_note}`,
    );

    const userResponse = await client.globalutil.askUser(
        "Would you like to update now? (yes/no): ",
    );
    if (!["yes", "y"].includes(userResponse.toLowerCase())) {
        client.logger.info("Bot", "Updater", "Update skipped by user.");
        return;
    }

    client.logger.warn("Bot", "Updater", "Updating bot. Please wait...");

    const configPath = path.join(__dirname, "../config.json");
    await updateWithConfigPreservation(client, cp, configPath);

    client.logger.warn("Bot", "Updater", "Please restart the bot.");
};

const updateWithConfigPreservation = async (client, cp, configPath) => {
    const backupPath = await backupConfig(client, configPath);

    try {
        if (fse.existsSync(".git")) {
            await updateViaGit(client, cp);
        } else {
            await setupAndUpdateGit(client, cp);
        }

        await mergeConfigs(client, configPath, backupPath);
    } catch (error) {
        await handleUpdateError(client, error, backupPath, configPath);
    }
};

const backupConfig = async (client, configPath) => {
    const tempDir = os.tmpdir();
    const backupPath = path.join(tempDir, `config.backup.${Date.now()}.json`);

    try {
        if (!fse.existsSync(configPath)) {
            throw new Error("Config file not found");
        }

        await fse.copy(configPath, backupPath);
        client.logger.info(
            "Updater",
            "Config",
            `Backup created at ${backupPath}`,
        );
        return backupPath;
    } catch (error) {
        throw new Error(`Backup failed: ${error.message}`);
    }
};

const mergeConfigs = async (client, configPath, backupPath) => {
    try {
        const oldConfig = await fse.readJson(backupPath);
        const newConfig = await fse.readJson(configPath);

        const mergedConfig = deepMerge(newConfig, oldConfig);

        await fse.writeJson(configPath, mergedConfig, { spaces: 2 });
        await fse.remove(backupPath);

        client.logger.info(
            "Updater",
            "Config",
            "Configuration successfully merged",
        );
    } catch (error) {
        throw new Error(`Config merge failed: ${error.message}`);
    }
};

const deepMerge = (target, source) => {
    const merged = { ...target };

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key]) && isObject(target[key])) {
                merged[key] = deepMerge(target[key], source[key]);
            } else if (Object.prototype.hasOwnProperty.call(target, key)) {
                merged[key] = source[key];
            }
        }
    }

    return merged;
};

const isObject = (item) => {
    return item !== null && typeof item === "object" && !Array.isArray(item);
};

const updateViaGit = async (client, cp) => {
    try {
        cp.execSync("git stash");
        cp.execSync("git pull --force");
        cp.execSync("git reset --hard");
        client.logger.info("Updater", "Git", "Update successful");
        process.exit(0);
    } catch (error) {
        throw new Error(`Git update failed: ${error.message}`);
    }
};

const setupAndUpdateGit = async (client, cp) => {
    const repoUrl = "https://github.com/Mid0aria/owofarmbot_stable.git";
    const targetFolder = path.join(__dirname, "../.git");

    try {
        await fse.ensureDir(targetFolder);
        cp.execSync(`git clone --bare ${repoUrl} ${targetFolder}`, {
            stdio: "inherit",
        });
        await updateViaGit(client, cp);
    } catch (error) {
        throw new Error(`Git setup failed: ${error.message}`);
    }
};

const handleUpdateError = async (client, error, backupPath, configPath) => {
    client.logger.alert("Updater", "Error", `Update failed: ${error.message}`);

    try {
        if (backupPath && fse.existsSync(backupPath)) {
            await fse.copy(backupPath, configPath, { overwrite: true });
            client.logger.info(
                "Updater",
                "Recovery",
                "Config restored from backup",
            );
        }
    } catch (restoreError) {
        client.logger.alert(
            "Updater",
            "Recovery",
            `Config restore failed: ${restoreError.message}`,
        );
    }
};
