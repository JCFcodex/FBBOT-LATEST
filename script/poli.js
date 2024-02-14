module.exports.config = {
  name: "poli",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "Developer",
  description: "generate image from polination.",
  usage: "poli [prompt]",
  cooldown: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  try {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const path = __dirname + "/cache/" + `${timestamp}_tid.png`;
    if (!query)
      return api.sendMessage(
        "𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗽𝗿𝗼𝗺𝗽𝘁.",
        threadID,
        messageID
      );
    api.sendMessage(`𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 ${query}`, event.threadID, event.messageID);
    const poli = (
      await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
    setTimeout(function() {
      api.sendMessage(
        {
          body: "𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!",
          attachment: fs.createReadStream(path),
        },
        threadID,
        () => fs.unlinkSync(path)
      );
    }, 5000);
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
};
