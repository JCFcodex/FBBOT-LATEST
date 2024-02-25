const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");
const nsfwDataPath = path.join(__dirname, "../threadData.json"); // Adjust the path accordingly
const global = require("../config.json");

module.exports.config = {
  name: "hotedit",
  version: "1.0.1",
  role: 0,
  credits: "Joshua Sy (modified by Siegfried Sama)", // Don't change the credits, please
  description: "Admin and Bot info.",
  commandCategory: "nsfw",
  usePrefix: false,
  cooldown: 30,
};

// Function to load NSFW data from file
function loadNSFWData() {
  try {
    const nsfwData = fs.readFileSync(nsfwDataPath, "utf-8");
    return nsfwData ? JSON.parse(nsfwData) : {};
  } catch (error) {
    console.error("Error loading NSFW data:", error);
    return {};
  }
}

module.exports.run = async function({
  api,
  event,
  args,
  client,
  Users,
  Threads,
  __GLOBAL,
  Currencies,
}) {
  const threadID = event.threadID;
  const nsfwData = loadNSFWData();

  // Check if the thread is allowed to use the NSFW command
  if (!nsfwData.hasOwnProperty(threadID) || !nsfwData[threadID]) {
    api.sendMessage(
      "❌ 𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝗡𝗦𝗙𝗪 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.",
      threadID
    );
    return;
  }

  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  var juswa = moment.tz("Asia/Manila").format("dddd, MMMM D, YYYY | h:mm:ss A");

  var link = [
    "https://i.imgur.com/DDO686J.mp4",
    "https://i.imgur.com/WWGiRvB.mp4",
    "https://i.imgur.com/20QmmsT.mp4",
    "https://i.imgur.com/nN28Eea.mp4",
    "https://i.imgur.com/fknQ3Ut.mp4",
    "https://i.imgur.com/yXZJ4A9.mp4",
    "https://i.imgur.com/aWIyVpN.mp4",
    "https://i.imgur.com/aFIwl8X.mp4",
    "https://i.imgur.com/SJ60dUB.mp4",
    "https://i.imgur.com/ySu69zS.mp4",
    "https://i.imgur.com/mAmwCe6.mp4",
    "https://i.imgur.com/Sbztqx2.mp4",
    "https://i.imgur.com/s2d0BIK.mp4",
    "https://i.imgur.com/rWRfAAZ.mp4",
    "https://i.imgur.com/dYLBspd.mp4",
    "https://i.imgur.com/HCv8Pfs.mp4",
    "https://i.imgur.com/jdVLoxo.mp4",
    "https://i.imgur.com/hX3Znez.mp4",
    "https://i.imgur.com/cispiyh.mp4",
    "https://i.imgur.com/ApOSepp.mp4",
    "https://i.imgur.com/lFoNnZZ.mp4",
    "https://i.imgur.com/qDsEv1Q.mp4",
    "https://i.imgur.com/NjWUgW8.mp4",
    "https://i.imgur.com/ViP4uvu.mp4",
    "https://i.imgur.com/bim2U8C.mp4",
    "https://i.imgur.com/YzlGSlm.mp4",
    "https://i.imgur.com/HZpxU7h.mp4",
    "https://i.imgur.com/exTO3J4.mp4",
    "https://i.imgur.com/9iOci5S.mp4",
    "https://i.imgur.com/6w5tnvs.mp4",
    "https://i.imgur.com/1L0DMtl.mp4",
    "https://i.imgur.com/7wcQ8eW.mp4",
    "https://i.imgur.com/3MBTpM8.mp4",
    "https://i.imgur.com/8h1Vgum.mp4",
    "https://i.imgur.com/CTcsUZk.mp4",
    "https://i.imgur.com/e505Ko2.mp4",
    "https://i.imgur.com/3umJ6NL.mp4",
  ];

  var randomLink = link[Math.floor(Math.random() * link.length)];

  // Inform the user to wait
  api.sendMessage(
    {
      body: `𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘀𝗶𝘇𝘇𝗹𝗶𝗻𝗴 𝘃𝗶𝗱𝗲𝗼 𝗲𝗱𝗶𝘁. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 ⏳🔥`,
      mentions: [{ tag: "", id: event.senderID }],
    },
    event.threadID
  );

  const filePath = __dirname + "/cache/hotedit.mp4"; // Corrected path

  const callback = () => {
    if (fs.existsSync(filePath)) {
      api.sendMessage(
        {
          body: `🌟 *𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝗛𝗼𝘁 𝗲𝗱𝗶𝘁 𝘃𝗶𝗱𝗲𝗼* 🌟\n\n🕰️ *𝗨𝗣𝗧𝗜𝗠𝗘* 🕰️\n✅ 𝗧𝗼𝗱𝗮𝘆 𝗶𝘀: ${juswa}\n✅ 𝗕𝗼𝘁 𝗶𝘀 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 ${hours} Hrs ${minutes} Mins ${seconds} Secs.\n\n🙏 *Thanks for using ${global.BOTNAME}* 🙏`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        (messageID) => {
          // Delete the help.png file after sending the image
          fs.unlinkSync(filePath);
        }
      );
    } else {
      console.error("File not found:", filePath);
    }
  };

  const fileStream = fs.createWriteStream(filePath);

  fileStream.on("error", (err) => {
    console.error("Error during file download:", err);
  });

  return request(encodeURI(randomLink))
    .pipe(fileStream)
    .on("close", callback);
};
