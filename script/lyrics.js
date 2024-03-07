const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const ytdl = require('@neoxr/ytdl-core');
const yts = require('yt-search');

// Define a function to get a readable stream from a URL
async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

module.exports.config = {
  name: 'lyrics',
  version: '1.0',
  credits: 'Aryan Chauhan',
  cooldown: 0,
  role: 0,
  description: 'Get lyrics for a song',
  category: 'music',
  usages: 'lyrics [title]',
};

module.exports.run = async function({ api, event, args }) {
  const songName = args.join(' ');
  if (!songName) {
    api.sendMessage(
      '⛔ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗜𝗧𝗟𝗘\n\n❁ Please provide a song name!',
      event.threadID,
      event.messageID
    );
    return;
  }

  try {
    api.sendMessage(
      `𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 "${songName}". Please wait...`,
      event.threadID,
      event.messageID
    );
    // Fetch lyrics
    const lyricsResponse = await axios.get(
      `https://lyrics-api.replit.app/aryan?songName=${encodeURIComponent(
        songName
      )}`
    );
    const { lyrics, title, artist, image } = lyricsResponse.data;

    // Fetch song
    const searchResults = await yts(songName);
    if (!searchResults.videos.length) {
      api.sendMessage(
        '❌ 𝗦𝗢𝗡𝗚 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n\n❁ Sorry, song not found!',
        event.threadID,
        event.messageID
      );
      return;
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const stream = ytdl(videoUrl, { filter: 'audioonly' });
    const fileName = `lyrics.mp3`;
    const filePath = path.join(__dirname, 'cache', fileName);

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Starting download now!');
    });

    stream.on('info', (info) => {
      console.info(
        '[DOWNLOADER]',
        `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`
      );
    });

    stream.on('end', async () => {
      const audioStream = fs.createReadStream(filePath);
      let message = `📌 𝗛𝗘𝗥𝗘 𝗜𝗦 𝗟𝗬𝗥𝗜𝗖𝗦\n\n🎧 𝗧𝗜𝗧𝗟𝗘\n➪ ${title}\n👑 𝗔𝗥𝗧𝗜𝗦𝗧 \n➪ ${artist} \n\n🎶 𝗟𝗬𝗥𝗜𝗖𝗦\n➪ ${lyrics}`;
      let attachment = await getStreamFromURL(image);

      api.sendMessage(
        { body: message, attachment },
        event.threadID,
        (err, info) => {
          let id = info.messageID;
          api.sendMessage({ attachment: audioStream }, event.threadID, () => {
            fs.unlinkSync(filePath);
            api.setMessageReaction('✅', id, () => {}, true);
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    api.sendMessage(
      'Sorry, there was an error getting the lyrics and song!',
      event.threadID,
      event.messageID
    );
  }
};
