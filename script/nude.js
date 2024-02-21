// Import any necessary modules or libraries
const axios = require("axios");
const fs = require("fs");
const path = require("path"); // Add path module for file operations
const nsfwDataPath = path.join(__dirname, "../threadData.json"); // Adjust the path accordingly
const global = require("../config.json");

// Function to load NSFW data from file
function loadNSFWData() {
  try {
    const nsfwData = fs.readFileSync(nsfwDataPath, "utf-8");
    return nsfwData ? JSON.parse(nsfwData) : {};
  } catch (error) {
    console.error("Error loading NSFW data:", error);
    return {};
  }
}

// Define the command properties
module.exports.config = {
  name: "nude", // Command name
  version: "1.0.0", // Command version
  role: 0, // Permission level required (adjust as needed)
  credits: "JC FAUSTINO", // Command author
  description: "Sends a random nude picture of a girl to the group chat 🌸", // Brief description of what the command does
  commandCategory: "nsfw", // Category of the command
  usages: "", // Array of command usages
  hasPrefix: true, // Whether to use the bot's prefix or not
  cooldown: 5, // Cooldown period in seconds
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const nsfwData = loadNSFWData();

  // Check if the thread is allowed to use the NSFW command
  if (!nsfwData.hasOwnProperty(threadID) || !nsfwData[threadID]) {
    api.sendMessage(
      "❌ 𝗧𝗵𝗶𝘀 𝘁𝗵𝗿𝗲𝗮𝗱 𝗶𝘀 𝗻𝗼𝘁 𝗮𝗹𝗹𝗼𝘄𝗲𝗱 𝘁𝗼 𝘂𝘀𝗲 𝗡𝗦𝗙𝗪 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.",
      threadID
    );
    return;
  }

  try {
    // Your command logic goes here
    const links = [
      "https://i.imgur.com/T5BPkRG.jpg",
      "https://i.imgur.com/69MT3Wg.jpg",
      "https://i.imgur.com/z6EtvVm.jpg",
      "https://i.imgur.com/hf3KluZ.jpg",
      "https://i.imgur.com/9XxaYI3.jpg",
      "https://i.imgur.com/rCSoCaA.jpg",
      "https://i.imgur.com/6olWIAr.jpg",
      "https://i.imgur.com/AcKfCpt.jpg",
      "https://i.imgur.com/OA6wMjp.jpg",
      "https://i.imgur.com/WBUspj9.jpg",
      "https://i.imgur.com/GBzR0aY.jpg",
      "https://i.imgur.com/EefsUX3.jpg",
      "https://i.imgur.com/kWqwF1K.jpg",
      "https://i.imgur.com/tUee6NZ.jpg",
      "https://i.imgur.com/NJSUN9k.jpg",
      "https://i.imgur.com/GxPSGo9.jpg",
      "https://i.imgur.com/junGPIa.jpg",
      "https://i.imgur.com/fj0WV5S.jpg",
      "https://i.imgur.com/trR1T6P.jpg",
      "https://i.imgur.com/5GPy7MZ.jpg",
      "https://i.imgur.com/kPpcoFe.jpg",
      "https://i.imgur.com/DibHjLg.jpg",
      "https://i.imgur.com/lzY1HP3.jpg",
      "https://i.imgur.com/z7oHPeD.jpg",
      "https://i.imgur.com/2kW0UrZ.jpg",
      "https://i.imgur.com/2TJXTM8.jpg",
      "https://i.imgur.com/hHkxDMt.jpg",
      "https://i.imgur.com/H7vs8c6.jpg",
      "https://i.imgur.com/jVSz5tX.jpg",
      "https://i.imgur.com/vF32mr2.jpg",
      "https://i.imgur.com/BoJDDpm.jpg",
      "https://i.imgur.com/GbAkVR3.jpg",
      "https://i.imgur.com/aMw2mEz.jpg",
      "https://i.imgur.com/egPMyvA.jpg",
      "https://i.imgur.com/OPZDGUY.jpg",
      "https://i.imgur.com/dxbjwmx.jpg",
      "https://i.imgur.com/FNQQETm.jpg",
      "https://i.imgur.com/hT7bbZr.jpg",
      "https://i.imgur.com/0Eg5ZN4.jpg",
      "https://i.imgur.com/Qle3LJi.jpg",
      "https://i.imgur.com/pzJq8ay.jpg",
      "https://i.imgur.com/NyqSI83.jpg",
      "https://i.imgur.com/p41qMvY.jpg",
      "https://i.imgur.com/p7EiSkE.jpg",
      "https://i.imgur.com/JYUOHUd.jpg",
      "https://i.imgur.com/cWxtrc2.jpg",
      "https://i.imgur.com/2pSSMtl.jpg",
      "https://i.imgur.com/DAnirH8.jpg",
      "https://i.imgur.com/8XyrCGu.jpg",
      "https://i.imgur.com/I7rtkwT.jpg",
      "https://i.imgur.com/KCo1P0u.jpg",
      "https://i.imgur.com/GLIwmQk.jpg",
      "https://i.imgur.com/Mue8s3E.jpg",
      "https://i.imgur.com/Fak0Ahg.jpg",
      "https://i.imgur.com/EDsi80I.jpg",
      "https://i.imgur.com/JvVpF6W.jpg",
      "https://i.imgur.com/I3CE748.jpg",
      "https://i.imgur.com/CH0PxJP.jpg",
      "https://i.imgur.com/3T1q41U.jpg",
      "https://i.imgur.com/WD3uX9V.jpg",
      "https://i.imgur.com/7sS6lji.jpg",
      "https://i.imgur.com/kFAfAC3.jpg",
      "https://i.imgur.com/EpyMadP.jpg",
      "https://i.imgur.com/9AJt2Tt.jpg",
      "https://i.imgur.com/55EbaeY.jpg",
      "https://i.imgur.com/xRJSAmJ.jpg",
      "https://i.imgur.com/kXA2fSX.jpg",
      "https://i.imgur.com/dy1YlJs.jpg",
      "https://i.imgur.com/0LlpoXG.jpg",
      "https://i.imgur.com/Kof1KXr.jpg",
      "https://i.imgur.com/xIgnYGo.jpg",
      "https://i.imgur.com/4cFgFZq.jpg",
      "https://i.imgur.com/d8k4a6G.jpg",
      "https://i.imgur.com/eraz44H.jpg",
      "https://i.imgur.com/uSHLM8y.jpg",
      "https://i.imgur.com/2iy9KnD.jpg",
      "https://i.imgur.com/Aew0gjm.jpg",
      "https://i.imgur.com/sxXm5cI.jpg",
      "https://i.imgur.com/2or8urJ.jpg",
      "https://i.imgur.com/cslJLNt.jpg",
      "https://i.imgur.com/zQztjGM.jpg",
      "https://i.imgur.com/dyluWmm.jpg",
      "https://i.imgur.com/CgAc5ux.jpg",
      "https://i.imgur.com/Z5ph1wc.jpg",
      "https://i.imgur.com/0bRLqAR.jpg",
      "https://i.imgur.com/x68KtYI.jpg",
      "https://i.imgur.com/cAich41.jpg",
      "https://i.imgur.com/BMcYATY.jpg",
      "https://i.imgur.com/E9PYK7J.jpg",
      "https://i.imgur.com/1oaM7ai.jpg",
      "https://i.imgur.com/Urx9Ijl.jpg",
      "https://i.imgur.com/QYGOZuK.jpg",
    ];

    const randomIndex = Math.floor(Math.random() * links.length);
    const randomLink = links[randomIndex];

    // Download the image
    const response = await axios.get(randomLink, { responseType: "stream" });
    const imagePath = path.join(__dirname, "/cache/nude.jpg");
    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    }).then(async () => {
      // Send the image as a readable stream along with the message
      const attachment = fs.createReadStream(imagePath);
      const result = await api.sendMessage(
        {
          body:
            "🌸 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗿𝗮𝗻𝗱𝗼𝗺 𝗻𝘂𝗱𝗲 𝗴𝗶𝗿𝗹 𝗽𝗶𝗰𝘁𝘂𝗿𝗲\n\n😊 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗞𝗨𝗟𝗨 𝗕𝗢𝗧 - 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥! 🤖\n\nPicture will unsend in 10 seconds.",
          attachment,
        },
        event.threadID
      );

      // Delete the help.png file after sending the image
      fs.unlinkSync(imagePath);

      // Unsend the message after 20 seconds
      setTimeout(async () => {
        try {
          await api.unsendMessage(result.messageID);
        } catch (error) {
          console.error("Error while unsending message:", error);
        }
      }, 10000);
    });
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage("𝗔𝘆𝗮𝘄 𝗴𝘂𝗺𝗮𝗻𝗮 𝗽𝗮𝗿", event.threadID);
  }
};
