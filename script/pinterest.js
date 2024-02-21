const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "pinterest",
  version: "1.0",
  hasPrefix: false,
  role: 0,
  credits: "Your Name",
  description: "Retrieve Pinterest images using a custom API.",
  commandCategory: "Utility",
  usage: "pinterest <query> - <amount>",
  cooldowns: 20,
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event || !event.body) return;

  if (!(event.body.toLowerCase().indexOf("pinterest") === 0)) return;

  const args = event.body.split(/\s+/);
  args.shift();

  const [search, amount] = args.join(" ").split(" - ");
  if (!search) {
    return api.sendMessage(
      "🤖 Usage: pinterest <query> - <amount>\n\nExample: pinterest ranpo - 10",
      event.threadID
    );
  }

  try {
    const response = await axios.get(
      `https://pinte-hiroshi-api.vercel.app/pinterest?search=${search}&amount=${amount ||
        5}`
    );

    api.sendMessage(
      "🕟 | Searching on Pinterest, please wait...",
      event.threadID
    );

    const data = response.data;

    if (data.count === 0) {
      return api.sendMessage(
        "No images found for the given search term.",
        event.threadID
      );
    }

    let attachment = [];
    let storedPath = [];

    for (let i = 0; i < data.count; i++) {
      let path =
        __dirname + "/cache/" + Math.floor(Math.random() * 99999999) + ".jpg";

      let pic = await axios.get(data.data[i], {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(path, pic.data);
      storedPath.push(path);
      attachment.push(fs.createReadStream(path));
    }

    api.sendMessage(
      {
        body: `🤖 Pinterest Images\n\n🖋️ Search: '${search}'\n\n» Number of Images: ${attachment.length} - ${data.count} «`,
        attachment: attachment,
      },
      event.threadID,
      () => {
        for (const item of storedPath) {
          fs.unlinkSync(item);
        }
      },
      event.messageID
    );
  } catch (error) {
    console.error(error);
    return api.sendMessage(
      "🚫 An error occurred while fetching data from Pinterest API.",
      event.threadID
    );
  }
};

module.exports.run = async function({ api, event }) {};

// const axios = require("axios");
// const fs = require("fs");

// module.exports.config = {
//   name: "pinterest",
//   version: "1.4",
//   // aliases: ["pin"],
//   hasPrefix: false,
//   role: 0,
//   credits: "Hazeyy",
//   description: "( 𝚂𝚎𝚊𝚛𝚌𝚑 𝙸𝚖𝚊𝚐𝚎𝚜 𝚘𝚗 𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝 )",
//   commandCategory: "𝚗𝚘 𝚙𝚛𝚎𝚏𝚒𝚡",
//   usage: "𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝 [ 𝚗𝚊𝚖𝚎 ] - [ 𝚊𝚖𝚘𝚞𝚗𝚝 ]",
//   cooldowns: 5,
// };

// module.exports.handleEvent = async function({ api, event }) {
//   if (!event || !event.body) return;

//   if (!(event.body.toLowerCase().indexOf("pinterest") === 0)) return;

//   const args = event.body.split(/\s+/);
//   args.shift();
//   let text = args.join(" ");
//   const search = text.split(">")[0].trim();
//   if (!search) {
//     return api.sendMessage(
//       "🤖 𝙷𝚎𝚕𝚕𝚘 𝚝𝚘 𝚞𝚜𝚎 𝙿𝚒𝚗𝚝𝚎𝚝𝚎𝚛𝚎𝚜𝚝.\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎: 𝙿𝚒𝚗 [ 𝚗𝚊𝚖𝚎 ] - [ 𝚊𝚖𝚘𝚞𝚗𝚝 ] \n\n𝙸𝚏 𝚗𝚘 𝚌𝚘𝚞𝚗𝚝 𝚄𝚜𝚎: 𝙿𝚒𝚗 [ 𝚗𝚊𝚖𝚎 ] 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎 5 𝚒𝚖𝚊𝚐𝚎𝚜 𝚠𝚒𝚝𝚑 𝚗𝚘 𝚌𝚘𝚞𝚗𝚝 𝚗𝚎𝚎𝚍𝚎𝚍.",
//       event.threadID
//     );
//   }
//   let count;
//   if (text.includes("-")) {
//     count = text.split("-")[1].trim();
//   } else {
//     count = 5;
//   }

//   try {
//     const response = await axios.get(
//       `https://code-merge-api-hazeyy01.replit.app/pinterest/api?search=${search}`
//     );
//     api.sendMessage(
//       "🕟 | 𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚘𝚗 𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...",
//       event.threadID
//     );

//     const data = response.data;
//     if (data.error) {
//       return api.sendMessage(data.error, event.threadID);
//     } else {
//       let attachment = [];
//       let storedPath = [];
//       for (let i = 0; i < data.count; i++) {
//         if (i == count) break;
//         let path =
//           __dirname + "/cache/" + Math.floor(Math.random() * 99999999) + ".jpg";
//         let pic = await axios.get(data.data[i], {
//           responseType: "arraybuffer",
//         });
//         fs.writeFileSync(path, pic.data);
//         storedPath.push(path);
//         attachment.push(fs.createReadStream(path));
//       }
//       api.sendMessage(
//         {
//           body: `🤖 𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 ( 𝐀𝐈 )\n\n🖋️ 𝐒𝐞𝐚𝐫𝐜𝐡: '${search}'\n\n» 𝙽𝚞𝚖𝚋𝚎𝚛: ${attachment.length} - ${data.count} «`,
//           attachment: attachment,
//         },
//         event.threadID,
//         () => {
//           for (const item of storedPath) {
//             fs.unlinkSync(item);
//           }
//         },
//         event.messageID
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     return api.sendMessage(
//       "🚫 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚍𝚊𝚝𝚊 𝚏𝚛𝚘𝚖 𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝 API.",
//       event.threadID
//     );
//   }
// };

// module.exports.run = async function({ api, event }) {};
