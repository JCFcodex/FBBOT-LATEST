const axios = require("axios");
const fs = require("fs");
const { promisify } = require("util");
const streamPipeline = promisify(require("stream").pipeline);

// Define the command properties
module.exports.config = {
  name: "spotify",
  version: "1.0.0",
  aliases: ["sp", "spoti"],
  hasPrefix: false,
  role: 0,
  credits: "Your Name",
  description: "Search and download a song from Spotify.",
  usage: "spotify <title>",
  cooldowns: 5,
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    const songName = args.join(" ");
    if (!songName) {
      return api.sendMessage("Please provide a song name.", event.threadID);
    }

    const loadingMessage = await api.sendMessage(
      "Searching for your song... 🎵",
      event.threadID
    );

    const spotifyResponse = await axios.get(
      `https://spotify-klei.onrender.com/spotify?query=${encodeURIComponent(
        songName
      )}`
    );

    const trackURLs = spotifyResponse.data.trackURLs;
    if (!trackURLs || trackURLs.length === 0) {
      throw new Error("No track found for the provided song name.");
    }

    const trackURL = trackURLs[0];
    const downloadResponse = await axios.get(
      `https://spdl.onrender.com/spotify?id=${encodeURIComponent(trackURL)}`
    );

    const downloadLink = downloadResponse.data.download_link;

    const filePath = await downloadTrack(downloadLink);

    // Send a message with a thumbnail and update it with the full file later
    const sentMessage = await api.sendMessage(
      {
        body: "Here is your music! 🎶 Enjoy!",
        attachment: fs.createReadStream(filePath),
      },
      event.threadID,
      (error) => {
        fs.unlinkSync(filePath);
      }
    );

    // Periodically update the loading message with the progress
    let progress = 0;
    const interval = setInterval(async () => {
      if (progress < 100) {
        // Update the loading message with the progress
        // api.changeThreadColor(sentMessage.messageID, {
        //   color: progress % 2 === 0 ? "FF0000" : "00FF00",
        // });
        progress += 10;
      } else {
        // File upload is complete, clear the interval and delete the temporary file
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds

    // Remove the initial loading message
    api.unsendMessage(loadingMessage.messageID);
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage(
      "An error occurred while processing your request.",
      event.threadID
    );
  }
};

// Helper function to download the track
async function downloadTrack(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const filePath = `${__dirname}/cache/${generateRandomString()}.mp3`;

  await streamPipeline(response.data, fs.createWriteStream(filePath));

  return filePath;
}

// Helper function to generate a random string
function generateRandomString() {
  const length = 10;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
