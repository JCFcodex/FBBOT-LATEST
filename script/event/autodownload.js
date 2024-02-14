const autodownfb =
  "𝗔𝗨𝗧𝗢 𝗗𝗟 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞-𝗩𝗜𝗗𝗘𝗢\n\n😊 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗞𝗨𝗟𝗨 𝗕𝗢𝗧 - 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥! 🤖\n";
const autodowntiktok = "𝗔𝗨𝗧𝗢 𝗗𝗟 𝗧𝗜𝗞𝗧𝗢𝗞-𝗩𝗜𝗗𝗘𝗢\n";

const axios = require("axios");
const fs = require("fs");
const getFBInfo = require("@xaviabot/fb-downloader");

module.exports.config = {
  name: "autodownload",
  version: "2.0.4",
};

module.exports.handleEvent = async function({
  api,
  event,
  body,
  threadID,
  messageID,
}) {
  if (event.body !== null) {
    const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
    if (facebookLinkRegex.test(event.body)) {
      try {
        const fbInfo = await getFBInfo(event.body);
        let fbResponse = await axios.get(encodeURI(fbInfo.sd), {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(
          "./video.mp4",
          Buffer.from(fbResponse.data, "arraybuffer")
        );
        api.sendMessage(
          { body: autodownfb, attachment: fs.createReadStream("./video.mp4") },
          event.threadID,
          () => fs.unlinkSync("./video.mp4")
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (event.body !== null) {
    const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
    const link = event.body;
    if (regEx_tiktok.test(link)) {
      api.sendMessage(
        "𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝘄𝗵𝗶𝗹𝗲 𝘄𝗲 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝘁𝗵𝗲 𝗧𝗶𝗸𝘁𝗼𝗸 𝘃𝗶𝗱𝗲𝗼. 🕒",
        event.threadID
      );
      // api.setMessageReaction("🚀", event.messageID, () => {}, true);
      axios
        .post(`https://www.tikwm.com/api/`, {
          url: link,
        })
        .then(async (response) => {
          // Added async keyword
          const data = response.data.data;
          const videoStream = await axios({
            method: "get",
            url: data.play,
            responseType: "stream",
          }).then((res) => res.data);
          const fileName = `TikTok-${Date.now()}.mp4`;
          const filePath = `./script/cache/${fileName}`;
          const videoFile = fs.createWriteStream(filePath);

          videoStream.pipe(videoFile);

          videoFile.on("finish", () => {
            videoFile.close(() => {
              console.log("Downloaded video file.");

              api.sendMessage(
                {
                  body: `${autodowntiktok}\n𝗖𝗼𝗻𝘁𝗲𝗻𝘁: ${data.title}\n\𝗟𝗶𝗸𝗲𝘀: ${data.digg_count}\n\𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝘀: ${data.comment_count}\n\n😊 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗞𝗨𝗟𝗨 𝗕𝗢𝗧 - 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥! 🤖`,
                  attachment: fs.createReadStream(filePath),
                },
                event.threadID,
                () => {
                  fs.unlinkSync(filePath); // Delete the video file after sending it
                }
              );
            });
          });
        })
        .catch((error) => {
          api.sendMessage(
            `Error when trying to download the TikTok video: ${error.message}`,
            event.threadID,
            event.messageID
          );
        });
    }
  }
};
