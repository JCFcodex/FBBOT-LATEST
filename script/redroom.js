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
  name: "redroom",
  version: "1.5.8",
  role: 0,
  credits: "Hazeyy",
  description: "( 𝚁𝚎𝚍𝚛𝚘𝚘𝚖 for manyak )",
  commandCategory: "nsfw",
  usages: "[redroom]",
  hasPrefix: false,
  cooldown: 10,
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event || !event.body) return; // Add a check for event and event.body

  if (!(event.body.toLowerCase().indexOf("redroom") === 0)) return;

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
    const { data } = await axios.get("https://hazeyybold.replit.app/hazeyy", {
      responseType: "arraybuffer",
      timeout: 5000,
    });
    console.log("🔴 Redroom response:", data);

    api.sendMessage(
      "🐱 | 𝗥𝗲𝗺𝗶𝗻𝗱𝗲𝗿:\n\nThe video will be sent in a few minutes/seconds.",
      threadID,
      event.messageID
    );

    // const randomFileName = `${Math.floor(Math.random() * 99999999)}.mp4`;
    const filePath = path.join(__dirname, "cache", "redroom.mp4");

    fs.writeFileSync(filePath, Buffer.from(data, "binary"));

    const message = {
      body: "🎥 𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼, 𝘄𝗮𝘁𝗰𝗵 𝗶𝘁 𝘄𝗲𝗹𝗹.",
      attachment: fs.createReadStream(filePath),
    };

    /* (messageID) => {
          // Delete the help.png file after sending the image
          fs.unlinkSync(path);
        } */

    api.sendMessage(message, threadID, (err) => {
      fs.unlinkSync(filePath);
      if (err) {
        console.error("🐱 Error sending video...", err);
        api.sendMessage(
          "🐱 Error sending video.",
          event.threadID,
          event.messageID
        );
      }
    });

    cooldowns[userId] = Date.now();
  } catch (error) {
    console.error("🐱 Error sending or fetching video...", error);
    api.sendMessage(
      "🐱 Error sending or fetching video.",
      threadID,
      event.messageID
    );
  }
};

module.exports.run = async function({ api, event }) {};
