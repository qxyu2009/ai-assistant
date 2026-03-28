export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key is missing in Vercel settings.' });
    }

    try {
        const { message } = req.body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        // 增加安全检查：如果 Google 返回错误，把它吐出来
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ error: "Server crashed: " + error.message });
    }
}
