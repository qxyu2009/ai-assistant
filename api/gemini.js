export default async function handler(req, res) {
    // 1. 获取环境变量中的 Key
    const API_KEY = process.env.GEMINI_API_KEY;
    
    // 2. 检查请求方法
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "只支持 POST 请求哦" });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ reply: "你还没说话呢..." });
    }

    try {
        // 3. 使用 v1 正式版接口和最新的模型名称
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        // 4. 更加稳健的数据提取逻辑
        if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            res.status(200).json({ reply: aiReply });
        } else if (data.error) {
            // 如果 Google 返回了具体的错误（比如地区、Key失效）
            console.error("Google API Error:", data.error.message);
            res.status(200).json({ reply: `[API报错]：${data.error.message}` });
        } else {
            res.status(200).json({ reply: "AI 思考了一下，但没有给出回复，请稍后再试。" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "服务器开小差了：" + error.message });
    }
}
