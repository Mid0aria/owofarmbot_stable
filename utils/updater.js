const path = require("path");
const axios = require("axios");
const os = require("os");
const fse = require("fs-extra");
const readline = require("readline");

exports.checkUpdate = async (client, cp, packageJson) => {
    client.logger.info("Bot", "Updater", "Checking for updates...");
    try {
        // İlerleme göstergesi başlat
        const progressBar = new ProgressBar();
        progressBar.start("Checking", 3);

        progressBar.update("Receiving remote version information", 1);
        const ghData = await fetchLatestVersion();

        progressBar.update("Comparing versions", 2);
        const currentVersion = packageJson.version;

        // Updater'ın kendisini kontrol et
        await checkUpdaterSelfUpdate(client, cp);

        if (!isNewerVersion(ghData, currentVersion)) {
            progressBar.end("No update");
            client.logger.info("Bot", "Updater", "No updates available.");
            return;
        }

        progressBar.update("Preparing Changelog", 3);
        const changelog = await fetchChangelog(ghData.version);
        progressBar.end("Update found");

        await handleUpdate(client, cp, ghData, changelog);
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
            { headers, timeout: 10000 },
        );
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch version: ${error.message}`);
    }
};

const fetchChangelog = async (version) => {
    try {
        const changelogResponse = await axios.get(
            "https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/CHANGELOG.md",
            { timeout: 8000 },
        );

        if (changelogResponse.status === 200) {
            const changelogContent = changelogResponse.data;
            const versionRegex = new RegExp(
                `## \\[${version}\\](.*?)(?=## \\[|$)`,
                "s",
            );
            const match = changelogContent.match(versionRegex);

            if (match && match[0]) {
                return match[0].trim();
            }
        }

        const releaseResponse = await axios.get(
            `https://api.github.com/repos/Mid0aria/owofarmbot_stable/releases/tags/v${version}`,
            { timeout: 8000 },
        );

        if (releaseResponse.status === 200 && releaseResponse.data.body) {
            return `## [${version}]\n\n${releaseResponse.data.body}`;
        }

        return `## [${version}]\n\nNo detailed changelog available.`;
    } catch (error) {
        return `## [${version}]\n\nCouldn't fetch changelog: ${error.message}`;
    }
};

const isNewerVersion = (ghData, currentVersion) => {
    const ghVersion = ghData.version || "0.0.0";

    const ghParts = ghVersion.split(".").map(Number);
    const currentParts = currentVersion.split(".").map(Number);

    for (let i = 0; i < Math.max(ghParts.length, currentParts.length); i++) {
        const ghPart = ghParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (ghPart > currentPart) return true;
        if (ghPart < currentPart) return false;
    }

    return false;
};

const handleUpdate = async (client, cp, ghData, changelog) => {
    client.logger.warn("Bot", "Updater", "A new update is available.");
    client.logger.info(
        "Bot",
        "Updater",
        `New Version: ${ghData.version} - Notes: ${ghData.version_note || "No notes available"}`,
    );

    // Changelog göster
    displayChangelog(changelog);

    const userResponse = await client.globalutil.askUser(
        "Would you like to update now? (yes/no): ",
    );
    if (!["yes", "y"].includes(userResponse.toLowerCase())) {
        client.logger.info("Bot", "Updater", "Update skipped by user.");
        return;
    }

    client.logger.warn("Bot", "Updater", "Updating bot. Please wait...");

    const configPath = path.join(__dirname, "../config.json");

    // İlerleme göstergesi ile güncelleme
    const progressBar = new ProgressBar();
    progressBar.start("Update", 5);

    try {
        progressBar.update("Backing up the config", 1);
        const backupPath = await backupConfig(client, configPath);

        progressBar.update("Downloading update", 2);
        if (fse.existsSync(path.join(__dirname, "../.git"))) {
            await updateViaGit(client, cp, progressBar);
        } else {
            await setupAndUpdateGit(client, cp, progressBar);
        }

        progressBar.update("Merge config", 3);
        await mergeConfigs(client, configPath, backupPath);

        progressBar.update("Verify update", 4);
        const verificationResult = await verifyUpdate(
            client,
            cp,
            ghData.version,
        );

        if (!verificationResult.success) {
            throw new Error(
                `Update verification failed: ${verificationResult.message}`,
            );
        }

        progressBar.update("Completing", 5);
        progressBar.end("Update successful!");

        client.logger.warn("Bot", "Updater", "Please restart the bot.");
        process.exit(0);
    } catch (error) {
        progressBar.end(`Hata: ${error.message}`);
        throw error;
    }
};

// Changelog gösterme fonksiyonu
const displayChangelog = (changelog) => {
    console.log("\n=================== CHANGELOG ===================");
    console.log(changelog);
    console.log("================================================\n");
};

const updateWithConfigPreservation = async (client, cp, configPath) => {
    const backupPath = await backupConfig(client, configPath);

    try {
        if (fse.existsSync(path.join(__dirname, "../.git"))) {
            await updateViaGit(client, cp);
        } else {
            await setupAndUpdateGit(client, cp);
        }

        await mergeConfigs(client, configPath, backupPath);

        // Güncelleme doğrulama
        await verifyUpdate(client, cp);
    } catch (error) {
        await handleUpdateError(client, error, backupPath, configPath);
        throw error;
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
        client.logger.info("Bot", "Updater", `Backup created at ${backupPath}`);
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
            "Bot",
            "Updater",
            "Configuration successfully merged",
        );
    } catch (error) {
        throw new Error(`Config merge failed: ${error.message}`);
    }
};

const deepMerge = (target, source) => {
    // Eğer hedef veya kaynak obje değilse, source'u döndür
    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    // Yeni bir obje oluştur ve hedef objenin tüm özelliklerini kopyala
    const result = { ...target };

    // Kaynak objeden gelen her özelliği işle
    Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
            // Hedefte bu key için bir değer var mı?
            if (result[key] === undefined) {
                // Yoksa, doğrudan kopyala
                result[key] = source[key];
            } else if (isObject(result[key])) {
                // Varsa ve nesne ise, recursive olarak birleştir
                result[key] = deepMerge(result[key], source[key]);
            } else {
                // Varsa ama nesne değilse, kaynak değerini kullan (kullanıcının değerini koru)
                result[key] = source[key];
            }
        } else if (result[key] === undefined) {
            // Eğer hedefte olmayan bir özellik ise ekle
            result[key] = source[key];
        }
        // Eğer hedefte zaten varsa, kullanıcının değeri korunuyor (hiçbir şey yapma)
    });

    return result;
};

const isObject = (item) => {
    return item !== null && typeof item === "object" && !Array.isArray(item);
};

const updateViaGit = async (client, cp, progressBar = null) => {
    try {
        // Değişiklikleri stash'e kaydet
        if (progressBar) progressBar.update("Git stash", 2.1);
        cp.execSync("git stash", { stdio: "pipe" });

        // Güncellemeleri çek
        if (progressBar) progressBar.update("Git fetch", 2.2);
        cp.execSync("git fetch --all", { stdio: "pipe" });

        if (progressBar) progressBar.update("Git reset", 2.3);
        cp.execSync("git reset --hard origin/main", { stdio: "pipe" });

        // Submodule'leri güncelle
        if (progressBar) progressBar.update("Updating submodules", 2.4);
        await updateSubmodules(client, cp);

        // Bağımlılıkları güncelle
        if (progressBar) progressBar.update("Updating Dependencies", 2.5);
        await updateDependencies(client, cp);

        client.logger.info("Bot", "Updater", "Update successful");
    } catch (error) {
        throw new Error(`Git update failed: ${error.message}`);
    }
};

const updateSubmodules = async (client, cp) => {
    try {
        // Submodule'lerin varlığını kontrol et
        const hasSubmodules = fse.existsSync(
            path.join(__dirname, "../.gitmodules"),
        );

        if (hasSubmodules) {
            client.logger.info("Bot", "Updater", "Updating submodules...");
            // Submodule'leri başlat
            cp.execSync("git submodule init", { stdio: "pipe" });
            // Submodule'leri güncelle
            cp.execSync("git submodule update --recursive --remote", {
                stdio: "pipe",
            });
            client.logger.info(
                "Bot",
                "Updater",
                "Submodules updated successfully",
            );
        } else {
            client.logger.info("Bot", "Updater", "No submodules found");
        }
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Submodule update failed: ${error.message}`,
        );
        // Submodule hatası kritik değil, devam et
    }
};

const updateDependencies = async (client, cp) => {
    try {
        // package.json değişti mi kontrol et
        const hasPackageChanged =
            cp
                .execSync(
                    "git diff-tree -r --name-only HEAD@{1} HEAD | grep package.json",
                    {
                        stdio: "pipe",
                        encoding: "utf-8",
                    },
                )
                .toString()
                .trim().length > 0;

        if (hasPackageChanged) {
            client.logger.info("Bot", "Updater", "Installing dependencies...");
            cp.execSync("npm install", { stdio: "pipe" });
            client.logger.info(
                "Bot",
                "Updater",
                "Dependencies installed successfully",
            );
        }
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Dependency update failed: ${error.message}`,
        );
        // Bağımlılık hatası kritik değil, devam et
    }
};

const setupAndUpdateGit = async (client, cp, progressBar = null) => {
    const repoUrl = "https://github.com/Mid0aria/owofarmbot_stable.git";
    const baseDir = path.join(__dirname, "..");

    try {
        // Git olmayan bir dizinde init yapmak daha güvenli
        if (progressBar) progressBar.update("Git init", 2.1);
        cp.execSync(`git init`, { cwd: baseDir, stdio: "pipe" });

        if (progressBar) progressBar.update("Adding Git remote", 2.2);
        cp.execSync(`git remote add origin ${repoUrl}`, {
            cwd: baseDir,
            stdio: "pipe",
        });

        if (progressBar) progressBar.update("Git fetch", 2.3);
        cp.execSync(`git fetch`, { cwd: baseDir, stdio: "pipe" });

        if (progressBar) progressBar.update("Git checkout", 2.4);
        cp.execSync(`git checkout -f main`, { cwd: baseDir, stdio: "pipe" });

        // Submodule'leri güncelle
        if (progressBar) progressBar.update("Updating submodules", 2.5);
        await updateSubmodules(client, cp);

        // Bağımlılıkları kur
        if (progressBar) progressBar.update("Updating Dependencies", 2.6);
        await updateDependencies(client, cp);

        client.logger.info(
            "Bot",
            "Updater",
            "Git setup and initial update successful",
        );
    } catch (error) {
        throw new Error(`Git setup failed: ${error.message}`);
    }
};

// Güncelleme doğrulama fonksiyonu
const verifyUpdate = async (client, cp, expectedVersion) => {
    try {
        // 1. Paket.json dosyasının varlığını kontrol et
        const packageJsonPath = path.join(__dirname, "../package.json");
        if (!fse.existsSync(packageJsonPath)) {
            return { success: false, message: "package.json not found" };
        }

        // 2. Versiyon kontrolü
        if (expectedVersion) {
            const packageJson = await fse.readJson(packageJsonPath);
            if (packageJson.version !== expectedVersion) {
                return {
                    success: false,
                    message: `Version mismatch: expected ${expectedVersion}, got ${packageJson.version}`,
                };
            }
        }

        // 4. Yapılandırma dosyasını kontrol et
        const configPath = path.join(__dirname, "../config.json");
        if (!fse.existsSync(configPath)) {
            return { success: false, message: "config.json not found" };
        }

        try {
            // Yapılandırma dosyasının geçerli JSON olduğunu kontrol et
            await fse.readJson(configPath);
        } catch (error) {
            return {
                success: false,
                message: `Config file is invalid: ${error.message}`,
            };
        }

        // Her şey yolunda
        client.logger.info("Bot", "Updater", "Update verification successful");
        return { success: true, message: "All checks passed" };
    } catch (error) {
        return {
            success: false,
            message: `Verification failed: ${error.message}`,
        };
    }
};

const handleUpdateError = async (client, error, backupPath, configPath) => {
    client.logger.alert("Bot", "Updater", `Update failed: ${error.message}`);

    try {
        if (backupPath && fse.existsSync(backupPath)) {
            await fse.copy(backupPath, configPath, { overwrite: true });
            client.logger.info("Bot", "Updater", "Config restored from backup");
        }
    } catch (restoreError) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Config restore failed: ${restoreError.message}`,
        );
    }
};

// Self-update mekanizması
const checkUpdaterSelfUpdate = async (client, cp) => {
    try {
        // Updater için uzak versiyon kontrolü
        const updaterResponse = await axios
            .get(
                "https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/main/package.json",
                { timeout: 5000 },
            )
            .catch(() => ({ data: { updater_version: UPDATER_VERSION } }));

        const remoteVersion =
            updaterResponse.data.updater_version || UPDATER_VERSION;

        // Versiyon kontrolü
        if (!isNewerVersion({ version: remoteVersion }, UPDATER_VERSION)) {
            return; // Güncelleme yok
        }

        client.logger.warn("Bot", "Updater", "Updater self-update available");

        const userResponse = await client.globalutil.askUser(
            "Updater itself has an update. Would you like to update the updater first? (yes/no): ",
        );

        if (!["yes", "y"].includes(userResponse.toLowerCase())) {
            client.logger.info(
                "Bot",
                "Updater",
                "Updater self-update skipped by user.",
            );
            return;
        }

        client.logger.warn(
            "Bot",
            "Updater",
            "Updating updater. Please wait...",
        );

        // Updater dosyasını yedekle
        const updaterPath = __filename;
        const updaterBackupPath = `${updaterPath}.backup.${Date.now()}.js`;
        await fse.copy(updaterPath, updaterBackupPath);

        // Yeni updater'ı indir
        const newUpdaterResponse = await axios.get(
            "https://raw.githubusercontent.com/Mid0aria/owofarmbot_stable/refs/heads/main/utils/updater.js",
            { timeout: 8000 },
        );

        // Updater'ı güncelle
        await fse.writeFile(updaterPath, newUpdaterResponse.data);

        client.logger.info("Bot", "Updater", "Updater self-update successful");
        client.logger.warn(
            "Bot",
            "Updater",
            "Please restart the bot to use the updated updater.",
        );
        process.exit(0);
    } catch (error) {
        client.logger.alert(
            "Bot",
            "Updater",
            `Updater self-update failed: ${error.message}`,
        );
        // Self-update hatası kritik değil, normal güncellemeye devam et
    }
};

// İlerleme göstergesi sınıfı
class ProgressBar {
    constructor() {
        this.progress = 0;
        this.total = 100;
        this.barLength = 30;
        this.title = "";
        this.spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        this.spinnerIndex = 0;
        this.intervalId = null;
    }

    start(title, total = 100) {
        this.title = title;
        this.total = total;
        this.progress = 0;
        this.spinnerIndex = 0;
        this.render();

        this.intervalId = setInterval(() => {
            this.spinnerIndex = (this.spinnerIndex + 1) % this.spinner.length;
            this.render();
        }, 100);

        return this;
    }

    update(title, progress) {
        this.title = title;
        this.progress = progress;
        this.render();
        return this;
    }

    end(message) {
        clearInterval(this.intervalId);
        this.progress = this.total;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`✅ ${message}\n`);
        return this;
    }

    render() {
        const percent = Math.round((this.progress / this.total) * 100);
        const filledLength = Math.round(
            (this.progress / this.total) * this.barLength,
        );
        const emptyLength = this.barLength - filledLength;

        const filledBar = "█".repeat(filledLength);
        const emptyBar = "░".repeat(emptyLength);

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        process.stdout.write(
            `${this.spinner[this.spinnerIndex]} ${this.title} [${filledBar}${emptyBar}] ${percent}%`,
        );
    }
}
