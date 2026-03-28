async function askAI(message) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("AI 没反应:", error);
        return "连接大脑失败...";
    }
}
window.onload = () => { console.log("AI Ready!"); };