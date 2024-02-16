const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "sim",
  version: "1.0.0",
  role: 0,
  credits: "Liane", //don't change
  description: "Simulate a conversation with a virtual assistant",
  commandCategory: "Chatbot",
  usages: "/sim [message]",
  cooldown: 5,
  hasPrefix: false,
};

module.exports.run = async ({ api, event, args }) => {
  let simResponse = "";
  if (args[0] === "teach") {
    const [word, ...teached] = args
      .slice(1)
      .join(" ")
      .split("=>")
      .map((item) => item.trim());
    if (!word || !teached) {
      return api.sendMessage("enter valid word", event.threadID);
    }
    const wordList = fs.readFileSync(__dirname + "/sim.json", "utf8");
    const wordObject = JSON.parse(wordList);
    fs.writeFileSync(
      __dirname + "/sim.json",
      JSON.stringify({
        ...wordObject,
        [word]: teached.join(" "),
      })
    );
    api.sendMessage(`Success`, event.threadID);
    return;
  }
  const prompt = args.join(" ");
  if (!fs.existsSync(__dirname + "/sim.json")) {
    fs.writeFileSync(__dirname + "/sim.json", JSON.stringify({}));
  }
  const jsonData = JSON.parse(fs.readFileSync(__dirname + "/sim.json", "utf8"));
  if (!prompt) {
    api.sendMessage(
      `Please enter your message for simi simi or teach`,
      event.threadID,
      event.messageID
    );
    return;
  }
  const tokens = prompt.split(" ").map((word) => word.trim());
  let counter = {};
  tokens.forEach((word, index) => {
    Object.keys(jsonData).forEach((token2) => {
      if (token2.includes(word)) {
        if (!counter[word]) {
          counter[word + "@@" + jsonData[token2]] = 1;
        } else {
          counter[word + "@@" + jsonData[token2]]++;
        }
      }
    });
  });
  const highestMatch =
    Object.keys(counter).length > 0
      ? Object.keys(counter).reduce((a, b) => (counter[a] > counter[b] ? a : b))
      : null;
  if (highestMatch) {
    simResponse = highestMatch.split("@@")[1];
  } else {
    const apiResponse = await axios.get(
      `https://simsimi.fun/api/v2/?mode=talk&lang=en&filter=true&message=${encodeURIComponent(
        prompt
      )}`
    );
    simResponse = apiResponse.data.success;
    fs.writeFileSync(
      __dirname + "/sim.json",
      JSON.stringify({
        ...jsonData,
        [prompt]: simResponse,
      })
    );
  }
  api.sendMessage(simResponse.toString(), event.threadID, event.messageID);
};
