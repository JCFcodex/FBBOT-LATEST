module.exports.config = {
  name: "imgsearch",
  version: "1.0.0",
  role: 0,
  credits: "John Roy",
  description: "Search an Image from Google",
  usePrefix: false,
  commandCategory: "image",
  usages: "imgsearch [text]",
  cooldowns: 60,
  dependencies: {
    axios: "",
    "fs-extra": "",
    googlethis: "",
    cloudscraper: "",
  },
};

module.exports.run = async ({ matches, event, api, extra, args }) => {
  const axios = require("axios");
  const google = require("googlethis");
  const cloudscraper = require("cloudscraper");
  const fs = require("fs");

  var query =
    event.type == "message_reply" ? event.messageReply.body : args.join(" ");

  // Searching message with emoji
  api.sendMessage(
    `🔎 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 ${query}...`,
    event.threadID,
    event.messageID
  );

  let result = await google.image(query, { safe: false });
  if (result.length === 0) {
    // No result message with emoji
    api.sendMessage(
      `❌ 𝗬𝗼𝘂𝗿 𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝗮𝗿𝗰𝗵 𝗱𝗶𝗱 𝗻𝗼𝘁 𝗿𝗲𝘁𝘂𝗿𝗻 𝗮𝗻𝘆 𝗿𝗲𝘀𝘂𝗹𝘁.`,
      event.threadID,
      event.messageID
    );
    return;
  }

  let streams = [];
  let counter = 0;

  for (let image of result) {
    // Only show 9 images
    if (counter >= 9) break;
    let url = image.url;
    if (!url.endsWith(".jpg") && !url.endsWith(".png")) continue;

    let path = __dirname + `/cache/search-image-${counter}.jpg`;
    let hasError = false;
    await cloudscraper
      .get({ uri: url, encoding: null })
      .then((buffer) => fs.writeFileSync(path, buffer))
      .catch((error) => {
        console.log(error);
        hasError = true;
      });

    if (hasError) continue;
    streams.push(
      fs.createReadStream(path).on("end", async () => {
        if (fs.existsSync(path)) {
          fs.unlink(path, (err) => {
            if (err) return console.log(err);
          });
        }
      })
    );

    counter += 1;
  }

  // Sending search result message with emoji
  api.sendMessage(
    "📷 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝘀𝗲𝗮𝗿𝗰𝗵 𝗿𝗲𝘀𝘂𝗹𝘁...",
    event.threadID,
    event.messageID
  );

  let msg = {
    body: `🌐 𝗜𝗺𝗮𝗴𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁\n"${query}"\n\n𝗙𝗼𝘂𝗻𝗱: ${result.length} image${
      result.length > 1 ? "s" : ""
    }\n𝗢𝗻𝗹𝘆 𝘀𝗵𝗼𝘄𝗶𝗻𝗴: 9 images\n\n😊 Thank you for using KULU BOT - CHATBOT MESSENGER! 🤖`,
    attachment: streams,
  };

  // Sending final result with emoji
  api.sendMessage(msg, event.threadID, event.messageID);
};
