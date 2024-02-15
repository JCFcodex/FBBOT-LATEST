const path = require("path");
const fs = require("fs");
const pathFile = path.join(__dirname, "script", "cache", "restart.txt");

module.exports = async ({ api }) => {
  const threadsToSendGreeting = ["5776059305779745"];

  if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, "false");
  const isEnable = fs.readFileSync(pathFile, "utf-8");
  if (isEnable == "true") {
    threadsToSendGreeting.forEach((threadID) => {
      api.sendMessage(
        "🚀 𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆! 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗯𝗮𝗰𝗸! 🎉",
        threadID
      );
    });
    // fs.writeFileSync(pathFile, "false");
  }
};
