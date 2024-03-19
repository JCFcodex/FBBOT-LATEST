const axios = require('axios');
const request = require('request');
const fs = require('fs-extra');
const moment = require('moment-timezone');
const path = require('path');
const nsfwDataPath = path.join(__dirname, '../threadData.json'); // Adjust the path accordingly
const global = require('../config.json');

module.exports.config = {
  name: 'shortvid',
  version: '1.0.1',
  role: 0,
  credits: 'Joshua Sy (modified by Siegfried Sama)', // Don't change the credits, please
  description: 'Random Short Video of Hot Girls',
  commandCategory: 'nsfw',
  usePrefix: false,
  cooldown: 30,
};

// Function to load NSFW data from file
function loadNSFWData() {
  try {
    const nsfwData = fs.readFileSync(nsfwDataPath, 'utf-8');
    return nsfwData ? JSON.parse(nsfwData) : {};
  } catch (error) {
    console.error('Error loading NSFW data:', error);
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

  // // Check if the thread is allowed to use the NSFW command
  // if (!nsfwData.hasOwnProperty(threadID) || !nsfwData[threadID]) {
  //   api.sendMessage(
  //     '❌ 𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝗡𝗦𝗙𝗪 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.',
  //     threadID
  //   );
  //   return;
  // }

  const time = process.uptime();
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  var juswa = moment.tz('Asia/Manila').format('dddd, MMMM D, YYYY | h:mm:ss A');

  var link = [
    'https://i.imgur.com/XCC2HCy.mp4',
    'https://i.imgur.com/mdHeCCc.mp4',
    'https://i.imgur.com/yUd4bJE.mp4',
    'https://i.imgur.com/TFrX0P4.mp4',
    'https://i.imgur.com/mb89V2D.mp4',
    'https://i.imgur.com/ca2yBhv.mp4',
    'https://i.imgur.com/srnfztE.mp4',
    'https://i.imgur.com/dcBSemx.mp4',
    'https://i.imgur.com/qYQPkvP.mp4',
    'https://i.imgur.com/Io30eVo.mp4',
    'https://i.imgur.com/Cp4wbP9.mp4',
    'https://i.imgur.com/SiFjpir.mp4',
    'https://i.imgur.com/0du8XoQ.mp4',
    'https://i.imgur.com/hq3FBw1.mp4',
    'https://i.imgur.com/4ZOt8gt.mp4',
    'https://i.imgur.com/3uDBjn3.mp4',
    'https://i.imgur.com/cRnzcMg.mp4',
    'https://i.imgur.com/37Wlf23.mp4',
    'https://i.imgur.com/6NgvPF3.mp4',
    'https://i.imgur.com/tWypNCc.mp4',
    'https://i.imgur.com/ODGJlnG.mp4',
    'https://i.imgur.com/JWF9ruC.mp4',
    'https://i.imgur.com/Az5WPaB.mp4',
    'https://i.imgur.com/BNfXX5q.mp4',
    'https://i.imgur.com/P2GbX7o.mp4',
    'https://i.imgur.com/6rMzcIB.mp4',
    'https://i.imgur.com/1NCnpfS.mp4',
    'https://i.imgur.com/vkNBKnb.mp4',
    'https://i.imgur.com/Q0ENsC6.mp4',
    'https://i.imgur.com/JY9n9B5.mp4',
    'https://i.imgur.com/Iel2jij.mp4',
    'https://i.imgur.com/pecBWyI.mp4',
    'https://i.imgur.com/IrqDZXR.mp4',
    'https://i.imgur.com/V48iXIg.mp4',
    'https://i.imgur.com/Vy4Esss.mp4',
    'https://i.imgur.com/jzh5xNt.mp4',
    'https://i.imgur.com/D6EnMwz.mp4',
    'https://i.imgur.com/409GY0m.mp4',
    'https://i.imgur.com/9y5N7Ef.mp4',
    'https://i.imgur.com/JeQzFk6.mp4',
    'https://i.imgur.com/dzT43pY.mp4',
    'https://i.imgur.com/Pv3ukt8.mp4',
    'https://i.imgur.com/aDHMmDG.mp4',
    'https://i.imgur.com/KF6PBdt.mp4',
    'https://i.imgur.com/cZYdGaY.mp4',
    'https://i.imgur.com/LtP2aCo.mp4',
    'https://i.imgur.com/y2c4SJf.mp4',
    'https://i.imgur.com/h8pxLA7.mp4',
    'https://i.imgur.com/vwQZeUA.mp4',
    'https://i.imgur.com/KmifFJf.mp4',
    'https://i.imgur.com/GXo6zmf.mp4',
    'https://i.imgur.com/9nbup0Y.mp4',
    'https://i.imgur.com/Ys2s473.mp4',
    'https://i.imgur.com/LNudggx.mp4',
    'https://i.imgur.com/LlRje2D.mp4',
    'https://i.imgur.com/em8jNsi.mp4',
    'https://i.imgur.com/SSNT2xH.mp4',
    'https://i.imgur.com/tBVSKL0.mp4',
    'https://i.imgur.com/CoHsfGq.mp4',
    'https://i.imgur.com/msrG9Hg.mp4',
    'https://i.imgur.com/1wuNUeu.mp4',
    'https://i.imgur.com/sW9I9WX.mp4',
    'https://i.imgur.com/H8Bau50.mp4',
    'https://i.imgur.com/knBVkNa.mp4',
    'https://i.imgur.com/Dnou58v.mp4',
    'https://i.imgur.com/s7D0EYr.mp4',
    'https://i.imgur.com/JwIwlQQ.mp4',
    'https://i.imgur.com/YV2Wzoq.mp4',
    'https://i.imgur.com/nTSrod9.mp4',
    'https://i.imgur.com/YlAuqwx.mp4',
    'https://i.imgur.com/fbP3GBO.mp4',
    'https://i.imgur.com/1aXmTrO.mp4',
    'https://i.imgur.com/sbRLn2k.mp4',
    'https://i.imgur.com/GO038XI.mp4',
    'https://i.imgur.com/Q2pWzAi.mp4',
    'https://i.imgur.com/aRrtkHd.mp4',
    'https://i.imgur.com/yzYnvIn.mp4',
    'https://i.imgur.com/8OhiCiW.mp4',
    'https://i.imgur.com/cBQvhYJ.mp4',
    'https://i.imgur.com/mWd1ZxA.mp4',
    'https://i.imgur.com/jRL4bMo.mp4',
    'https://i.imgur.com/PtpRVOa.mp4',
    'https://i.imgur.com/uaCOgF2.mp4',
    'https://i.imgur.com/wSmgclj.mp4',
    'https://i.imgur.com/rE8LNgI.mp4',
    'https://i.imgur.com/6vwvqIn.mp4',
    'https://i.imgur.com/cy4aT71.mp4',
    'https://i.imgur.com/ieNbUuN.mp4',
    'https://i.imgur.com/AxoNEhW.mp4',
    'https://i.imgur.com/xJUrqOK.mp4',
    'https://i.imgur.com/4bR7QR0.mp4',
    'https://i.imgur.com/L5uNi3l.mp4',
    'https://i.imgur.com/ViKpycp.mp4',
    'https://i.imgur.com/gGw6max.mp4',
    'https://i.imgur.com/CIOKrko.mp4',
    'https://i.imgur.com/XaWajYD.mp4',
    'https://i.imgur.com/YT4fiIv.mp4',
    'https://i.imgur.com/qizOjrb.mp4',
    'https://i.imgur.com/jBiAVpU.mp4',
    'https://i.imgur.com/Ia9Yx2U.mp4',
    'https://i.imgur.com/gPXFLT3.mp4',
    'https://i.imgur.com/lLQs9jL.mp4',
    'https://i.imgur.com/62D82Ac.mp4',
    'https://i.imgur.com/CnEkVq7.mp4',
    'https://i.imgur.com/bGbFGzr.mp4',
    'https://i.imgur.com/53ncsV4.mp4',
    'https://i.imgur.com/rxCfOrT.mp4',
    'https://i.imgur.com/WrL27wI.mp4',
    'https://i.imgur.com/tf59GxV.mp4',
    'https://i.imgur.com/tTfCC3n.mp4',
    'https://i.imgur.com/SdUsR7W.mp4',
    'https://i.imgur.com/DZ5w44v.mp4',
    'https://i.imgur.com/RGB1lxJ.mp4',
    'https://i.imgur.com/9XH6AlW.mp4',
    'https://i.imgur.com/1oDIREL.mp4',
    'https://i.imgur.com/XA14XOP.mp4',
    'https://i.imgur.com/ADOOweh.mp4',
    'https://i.imgur.com/cDLGu7K.mp4',
    'https://i.imgur.com/vpvhZtQ.mp4',
    'https://i.imgur.com/rIy3NUx.mp4',
    'https://i.imgur.com/6RxdDer.mp4',
    'https://i.imgur.com/2sT4SNg.mp4',
    'https://i.imgur.com/5kVTdrC.mp4',
    'https://i.imgur.com/uuZTTev.mp4',
    'https://i.imgur.com/BxvQ2hm.mp4',
    'https://i.imgur.com/4E2TwSI.mp4',
    'https://i.imgur.com/hd73w9F.mp4',
    'https://i.imgur.com/svmV0po.mp4',
    'https://i.imgur.com/R54y0BT.mp4',
    'https://i.imgur.com/ebVgxSW.mp4',
    'https://i.imgur.com/z8nn0r3.mp4',
    'https://i.imgur.com/RP9un2f.mp4',
    'https://i.imgur.com/lxI61gs.mp4',
    'https://i.imgur.com/haDHqHL.mp4',
    'https://i.imgur.com/aROBpVu.mp4',
    'https://i.imgur.com/Nmi43Xq.mp4',
    'https://i.imgur.com/FirfHWM.mp4',
    'https://i.imgur.com/paaZfGZ.mp4',
    'https://i.imgur.com/9Hyq4ko.mp4',
    // NEW
    // NEW
  ];

  var randomLink = link[Math.floor(Math.random() * link.length)];

  // Inform the user to wait
  api.sendMessage(
    {
      body: `𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘀𝗵𝗼𝗿𝘁 𝘃𝗶𝗱𝗲𝗼. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 ⏳`,
      mentions: [{ tag: '', id: event.senderID }],
    },
    event.threadID
  );

  const filePath = __dirname + '/cache/shortVid.mp4'; // Corrected path

  const callback = () => {
    if (fs.existsSync(filePath)) {
      api.sendMessage(
        {
          body: `🌟 *𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝘀𝗵𝗼𝗿𝘁 𝘃𝗶𝗱𝗲𝗼* 🌟\n\n🕰️ *𝗨𝗣𝗧𝗜𝗠𝗘* 🕰️\n✅ 𝗧𝗼𝗱𝗮𝘆 𝗶𝘀: ${juswa}\n\n🙏 *Thanks for using ${global.BOTNAME}* 🙏`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        (messageID) => {
          // Delete the help.png file after sending the image
          fs.unlinkSync(filePath);
        }
      );
    } else {
      console.error('File not found:', filePath);
    }
  };

  const fileStream = fs.createWriteStream(filePath);

  fileStream.on('error', (err) => {
    console.error('Error during file download:', err);
  });

  return request(encodeURI(randomLink))
    .pipe(fileStream)
    .on('close', callback);
};
