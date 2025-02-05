module.exports = async (client) => {
    let startTime = Date.now();
    let safetyInterval = client.config.settings.safety.pauseafter * 60 * 1000;
    let pauseDuration = client.config.settings.safety.pausefor * 60 * 1000;
    let interval = null;

    const startSafetyCheck = () => {
        if (interval) return; // Prevent multiple intervals
        interval = setInterval(() => {
            let now = Date.now();
            if (!client.global.paused && now - startTime >= safetyInterval) {
                client.global.paused = true;
                client.logger.warn(
                    "Bot",
                    "Safety",
                    "Safety paused to reduce bot rate.",
                );

                clearInterval(interval);
                interval = null;

                setTimeout(() => {
                    if (!client.global.captchadetected) {
                        client.global.paused = false;
                        client.logger.warn(
                            "Bot",
                            "Safety",
                            "Resuming after a safety pause.",
                        );
                    }
                    startTime = Date.now();
                    startSafetyCheck();
                }, pauseDuration);
            }
        }, 1000);
    };

    startSafetyCheck();
};
