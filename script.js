// ...之前的发送代码
const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput })
});

const data = await response.json();

// 核心：这里必须用 data.reply，因为它对应后端传回来的 Key
if (data.reply) {
    addMessage(data.reply); 
} else {
    addMessage("抱歉，我好像断片了。");
}
