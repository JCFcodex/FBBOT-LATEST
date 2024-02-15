// const axios = require("axios");
// const fs = require("fs");
// const request = require("request");

// module.exports.config = {
//   name: "shoti",
//   version: "1.0",
//   role: 0,
//   credits: "Ronald Allen Albania",
//   description: "📹 Send a short video from Shoti",
//   commandCategory: "fun",
//   hasPrefix: true,
//   usages: "[shoti]",
//   cooldown: 0,
// };

// module.exports.run = async function({ api, event }) {
//   try {
//     api.sendMessage("🎥 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝘀𝗵𝗼𝗿𝘁 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 𝗦𝗵𝗼𝘁𝗶...", event.threadID);

//     let response = await axios.post(
//       "https://your-shoti-api.vercel.app/api/v1/get",
//       {
//         apikey: "$shoti-1hl86v5ul4oq3lfu2ug",
//       }
//     );

//     if (
//       response.data.code === 200 &&
//       response.data.data &&
//       response.data.data.url
//     ) {
//       const videoUrl = response.data.data.url;
//       const filePath = __dirname + "/cache/shoti-video.mp4";
//       const file = fs.createWriteStream(filePath);
//       const rqs = request(encodeURI(videoUrl));

//       rqs.pipe(file);

//       file.on("finish", async () => {
//         const userInfo = response.data.data.user;
//         const videoInfo = response.data.data;
//         const title = videoInfo.title;
//         const durations = videoInfo.duration;
//         const region = videoInfo.region;
//         const username = userInfo.username;
//         const nickname = userInfo.nickname;

//         // Sending the video and information in one message
//         await api.sendMessage(
//           {
//             attachment: fs.createReadStream(filePath),
//             body: `🌸|•ᴛɪᴛʟᴇ: ${title}\n🌸|•ᴜsᴇʀɴᴀᴍᴇ: @${username}\n🌸|•ɴɪᴄᴋɴᴀᴍᴇ: ${nickname}\n🌸|•ᴅᴜʀᴀᴛɪᴏɴ: ${durations}\n🌸|•ʀᴇɢɪᴏɴ: ${region}\n\n😊 Thank you for using KULU BOT - CHATBOT MESSENGER! 🤖`,
//           },
//           event.threadID,
//           () => {
//             // Delete the help.png file after sending the image
//             fs.unlinkSync(filePath);
//           }
//         );
//       });
//     } else {
//       api.sendMessage(
//         "❌ No video URL found in the API response.",
//         event.threadID
//       );
//     }
//   } catch (error) {
//     // console.error(error);
//     console.error("SHOTI COMMAND ERROR");
//     api.sendMessage(
//       "❌ An error occurred while fetching the video.",
//       event.threadID
//     );
//   }
// };

// Import any necessary modules or libraries
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Define the command properties
module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  aliases: ["eababs", "chix"],
  hasPrefix: true,
  role: 1,
  credits: "Your Name",
  description: "Get random Wifey videos",
  usage: "wifeyvideos",
  cooldowns: 5,
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args, message }) {
  try {
    // Your command logic goes here
    api.sendMessage("🕐 Fetching random Shoti video...", event.threadID);

    const response = await axios.get(
      `https://wifey-shoti.onrender.com/kshitiz`,
      { responseType: "stream" }
    );

    const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);

    const writer = fs.createWriteStream(tempVideoPath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      const stream = fs.createReadStream(tempVideoPath);

      api.sendMessage(
        {
          body: `🎥 Here's a random Shoti video for you!`,
          attachment: stream,
        },
        event.threadID,
        () => {
          // Delete the help.png file after sending the image
          fs.unlinkSync(tempVideoPath);
        }
      );

      // api.sendMessage("✅ Video sent successfully!", event.threadID);
    });
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage(
      "❌ Sorry, an error occurred while processing your request.",
      event.threadID
    );
  }
};
