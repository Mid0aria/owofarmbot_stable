const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");

const lettersDir = path.join(__dirname, "letters");

module.exports = async (captchaUrl) => {
    const checks = [];
    const checkImages = getAllImagePaths(lettersDir);

    for (const checkImage of checkImages.sort()) {
        const img = sharp(checkImage);
        const { width, height } = await img.metadata();
        const letter = path.basename(checkImage, path.extname(checkImage));
        checks.push({ img, width, height, letter });
    }

    const { data } = await axios.get(captchaUrl, {
        responseType: "arraybuffer",
    });
    const largeImage = sharp(data);
    const { width, height } = await largeImage.metadata();

    return matchLetters(
        await largeImage.raw().toBuffer(),
        width,
        height,
        checks,
    );
};

function getAllImagePaths(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllImagePaths(fullPath));
        } else if (file.endsWith(".png")) {
            results.push(fullPath);
        }
    }
    return results;
}

async function matchLetters(largeData, largeW, largeH, checks) {
    const matches = [];

    for (const { img, width: smallW, height: smallH, letter } of checks) {
        const smallData = await img.raw().toBuffer();

        for (let y = 0; y <= largeH - smallH; y++) {
            for (let x = 0; x <= largeW - smallW; x++) {
                if (
                    compareImages(
                        largeData,
                        largeW,
                        smallData,
                        smallW,
                        smallH,
                        x,
                        y,
                    )
                ) {
                    if (
                        !matches.some(
                            (m) =>
                                Math.abs(m.x - x) < smallW &&
                                Math.abs(m.y - y) < smallH,
                        )
                    ) {
                        matches.push({ x, y, letter });
                    }
                }
            }
        }
    }

    matches.sort((a, b) => a.x - b.x);
    return matches.map((m) => m.letter).join("");
}

function compareImages(
    largeData,
    largeW,
    smallData,
    smallW,
    smallH,
    startX,
    startY,
) {
    for (let y = 0; y < smallH; y++) {
        for (let x = 0; x < smallW; x++) {
            const largeIdx = ((startY + y) * largeW + (startX + x)) * 4;
            const smallIdx = (y * smallW + x) * 4;

            if (
                smallData[smallIdx + 3] > 0 &&
                (smallData[smallIdx] !== largeData[largeIdx] ||
                    smallData[smallIdx + 1] !== largeData[largeIdx + 1] ||
                    smallData[smallIdx + 2] !== largeData[largeIdx + 2])
            ) {
                return false;
            }
        }
    }
    return true;
}
