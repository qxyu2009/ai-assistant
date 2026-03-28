console.log("AI 助手加载成功");
async function askAI(text) {
    const res = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify({message: text}) });
    return (await res.json()).reply;
}
