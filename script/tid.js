const request = require("request");
const fs = require("fs");
const path = require("path");
module.exports.config = {
  name: "tid",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get thread ID and group image",
  usages: "tid",
  credits: "Developer",
  cooldowns: 5,
};
module.exports.run = async function({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const { threadName, participantIDs, imageSrc } = threadInfo;
    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const imagePath = __dirname + "/cache/" + `${timestamp}_tid.png`;
    if (imageSrc) {
      const callback = async function() {
        api.sendMessage(
          {
            body: `𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗗: ${event.threadID}\n\n𝗚𝗿𝗼𝘂𝗽 𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗺𝗮𝗴𝗲: `,
            attachment: fs.createReadStream(imagePath),
          },
          event.threadID,
          () => {
            fs.unlinkSync(imagePath);
          }
        );
      };
      request(imageSrc)
        .pipe(fs.createWriteStream(imagePath))
        .on("close", callback);
    } else {
      api.sendMessage(
        `𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗗: ${event.threadID}\n\n𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲.`,
        event.threadID
      );
    }
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
};
