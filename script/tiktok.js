const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "tiktok",
  version: "1.0",
  aliases: ["tt", "tik", "chix"],
  role: 0,
  credits: "Your Name",
  description: "🎥 Send a short video from TikTok",
  commandCategory: "fun",
  hasPrefix: true,
  usages: "[tiktok <username>]",
  cooldown: 15,
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (!args[0]) {
      api.sendMessage("❌ Please provide a TikTok username.", event.threadID);
      return;
    }

    api.sendMessage("🎥 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝘀𝗵𝗼𝗿𝘁 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 𝗧𝗶𝗸𝗧𝗼𝗸...", event.threadID);

    const username = args[0];
    const apiUrl = `https://hiro-api.replit.app/tiktok/search?q=${username}`;
    const response = await axios.get(apiUrl);

    if (response.data.code === 0 && response.data.data.videos.length > 0) {
      const videoInfo = response.data.data.videos[0];
      const videoUrl = videoInfo.play;

      const filePath = __dirname + "/cache/tiktok-video.mp4";
      const file = fs.createWriteStream(filePath);

      const videoStream = await axios.get(videoUrl, { responseType: "stream" });
      videoStream.data.pipe(file);

      file.on("finish", async () => {
        const title = videoInfo.title || "No Title";
        const username = videoInfo.author.nickname;
        const duration = videoInfo.duration || "Unknown";
        const region = videoInfo.region;
        const playCount = videoInfo.play_count || 0;

        await api.sendMessage(
          {
            attachment: fs.createReadStream(filePath),
            body: `🌸|•ᴛɪᴛʟᴇ: ${title}\n\n🌸|•ᴜsᴇʀɴᴀᴍᴇ: @${username}\n🌸|•ᴅᴜʀᴀᴛɪᴏɴ: ${duration}s\n🌸|•ʀᴇɢɪᴏɴ: ${region}\n\n😊 Thank you for using YourBot! 🤖`,
          },
          event.threadID,
          () => {
            // Delete the video file after sending
            fs.unlinkSync(filePath);
          }
        );
      });
    } else {
      api.sendMessage(
        "❌ No TikTok videos found for the provided username.",
        event.threadID
      );
    }
  } catch (error) {
    console.error("TikTok command error:", error);
    api.sendMessage(
      "❌ An error occurred while fetching the TikTok video.",
      event.threadID
    );
  }
};
