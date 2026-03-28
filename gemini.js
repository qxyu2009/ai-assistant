export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { contents } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // 这里的变量名保持原样，去 Vercel 网页上填真实的 Key

  // Google Gemini API 的官方端点 (使用 Flash 模型，速度最快，适合语音交互)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // 系统预设：强制 AI 维持 Apple 高级感和双语输出
  const systemInstruction = {
    role: "user",
    parts: [{ 
      text: "System Instruction: You are the 'AI Journey Assistant'. " +
            "Your personality: Sophisticated, helpful, and minimalist. " +
            "Strict Requirement: You MUST respond in this format: [English Response] --- [Chinese Translation]. " +
            "Example: Hello! How can I help you today? --- 你好！今天有什么可以帮你的吗？"
    }]
  };

  const payload = {
    contents: [
      systemInstruction,
      ...contents // 这里包含前端传过来的用户话语
    ],
    generationConfig: {
      temperature: 0.7, // 保持一定的创造力
      maxOutputTokens: 500
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    
    // 提取 AI 生成的文本内容
    const aiReply = data.candidates[0].content.parts[0].text;
    
    // 返回给前端
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}