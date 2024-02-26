const axios = require("axios");
module.exports.config = {
  name: "ai",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ["gpt", "openai", "chatgpt"],
  description: "An AI command powered by GPT-4",
  usage: "Ai [promot]",
  credits: "Developer",
  cooldown: 10,
};
module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ");
  if (!input) {
    api.sendMessage(
      `Please provide a question or statement after 'ai'. For example: 'ai What is the capital of France?'`,
      event.threadID,
      event.messageID
    );
    return;
  }
  api.sendMessage(
    `🔍 Answering your question...`,
    event.threadID,
    event.messageID
  );
  // api.sendMessage(`🔍 "${input}"`, event.threadID, event.messageID);
  try {
    const { data } = await axios.get(
      `https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(
        input
      )}`
      // `https://openaikey.onrender.com/api?prompt=${encodeURIComponent(input)}`
    );
    const response = data.response;
    // const response = data.response;
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(
      "An error occurred while processing your request.",
      event.threadID,
      event.messageID
    );
  }
};
