export default async function handler(req, res) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    if (!API_KEY) {
        return res.status(500).json({ reply: "后端配置错误：缺少 API Key" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        // --- 核心修复：极其稳健的提取逻辑 ---
        if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply: aiReply });
        } else {
            // 如果 API 返回了错误信息（比如地区限制），把它打印出来
            console.error("API 异常返回:", JSON.stringify(data));
            const errorMsg = data.error?.message || "Gemini 拒绝了回答，请检查 Key 的权限。";
            res.status(200).json({ reply: `[AI 暂时无法回答]：${errorMsg}` });
        }
    } catch (error) {
        console.error("代码运行错误:", error);
        res.status(500).json({ reply: "服务器内部错误，请稍后再试。" });
    }
}
