const path = require("path");
const moment = require("moment-timezone");
const axios = require("axios"); // Import axios
const fs = require("fs-extra"); // Import fs-extra
const request = require("request"); // Import request

const global = require("../config.json");

module.exports.config = {
  name: "serverinfo",
  aliases: ["info", "status"],
  version: "1.0.3",
  role: 3,
  credits: "Joshua Sy (modified by Siegfried Sama)",
  description: "Admin and Bot info.",
  commandCategory: "system",
  hasPrefix: true,
  usage: "[serverinfo]",
  cooldown: 1,
};

module.exports.run = async function({ api, event }) {
  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);
  const juswa = moment.tz("Asia/Manila").format("dddd, MMMM D, YYYY h:mm:ss A");

  api.setMessageReaction("⌛", event.messageID, () => {}, true);

  /* const threadsDataPath = "../../includes/database/data/threadsData.json";
  const usersDataPath = "../../includes/database/data/usersData.json";

  let threadsData;
  let usersData;

  try {
    threadsData = require(threadsDataPath);
    usersData = require(usersDataPath);
  } catch (error) {
    console.error("Error reading data files:", error);
    api.sendMessage(
      {
        body: "An error occurred while reading data files.",
        mentions: [{ tag: "", id: event.senderID }],
      },
      event.threadID
    );
    return;
  }

  const totalThreads = threadsData ? Object.keys(threadsData).length : 0;
  const totalUsers = usersData ? Object.keys(usersData).length : 0; */

  const botStartTime = moment()
    .subtract({ seconds: time })
    .format("dddd, MMMM D, YYYY h:mm:ss A");

  const link = [
    // "https://imgur.com/e69RmcC.png",
    // "https://imgur.com/IwCRlYD.png",
    // "https://imgur.com/qaT9zw6.png",
    "https://imgur.com/acocFI4.png",
    // "https://imgur.com/sqLwqww.png",
  ];

  const randomLink = link[Math.floor(Math.random() * link.length)];

  try {
    const botSpeed = await calculateBotSpeed(randomLink, axios);

    const response = await axios({
      method: "GET",
      url: encodeURI(randomLink),
      responseType: "stream",
    });

    const filePath = path.join(__dirname, "cache", "serverinfo.png");
    const writeStream = fs.createWriteStream(filePath);

    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      api.sendMessage(
        {
          body: `🌟 *𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻* 🌟\n\n✅ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${global.BOTNAME}\n✅ 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻: ${global.BOTADMIN}\n✅ 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.PREFIX}\n\n📊 *𝗦𝘁𝗮𝘁𝘂𝘀* 📊\n✅ 𝗗𝗮𝘁𝗲 𝘁𝗼𝗱𝗮𝘆: ${juswa}\n✅ 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours} Hrs ${minutes} Mins ${seconds} Secs\n✅ 𝗕𝗼𝘁 𝗦𝗽𝗲𝗲𝗱: ${botSpeed}`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => {
          // Delete the help.png file after sending the image
          fs.unlinkSync(filePath);
        }
      );
    });

    writeStream.on("error", (error) => {
      console.error("Error writing stream:", error);
      api.sendMessage(
        {
          body: "An error occurred while fetching server info.",
          mentions: [{ tag: "", id: event.senderID }],
        },
        event.threadID
      );
    });
  } catch (error) {
    console.error("Error fetching server info:", error);
    api.sendMessage(
      {
        body: "An error occurred while fetching server info.",
        mentions: [{ tag: "", id: event.senderID }],
      },
      event.threadID
    );
  }
};

async function calculateBotSpeed(url, axios) {
  try {
    const start = new Date();
    const response = await axios({
      method: "GET",
      url: encodeURI(url),
      responseType: "stream",
    });

    const end = new Date();
    const downloadTime = end - start; // in milliseconds
    const fileSize = response.headers["content-length"]; // in bytes

    const speedInBitsPerSecond = (fileSize * 8) / (downloadTime / 1000);
    const speedInMbps = (speedInBitsPerSecond / 1000000 + 100).toFixed(2);

    return `${speedInMbps} Mbps`;
  } catch (error) {
    console.error("Error calculating bot speed:", error);
    return "N/A";
  }
}
