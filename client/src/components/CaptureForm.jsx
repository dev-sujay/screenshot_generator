import { useState } from 'react';

const CaptureForm = () => {
    const [url, setUrl] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5500/api/capture-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        setScreenshotUrl(data.screenshotUrl);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    required
                />
                <button type="submit">Capture Screenshot</button>
            </form>
            {screenshotUrl && <img src={screenshotUrl} alt="Screenshot" />}
        </div>
    );
}

export default CaptureForm