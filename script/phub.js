const xvideos = require("@rodrigogs/xvideos");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
  name: "phub",
  version: "1.0.0",
  aliases: ["bold", "porn"],
  role: 0,
  credits: "YourName",
  description: "Sends a random video from xvideos",
  commandCategory: "nsfw",
  usages: ["[phub]"],
  hasPrefix: false,
  cooldown: 60,
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event || !event.body) return;

  if (!(event.body.toLowerCase().indexOf("phub") === 0)) return;

  const userId = event.senderID;
  const threadID = event.threadID;

  let filePath;
  let fileSizeInMB;

  const nsfwData = loadNSFWData();
  // Check if the thread is allowed to use NSFW commands
  if (!nsfwData.hasOwnProperty(threadID) || !nsfwData[threadID]) {
    api.sendMessage(
      "❌ 𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝗡𝗦𝗙𝗪 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.",
      threadID
    );
    return;
  }

  do {
    try {
      api.sendMessage(
        "🎥 | Fetching a new video, please wait...",
        threadID,
        event.messageID
      );

      // Generate a random page number between 1 and 10
      const randomPage = Math.floor(Math.random() * 10) + 1;

      // Retrieve a random video from xvideos
      const searchResult = await xvideos.videos.search({ page: randomPage });
      const randomVideo =
        searchResult.videos[
          Math.floor(Math.random() * searchResult.videos.length)
        ];

      console.log("phub videos count: " + searchResult.videos.length);

      // Fetch the video details
      const videoDetails = await xvideos.videos.details(randomVideo);

      console.log(videoDetails);

      // Download the video
      const videoUrl = videoDetails.files.high;
      const { data } = await axios.get(videoUrl, {
        responseType: "arraybuffer",
      });

      // Save the video to a file
      filePath = path.join(__dirname, "cache", "random_video.mp4");
      fs.writeFileSync(filePath, Buffer.from(data, "binary"));

      // Check if the file size exceeds the Messenger limit (25MB)
      fileSizeInBytes = fs.statSync(filePath).size;
      fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMB > 40) {
        setTimeout(() => {
          api.sendMessage(
            `❌ The video size exceeds the maximum limit allowed by Messenger (40MB). Fetching a new video...`,
            threadID,
            event.messageID
          );
        }, 5000);
        fs.unlinkSync(filePath); // Delete the oversized video
      } else {
        break; // Break the loop if the video size is within the limit
      }
    } catch (error) {
      console.error("Error fetching video...", error);
      api.sendMessage("🐱 Error fetching video.", threadID, event.messageID);
      return;
    }
  } while (true);

  api.sendMessage(
    "🕒 Please wait, the video will be sent in a few seconds/minutes.",
    event.threadID,
    event.messageID
  );

  // Send the video
  const message = {
    body: `🎥 𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝗣𝗵𝘂𝗯 𝘃𝗶𝗱𝗲𝗼, 𝘄𝗮𝘁𝗰𝗵 𝗶𝘁 𝘄𝗲𝗹𝗹.\n\nVideo will unsend in 20 seconds.`,
    attachment: fs.createReadStream(filePath),
  };

  try {
    const result = await api.sendMessage(message, threadID);
    fs.unlinkSync(filePath);

    // Unsend the message after 20 seconds
    setTimeout(async () => {
      try {
        await api.unsendMessage(result.messageID);
      } catch (unsendError) {
        console.error("Error while unsending message:", unsendError);
      }
    }, 20000); // 20 seconds
  } catch (sendError) {
    console.error("Error sending video...", sendError);
    api.sendMessage("🐱 Error sending video.", event.threadID, event.messageID);
  }
};

module.exports.run = async function({ api, event }) {};
