const data = await response.json();
addMessage(data.reply); // 这里的 data.reply 才是 AI 真正说的话
