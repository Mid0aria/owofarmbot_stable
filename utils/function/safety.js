module.exports = async (client) => {
    let startTime = Date.now();
    let elapsedPausedTime = 0;
    let safetyInterval = client.config.settings.safety.afterminute * 60 * 1000;
    let pauseDuration = client.config.settings.safety.forminute * 60 * 1000;

    const updateSafetyTimer = () => {
        if (client.global.paused) startTime = null;
        else if (!startTime) startTime = Date.now();
    };

    const safetyCheck = () => {
        if (client.global.paused) return;

        elapsedPausedTime = Date.now() - startTime;

        if (elapsedPausedTime >= safetyInterval) {
            client.global.paused = true;
            client.logger.warn("Bot", "Safety", "Safety paused to reduce bot rate.");

            setTimeout(() => {
                client.global.paused = false;
                client.logger.warn("Bot", "Safety", "Resuming after a safety pause.");

                startTime = Date.now();
                elapsedPausedTime = 0;
            }, pauseDuration);
        }
    };

    setInterval(() => {
        updateSafetyTimer();
        safetyCheck();
    }, 1000);
};
