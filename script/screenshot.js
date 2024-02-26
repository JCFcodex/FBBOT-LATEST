// Import any necessary modules or libraries
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Define the command properties
module.exports.config = {
  name: "screenshot", // Command name
  version: "1.0.0", // Command version
  aliases: ["ss", "capture"],
  hasPrefix: true, // Whether to use the bot's prefix or not
  role: 0, // Permission level required (adjust as needed)
  credits: "JC FAUSTINO", // Command author
  description: "Takes a screenshot of a provided URL", // Brief description of what the command does
  usage: "screenshot <url>", // Array of command usages
  cooldowns: 5, // Cooldown period in seconds
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // Your command logic goes here
    const url = args[0]; // Assuming the URL is the first argument
    api.sendMessage("Please wait, taking screenshot... 📸", event.threadID);
    const response = await axios.get(
      `https://api.popcat.xyz/screenshot?url=${url}`,
      { responseType: "arraybuffer" }
    );
    const imagePath = path.join(__dirname, "/cache/screenshot.jpg");
    fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

    if (fs.existsSync(imagePath)) {
      const attachment = fs.createReadStream(imagePath);
      api.sendMessage(
        {
          body: "Here's your screenshot! 🖼️",
          attachment,
        },
        event.threadID
      );
      fs.unlinkSync(imagePath);
    } else {
      api.sendMessage(
        "Sorry, I couldn't create the screenshot. 😞",
        event.threadID
      );
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};

// module.exports.handleReply = async function({ api, event, handleReply }) {
//   // if theres need to handle the reply
// };
