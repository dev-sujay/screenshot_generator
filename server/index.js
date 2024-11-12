const express = require('express');
const cors = require('cors');
const { generateScreenshot } = require('screenshot-generator');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());

app.post('/api/capture-url', async (req, res) => {
    const { url } = req.body;
    const destination = "./screenshots"

    if (!url || !/^https?:\/\/\w+/.test(url)) {
        return res.status(400).json({ error: 'A valid URL is required' });
    }

    try {
        const screenshotPath = await generateScreenshot(url, destination);
        res.json({ screenshotPath });
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
