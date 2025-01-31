const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

const scriptDir = __dirname;
const lettersDir = path.join(scriptDir, "letters");

module.exports = async (captchaUrl) => {
    const checks = [];
    const checkImages = getAllImagePaths(lettersDir);

    for (const checkImage of checkImages.sort()) {
        const img = await loadImage(checkImage);
        const letter = path.basename(checkImage, path.extname(checkImage));
        checks.push({ img, width: img.width, height: img.height, letter });
    }

    const { data } = await axios.get(captchaUrl, {
        responseType: "arraybuffer",
    });
    const largeImage = await loadImage(Buffer.from(data));

    return matchLetters(largeImage, checks);
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

function matchLetters(largeImage, checks) {
    const matches = [];

    for (const { img, width: smallW, height: smallH, letter } of checks) {
        for (let y = 0; y <= largeImage.height - smallH; y++) {
            for (let x = 0; x <= largeImage.width - smallW; x++) {
                if (compareImages(largeImage, img, x, y)) {
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
    const result = matches.map((m) => m.letter).join("");

    return result;
}

function compareImages(largeImg, smallImg, startX, startY) {
    const largeCanvas = createCanvas(largeImg.width, largeImg.height);
    const largeCtx = largeCanvas.getContext("2d");
    largeCtx.drawImage(largeImg, 0, 0);

    const smallCanvas = createCanvas(smallImg.width, smallImg.height);
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.drawImage(smallImg, 0, 0);

    const largeData = largeCtx.getImageData(
        startX,
        startY,
        smallImg.width,
        smallImg.height,
    ).data;
    const smallData = smallCtx.getImageData(
        0,
        0,
        smallImg.width,
        smallImg.height,
    ).data;

    for (let i = 0; i < smallData.length; i += 4) {
        if (
            smallData[i + 3] > 0 &&
            (smallData[i] !== largeData[i] ||
                smallData[i + 1] !== largeData[i + 1] ||
                smallData[i + 2] !== largeData[i + 2])
        ) {
            return false;
        }
    }
    return true;
}
