export default async function handler(req, res) {
    // 1. 检查 API Key
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "Missing API Key" });

    try {
        const { message } = req.body;
        // 2. 使用最快的 1.5-flash 模型，减少超时概率
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        // 3. 这里的提取路径必须非常精准
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply: aiReply });
        } else {
            res.status(500).json({ error: "Gemini returned empty response" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
