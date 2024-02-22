const ytdl = require("ytdl-core");

module.exports.config = {
  name: "video",
  version: "1.0.0",
  role: 0,
  credits: "Grey | convert to video by JC FAUSTINO",
  description: "Play a video from youtube",
  aliases: ["watch", "playvideo", "yt", "youtube"],
  cooldown: 60,
  hasPrefix: false,
  usage: "video [Title]",
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const yts = require("yt-search");

  const input = event.body;
  const text = input.substring(12);
  const data = input.split(" ");

  if (data.length < 2) {
    return api.sendMessage("Please put a video", event.threadID);
  }

  data.shift();
  const videoQuery = data.join(" ");

  try {
    api.sendMessage(
      `Searching for "${videoQuery}". Please wait...`,
      event.threadID,
      event.messageID
    );

    const searchResults = await yts(videoQuery);

    if (!searchResults.videos.length) {
      return api.sendMessage(
        "Error: Invalid request.",
        event.threadID,
        event.messageID
      );
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    // Download video
    const videoStream = ytdl(videoUrl, { filter: "videoandaudio" });

    const fileName = `${event.senderID}.mp4`;
    const filePath = __dirname + `/cache/${fileName}`;

    videoStream.pipe(fs.createWriteStream(filePath));

    videoStream.on("response", () => {
      console.info("[DOWNLOADER]", "Starting download now!");
    });

    videoStream.on("info", (info) => {
      console.info(
        "[DOWNLOADER]",
        `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`
      );
      subsCount = info.videoDetails.author.subscriber_count;
      // You can access video details here
      // console.log(info.videoDetails);
    });

    videoStream.on("end", () => {
      console.info("[DOWNLOADER] Downloaded");

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage(
          "[ERR] The file could not be sent because it is larger than 25MB.",
          event.threadID
        );
      }

      function formatViews(views) {
        if (views >= 1e9) {
          // Views are in the billions
          return (views / 1e9).toFixed(1) + "B";
        } else if (views >= 1e6) {
          // Views are in the millions
          return (views / 1e6).toFixed(1) + "M";
        } else if (views >= 1e3) {
          // Views are in the thousands
          return (views / 1e3).toFixed(1) + "K";
        } else {
          // Views are less than 1 thousand
          return views.toString();
        }
      }

      api.sendMessage(
        "Please wait, the video will be sent in a few seconds/minutes. ⏳🎶",
        event.threadID
      );

      const formattedViews = formatViews(video.views);
      const formattedSubs = formatViews(subsCount);
      const message = {
        body: `Here's your video, enjoy!🥰\n\nTitle: ${video.title}\nArtist: ${video.author.name}\nDuration: ${video.timestamp}\nViews: ${formattedViews}\n\nSubs Count: ${formattedSubs}`,
        attachment: fs.createReadStream(filePath),
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("[ERROR]", error);
    api.sendMessage(
      "An error occurred while processing the command.",
      event.threadID
    );
  }
};

// const ytdl = require("ytdl-core");
// const YouTubeAPI = require("simple-youtube-api");
// const fs = require("fs-extra");
// const axios = require("axios");

// module.exports.config = {
//   name: "video",
//   version: "1.0.0",
//   aliases: ["ytdl", "youtube", "yt"],
//   hasPrefix: false,
//   role: 2,
//   credits: "Your Name",
//   description: "Description of your command",
//   usage: "example <parameter>",
//   cooldowns: 5,
//   YOUTUBE_API: "AIzaSyDBOpnGGz225cPwHlJQs8OMRtxOjSUm73I", // Add your YouTube API key here
// };

// module.exports.handleReply = async function({ api, event, handleReply }) {
//   const ytdl = require("ytdl-core");
//   const {
//     createReadStream,
//     createWriteStream,
//     unlinkSync,
//     statSync,
//   } = require("fs-extra");

//   ytdl.getInfo(handleReply.link[event.body - 1]).then((res) => {
//     let body = res.videoDetails.title;
//     api.sendMessage(`🔍 Searching...`, event.threadID, (err, info) =>
//       setTimeout(() => {
//         api.unsendMessage(info.messageID);
//       }, 100000)
//     );
//   });

//   try {
//     ytdl.getInfo(handleReply.link[event.body - 1]).then((res) => {
//       let body = res.videoDetails.title;
//       ytdl(handleReply.link[event.body - 1])
//         .pipe(
//           createWriteStream(
//             __dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`
//           )
//         )
//         .on("close", () => {
//           if (
//             statSync(
//               __dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`
//             ).size > 26214400
//           )
//             return api.sendMessage(
//               "File cannot be sent because it is larger than 25MB.",
//               event.threadID,
//               () =>
//                 unlinkSync(
//                   __dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`
//                 ),
//               event.messageID
//             );
//           else
//             return api.sendMessage(
//               {
//                 body: `${body}`,
//                 attachment: createReadStream(
//                   __dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`
//                 ),
//               },
//               event.threadID,
//               () =>
//                 unlinkSync(
//                   __dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`
//                 ),
//               event.messageID
//             );
//         })
//         .on("error", (error) =>
//           api.sendMessage(
//             `There was a problem while processing the request, error: \n no such file or directory`,
//             event.threadID,
//             event.messageID
//           )
//         );
//     });
//   } catch {
//     api.sendMessage(
//       "❌ Unable to process your request!",
//       event.threadID,
//       event.messageID
//     );
//   }
//   return api.unsendMessage(handleReply.messageID);
// };

// module.exports.run = async function({ api, event, args }) {
//   const ytdl = require("ytdl-core");
//   const YouTubeAPI = require("simple-youtube-api");
//   const {
//     createReadStream,
//     createWriteStream,
//     unlinkSync,
//     statSync,
//   } = require("fs-extra");

//   const youtube = new YouTubeAPI(module.exports.config.YOUTUBE_API);

//   if (args.length == 0 || !args)
//     return api.sendMessage(
//       "Search cannot be left blank.",
//       event.threadID,
//       event.messageID
//     );

//   const keywordSearch = args.join(" ");
//   const videoPattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
//   const urlValid = videoPattern.test(args[0]);

//   if (urlValid) {
//     try {
//       var id = args[0].split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
//       id[2] !== undefined
//         ? (id = id[2].split(/[^0-9a-z_\-]/i)[0])
//         : (id = id[0]);
//       ytdl(args[0])
//         .pipe(createWriteStream(__dirname + `/cache/${id}.mp4`))
//         .on("close", () => {
//           if (statSync(__dirname + `/cache/${id}.mp4`).size > 26214400)
//             return api.sendMessage(
//               "File cannot be sent because it is larger than 25MB.",
//               event.threadID,
//               () => unlinkSync(__dirname + `/cache/${id}.mp4`),
//               event.messageID
//             );
//           else
//             return api.sendMessage(
//               { attachment: createReadStream(__dirname + `/cache/${id}.mp4`) },
//               event.threadID,
//               () => unlinkSync(__dirname + `/cache/${id}.mp4`),
//               event.messageID
//             );
//         })
//         .on("error", (error) =>
//           api.sendMessage(
//             "There was a problem while processing the request, error: \nno such file or directory",
//             event.threadID,
//             event.messageID
//           )
//         );
//     } catch {
//       api.sendMessage(
//         "Unable to process your request!",
//         event.threadID,
//         event.messageID
//       );
//     }
//   } else {
//     try {
//       var link = [],
//         msg = "",
//         num = 0,
//         numb = 0;
//       var imgthumnail = [];
//       var results = await youtube.searchVideos(keywordSearch, 6);
//       for (let value of results) {
//         if (typeof value.id == "undefined") return;
//         link.push(value.id);
//         var idd = value.id;
//         let datab = (
//           await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${module.exports.config.YOUTUBE_API}`
//           )
//         ).data;
//         let gettime = datab.items[0].contentDetails.duration;
//         let time = gettime.slice(2);

//         let datac = (
//           await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${module.exports.config.YOUTUBE_API}`
//           )
//         ).data;
//         let channel = datac.items[0].snippet.channelTitle;
//         let folderthumnail = __dirname + `/cache/${(numb += 1)}.png`;

//         let linkthumnail = `https://img.youtube.com/vi/${value.id}/maxresdefault.jpg`;

//         let getthumnail = (
//           await axios.get(`${linkthumnail}`, { responseType: "arraybuffer" })
//         ).data;

//         fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, "utf-8"));

//         imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));

//         msg += `${(num += 1)}. ${
//           value.title
//         }\nTime: ${time}\nChannel: ${channel}\n-----------------------\n`;
//       }

//       var body = `☑️ Done! ${link.length} Results match your search keyword:\n👇👇👇👇👇\n${msg}\nPlease reply(feedback) choose one of the above searches`;

//       return api.sendMessage(
//         { attachment: imgthumnail, body: body },
//         event.threadID,
//         // (error, info) =>
//         //   global.client.handleReply.push({
//         //     name: module.exports.config.name,
//         //     messageID: info.messageID,
//         //     author: event.senderID,
//         //     link,
//         //   }),
//         event.messageID
//       );
//     } catch (error) {
//       const link = [],
//         msg = "",
//         num = 0,
//         numb = 0;
//       const imgthumnail = [];
//       const results = await youtube.searchVideos(keywordSearch, 12);
//       for (let value of results) {
//         if (typeof value.id == "undefined") return;
//         link.push(value.id);
//         var idd = value.id;
//         numb += 1;
//         let folderthumnail = __dirname + `/cache/${numb}.png`;

//         let linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;

//         let getthumnail = (
//           await axios.get(`${linkthumnail}`, { responseType: "arraybuffer" })
//         ).data;

//         let datab = (
//           await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${module.exports.config.YOUTUBE_API}`
//           )
//         ).data;
//         let gettime = datab.items[0].contentDetails.duration;
//         let time = gettime.slice(2);

//         let datac = (
//           await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${module.exports.config.YOUTUBE_API}`
//           )
//         ).data;
//         let channel = datac.items[0].snippet.channelTitle;

//         fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, "utf-8"));

//         imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));

//         msg += `${(num += 1)}. ${
//           value.title
//         }\nTime: ${time}\nChannel: ${channel}\n-----------------------\n`;
//       }

//       var body = `☑️ Done! ${link.length} Results match your search term:\n👇👇👇👇👇\n${msg}\nPlease reply(feedback) choose one of the above searches`;

//       return api.sendMessage(
//         { attachment: imgthumnail, body: body },
//         event.threadID,
//         // (error, info) =>
//         //   global.client.handleReply.push({
//         //     name: module.exports.config.name,
//         //     messageID: info.messageID,
//         //     author: event.senderID,
//         //     link,
//         //   }),
//         event.messageID
//       );
//     }
//   }

//   for (let ii = 1; ii < 7; ii++) {
//     unlinkSync(__dirname + `/cache/${ii}.png`);
//   }
// };
