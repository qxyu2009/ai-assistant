export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_API_KEY; // 已经在 Vercel 设置好
    const { message } = req.body;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        // 核心：把 Gemini 的话精准提取出来
        const aiReply = data.candidates[0].content.parts[0].text;
        
        // 关键：以 'reply' 这个名字传回给前端
        res.status(200).json({ reply: aiReply }); 
    } catch (error) {
        res.status(500).json({ error: "API错误: " + error.message });
    }
}
