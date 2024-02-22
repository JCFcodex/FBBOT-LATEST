// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// module.exports.config = {
//   name: "pflix",
//   version: "1.0.0",
//   role: 0,
//   credits: "YourName",
//   description: "Sends a video from PinayFlix",
//   commandCategory: "nsfw",
//   usage: "{prefix}pflix <query>",
//   hasPrefix: true,
//   cooldown: 20,
// };

// module.exports.handleEvent = async function({ api, event, args }) {
//   if (!event || !event.body) return;

//   if (!(event.body.toLowerCase().indexOf("pflix") === 0)) return;

//   const userId = event.senderID;
//   const threadID = event.threadID;

//   try {
//     api.sendMessage(
//       "🎥 | Fetching PinayFlix video, please wait...",
//       threadID,
//       event.messageID
//     );

//     // Set the query to "hot" if no args provided
//     const query =
//       Array.isArray(args) && args.length > 0 ? args.join(" ") : "hot";

//     // Make a request to PinayFlix API
//     const response = await axios.get(
//       `https://api.easy-api.online/api/pnayflex?s=${query}`,
//       { headers: { accept: "application/json" } }
//     );

//     console.log("Response Data:", response.data); // Log the response data

//     if (!Array.isArray(response.data) || response.data.length === 0) {
//       throw new Error("Video information not available");
//     }

//     const randomVideo = response.data[0];

//     if (!randomVideo) {
//       throw new Error("No video found");
//     }

//     const videoTitle = randomVideo.title;
//     const embedUrl = randomVideo.embedURL; // Use embedURL instead of link

//     if (!videoTitle || !embedUrl) {
//       throw new Error("Video title or URL not available");
//     }

//     console.log("Video Title:", videoTitle); // Log the video title
//     console.log("Video URL:", embedUrl); // Log the video URL

//     // Send the video
//     const message = {
//       body: `🎥 ${videoTitle}\n\nEnjoy the video!\n${embedUrl}`,
//     };

//     api.sendMessage(message, threadID, (err) => {
//       if (err) {
//         console.error("📀 Error sending video...", err);
//         api.sendMessage(
//           "📀 Error sending video.",
//           event.threadID,
//           event.messageID
//         );
//       }
//     });
//   } catch (error) {
//     console.error("📀 Error sending or fetching video...", error);
//     api.sendMessage(
//       "📀 Error sending or fetching video.",
//       threadID,
//       event.messageID
//     );
//   }
// };

// module.exports.run = async function({ api, event }) {};
