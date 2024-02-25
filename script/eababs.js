const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "eababs",
  version: "1.0",
  role: 0,
  credits: "Your Name",
  description: "📹 Fetch a video from Eabab",
  commandCategory: "fun",
  hasPrefix: true,
  usages: "[eababs]",
  cooldown: 10,
};

module.exports.run = async function({ api, event }) {
  try {
    api.sendMessage("🎥 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 𝗘𝗮𝗯𝗮𝗯𝘀...", event.threadID);

    const response = await axios.get("https://hiro-api.replit.app/video/eabab");

    if (response.data.success === "Eabab video API!") {
      const videoInfo = response.data;
      const title = videoInfo.title;
      const username = videoInfo.username;
      const displayname = videoInfo.displayname;
      const videoLink = videoInfo.link;
      const filePath = __dirname + "/cache/eababs.mp4";

      const fileStream = fs.createWriteStream(filePath);
      const videoStream = await axios.get(videoLink, {
        responseType: "stream",
      });

      videoStream.data.pipe(fileStream);

      fileStream.on("finish", async () => {
        await api.sendMessage(
          {
            attachment: fs.createReadStream(filePath),
            body: `🌟| Title: ${title}\n🌟| Username: @${username}\n🌟| Display Name: ${displayname}\n\n😊 Thank you for using KULU BOT - CHATBOT MESSENGER! 🤖`,
          },
          event.threadID,
          () => {
            fs.unlinkSync(filePath);
          }
        );
      });
    } else {
      api.sendMessage("❌ No video found in the API response.", event.threadID);
    }
  } catch (error) {
    console.error("EABABS COMMAND ERROR:", error);
    api.sendMessage(
      "❌ An error occurred while fetching the video.",
      event.threadID
    );
  }
};
