const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cooldowns = {};

// Function to load NSFW data from file
function loadNSFWData() {
  const nsfwDataPath = path.join(__dirname, "../threadData.json"); // Adjust the path accordingly
  try {
    const nsfwData = fs.readFileSync(nsfwDataPath, "utf-8");
    return nsfwData ? JSON.parse(nsfwData) : {};
  } catch (error) {
    console.error("Error loading NSFW data:", error);
    return {};
  }
}

module.exports.config = {
  name: "18+",
  version: "1.0.0",
  role: 0,
  credits: "Developer",
  description: "( 18+ video )",
  commandCategory: "nsfw",
  usages: "[18+]",
  hasPrefix: false,
  cooldown: 20,
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event || !event.body) return;

  if (!(event.body.toLowerCase().indexOf("18+") === 0)) return;

  const args = event.body.split(/\s+/);
  args.shift();

  const userId = event.senderID;
  const threadID = event.threadID;
  const nsfwData = loadNSFWData();

  // Check if the thread is allowed to use NSFW commands
  if (!nsfwData.hasOwnProperty(threadID) || !nsfwData[threadID]) {
    api.sendMessage(
      "❌ 𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝗡𝗦𝗙𝗪 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.",
      threadID
    );
    return;
  }
  // const cooldownTime = module.exports.config.cooldowns * 10000;

  // if (cooldowns[userId] && Date.now() - cooldowns[userId] < cooldownTime) {
  //   const remainingTime = Math.ceil(
  //     (cooldowns[userId] + cooldownTime - Date.now()) / 1000
  //   );
  //   api.sendMessage(
  //     `🕦 Please wait ${remainingTime} seconds before using this command again.`,
  //     threadID,
  //     event.messageID
  //   );
  //   return;
  // }

  try {
    api.sendMessage(
      "📀 | 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝘃𝗶𝗱𝗲𝗼, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...",
      threadID,
      event.messageID
    );

    const apiResponse = await axios.get("https://hiro-api.replit.app/video/18");

    const mp4Link = apiResponse.data.mp4Link;
    console.log("18+ API response:", mp4Link);

    api.sendMessage(
      "🎥 | 𝗥𝗲𝗺𝗶𝗻𝗱𝗲𝗿:\n\nThe video will be sent in a few minutes/seconds.",
      threadID,
      event.messageID
    );

    const filePath = path.join(__dirname, "cache", "18plus.mp4");

    const response = await axios({
      url: mp4Link,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(fs.createWriteStream(filePath));

    response.data.on("end", async () => {
      const message = {
        body:
          "🎥 𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼, 𝘄𝗮𝘁𝗰𝗵 𝗶𝘁 𝘄𝗲𝗹𝗹.\n\nThe video will be unsent in 5 minutes.",
        attachment: fs.createReadStream(filePath),
      };

      const result = await api.sendMessage(message, threadID, (err, info) => {
        fs.unlinkSync(filePath);

        if (err) {
          console.error("🎥 Error sending video...", err);
          api.sendMessage(
            "🎥 Error sending video.",
            event.threadID,
            event.messageID,
            () => {
              fs.unlinkSync(filePath);
            }
          );
        } else {
          const messageId = info.messageID;

          // Unsend the message after 10 seconds
          setTimeout(async () => {
            try {
              await api.unsendMessage(messageId);
            } catch (unsendError) {
              console.error("Error while unsending message:", unsendError);
            }
          }, 300000);
        }
      });

      // cooldowns[userId] = Date.now();
    });
  } catch (error) {
    console.error("🎥 Error sending or fetching video...", error);
    api.sendMessage(
      "🎥 Error sending or fetching video.",
      threadID,
      event.messageID
    );
  }
};

module.exports.run = async function({ api, event }) {};
