const express = require('express');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

app.post('/api/capture-url', async (req, res) => {
    const { url } = req.body;

    if (!url || !/^https?:\/\/\w+/.test(url)) {
        return res.status(400).json({ error: 'A valid URL is required' });
    }

    try {
        const screenshotPath = await captureScreenshot(url);
        res.json({ screenshotUrl: `/screenshots/${path.basename(screenshotPath)}` });
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    }
});

async function captureScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the viewport dimensions to desktop width and a specific height
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(url, { waitUntil: 'networkidle2' });

    const filename = `${uuidv4()}.png`;
    const screenshotPath = path.join(__dirname, 'screenshots', filename);

    // Capture only the viewport area with specified dimensions
    await page.screenshot({
        path: screenshotPath,
        clip: { x: 0, y: 0, width: 1280, height: 720 } // Defines the exact area to capture
    });

    await browser.close();

    setTimeout(() => {
        fs.unlink(screenshotPath, (err) => {
            if (err) console.error(`Error deleting screenshot ${screenshotPath}:`, err);
            else console.log(`Deleted screenshot: ${screenshotPath}`);
        });
    }, 5 * 60 * 1000); // 5 minutes

    return screenshotPath;
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
