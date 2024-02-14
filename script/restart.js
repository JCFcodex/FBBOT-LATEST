const fs = require("fs-extra");
const path = require("path");
const pathFile = path.join(__dirname, "cache", "restart.txt");

module.exports.config = {
  name: "restart",
  version: "1.0.0",
  aliases: ["reboot"],
  hasPrefix: false,
  role: 2,
  credits: "JC FAUSTINO",
  description: "Restarts the bot",
  usage: "[restart]",
  cooldown: 10,
};

module.exports.run = async function({ api, event, args }) {
  try {
    api.sendMessage(
      "🔄 𝗧𝗵𝗲 𝗯𝗼𝘁 𝗶𝘀 𝗿𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗳𝗼𝗿 10 𝘀𝗲𝗰𝗼𝗻𝗱𝘀 𝗯𝗲𝗳𝗼𝗿𝗲 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗮𝗴𝗮𝗶𝗻. ⏳",
      event.threadID,
      async () => {
        // Add a delay of 5 seconds before calling process.exit(1)

        setTimeout(async () => {
          // await api.sendMessage(
          //   "🚀 𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆! 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗯𝗮𝗰𝗸! 🎉",
          //   event.threadID
          // );
          fs.writeFileSync(pathFile, "true");
          process.exit(1);
        }, 5000);
      }
    );
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
