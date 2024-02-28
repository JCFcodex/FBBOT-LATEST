// const axios = require("axios");
// const fs = require("fs-extra");
// const ytdl = require("@neoxr/ytdl-core");
// const yts = require("yt-search");
// const path = require("path");

// module.exports.config = {
//   name: "guessmusic",
//   version: "1.0.0",
//   aliases: ["guesssong"],
//   role: 0,
//   credits: "Your Name",
//   description: "Guess the music title of a song.",
//   usage: "{prefix}guessmusic",
//   cooldowns: 5,
// };

// module.exports.run = async function({ api, event, args }) {
//   try {
//     api.sendMessage(
//       "Preparing a music clip for you to guess. Get ready!",
//       event.threadID
//     );

//     const video = await getRandomMusic();

//     if (!video) {
//       throw new Error(
//         "Unable to find a suitable YouTube video for the guessmusic command."
//       );
//     }

//     const videoUrl = video.url;
//     const filePath = await downloadAudio(videoUrl);

//     // Send the audio file along with a message
//     api.sendMessage(
//       {
//         body: "Guess the title of this music clip!",
//         attachment: fs.createReadStream(filePath),
//       },
//       event.threadID,
//       () => {
//         // Clean up: remove the downloaded audio file
//         fs.unlinkSync(filePath);
//       }
//     );
//   } catch (error) {
//     console.error(`Error fetching data for guessmusic: ${error.message}`);
//     api.sendMessage(
//       "An error occurred while preparing the music clip.",
//       event.threadID
//     );
//   }
// };

// // Helper function to download the audio
// async function downloadAudio(url) {
//   try {
//     const response = await axios({
//       url,
//       method: "GET",
//       responseType: "stream",
//     });

//     const filePath = path.join(__dirname, "cache", "music.mp3");

//     await response.data.pipe(fs.createWriteStream(filePath));

//     return filePath;
//   } catch (error) {
//     throw new Error(`Error downloading audio: ${error.message}`);
//   }
// }

// // Helper function to get a random music video from YouTube
// async function getRandomMusic() {
//   try {
//     const searchResults = await yts({
//       video: "Music",
//       safeSearch: true,
//     });

//     if (!searchResults.videos.length) {
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * searchResults.videos.length);
//     return searchResults.videos[randomIndex];
//   } catch (error) {
//     throw new Error(`Error fetching YouTube video: ${error.message}`);
//   }
// }
