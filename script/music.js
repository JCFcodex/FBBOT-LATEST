const axios = require('axios');
const fs = require('fs-extra');
process.env.YTDL_NO_UPDATE = true;
const ytdl = require('ytdl-core');
const request = require('request');
const yts = require('yt-search');

module.exports.config = {
  name: 'music',
  version: '2.0.4',
  role: 0,
  credits: 'Grey',
  description: 'Play a song',
  aliases: ['sing', 'play'],
  cooldown: 60,
  hasPrefix: false,
  usage: '',
};

// Define a function to handle retries with exponential backoff
async function retryWithExponentialBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn('Rate limited. Retrying after delay...');
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

module.exports.run = async ({ api, event }) => {
  const input = event.body;
  const text = input.substring(12);
  const data = input.split(' ');

  if (data.length < 2) {
    return api.sendMessage('Please put a song', event.threadID);
  }

  data.shift();
  const song = data.join(' ');

  try {
    api.sendMessage(
      `𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 "${song}". Please wait...`,
      event.threadID,
      event.messageID
    );

    const searchResults = await retryWithExponentialBackoff(() => yts(song));

    if (!searchResults.videos.length) {
      return api.sendMessage(
        'Error: Invalid request.',
        event.threadID,
        event.messageID
      );
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    let subsCount = 0;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info(
        '[DOWNLOADER]',
        `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`
      );
      subsCount = info.videoDetails.author.subscriber_count;
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage(
          '[ERR] The file could not be sent because it is larger than 25MB.',
          event.threadID
        );
      }

      function formatViews(views) {
        if (views >= 1e9) {
          return (views / 1e9).toFixed(1) + 'B';
        } else if (views >= 1e6) {
          return (views / 1e6).toFixed(1) + 'M';
        } else if (views >= 1e3) {
          return (views / 1e3).toFixed(1) + 'K';
        } else {
          return views.toString();
        }
      }

      const formattedViews = formatViews(video.views);
      const formattedSubs = formatViews(subsCount);
      const message = {
        body: `Here's your music, enjoy!🥰\n\nTitle: ${video.title}\nArtist: ${video.author.name}\nDuration: ${video.timestamp}\nViews: ${formattedViews}\n\nSubs Count: ${formattedSubs}`,
        attachment: fs.createReadStream(filePath),
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage(
      'An error occurred while processing the command.',
      event.threadID
    );
  }
};

// const path = require("path");
// module.exports.config = {
//   name: "music",
//   version: "1.0.0",
//   role: 0,
//   hasPrefix: true,
//   aliases: ["play"],
//   usage: "Music [title]",
//   description: "Search music in youtube",
//   credits: "Deveploper",
//   cooldown: 5,
// };
// module.exports.run = async function({ api, event, args }) {
//   const fs = require("fs-extra");
//   const ytdl = require("ytdl-core");
//   const yts = require("yt-search");
//   const musicName = args.join(" ");
//   if (!musicName) {
//     api.sendMessage(
//       `𝗧𝗼 𝗴𝗲𝘁 𝘀𝘁𝗮𝗿𝘁𝗲𝗱, 𝘁𝘆𝗽𝗲 𝗺𝘂𝘀𝗶𝗰 𝗮𝗻𝗱 𝘁𝗵𝗲 𝘁𝗶𝘁𝗹𝗲 𝗼𝗳 𝘁𝗵𝗲 𝘀𝗼𝗻𝗴 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁.`,
//       event.threadID,
//       event.messageID
//     );
//     return;
//   }
//   try {
//     api.sendMessage(
//       `𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 "${musicName}"...`,
//       event.threadID,
//       event.messageID
//     );
//     const searchResults = await yts(musicName);
//     if (!searchResults.videos.length) {
//       return api.sendMessage(
//         "𝗖𝗮𝗻'𝘁 𝗳𝗶𝗻𝗱 𝘁𝗵𝗲 𝘀𝗲𝗮𝗿𝗰𝗵.",
//         event.threadID,
//         event.messageID
//       );
//     } else {
//       const music = searchResults.videos[0];
//       const musicUrl = music.url;
//       const stream = ytdl(musicUrl, {
//         filter: "audioonly",
//       });
//       const time = new Date();
//       const timestamp = time.toISOString().replace(/[:.]/g, "-");
//       const filePath = path.join(__dirname, "cache", `${timestamp}_music.mp3`);
//       stream.pipe(fs.createWriteStream(filePath));
//       stream.on("response", () => {});
//       stream.on("info", (info) => {});
//       stream.on("end", () => {
//         if (fs.statSync(filePath).size > 26214400) {
//           fs.unlinkSync(filePath);
//           return api.sendMessage(
//             "𝗧𝗵𝗲 𝗳𝗶𝗹𝗲 𝗰𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗯𝗲 𝘀𝗲𝗻𝘁 𝗯𝗲𝗰𝗮𝘂𝘀𝗲 𝗶𝘁 𝗶𝘀 𝗹𝗮𝗿𝗴𝗲𝗿 𝘁𝗵𝗮𝗻 25𝗠𝗕.",
//             event.threadID
//           );
//         }
//         const message = {
//           body: `${music.title}`,
//           attachment: fs.createReadStream(filePath),
//         };
//         api.sendMessage(
//           message,
//           event.threadID,
//           () => {
//             fs.unlinkSync(filePath);
//           },
//           event.messageID
//         );
//       });
//     }
//   } catch (error) {
//     api.sendMessage(
//       "𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.",
//       event.threadID,
//       event.messageID
//     );
//   }
// };
