module.exports.config = {
  name: "bible",
  version: "1.0.0",
  role: 0,
  credits: "Prince Sanel",
  description: "Search for Bible verse.",
  hasPrefix: false,
  commandCategory: "random",
  usage: "[John 3:16]",
  cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  let { threadID, messageID } = event;
  const response = args.join(" ");

  if (!args[0])
    return api.sendMessage(
      `❌ Wrong Format. Use ${module.exports.config.name} ${module.exports.config.usages}`,
      threadID,
      messageID
    );

  try {
    api.sendMessage(
      "⌛ 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 " + response + "...",
      threadID,
      messageID
    );

    const res = await axios.get(
      `https://bible-api.com/${response}?translation=kjv`
    );

    if (res.data.error) {
      api.sendMessage("❌ " + res.data.error, threadID, messageID);
    } else {
      const bibleReference = res.data.reference;
      const bibleText = res.data.text;

      const imgP = [];
      const img = [
        // "https://imgur.com/e69RmcC.png",
        // "https://imgur.com/IwCRlYD.png",
        // "https://imgur.com/qaT9zw6.png",
        "https://imgur.com/acocFI4.png",
        // "https://imgur.com/sqLwqww.png",
      ];
      const path = __dirname + "/cache/bible.png";
      const rdimg = img[Math.floor(Math.random() * img.length)];

      const { data } = await axios.get(rdimg, {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(path, Buffer.from(data, "utf-8"));
      imgP.push(fs.createReadStream(path));

      // Check if the file exists before deleting
      if (fs.existsSync(path)) {
        // Corrected syntax for sending image attachment
        await api.sendMessage(
          {
            body: "✨ 𝗩𝗲𝗿𝘀𝗲: " + bibleReference + "\n\n" + bibleText,
            attachment: imgP[0], // Directly use the array of read streams
          },
          event.threadID,
          (messageID) => {
            // Delete the help.png file after sending the image
            fs.unlinkSync(path);
          }
        );
      }
    }
  } catch (error) {
    api.sendMessage(
      "❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗺𝗮𝗸𝗶𝗻𝗴 𝘁𝗵𝗲 𝗔𝗣𝗜 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.",
      threadID,
      messageID
    );
  }
};
