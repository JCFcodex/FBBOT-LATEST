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
  cooldowns: 10, // Cooldown period in seconds
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // Your command logic goes here
    const url = args[0]; // Assuming the URL is the first argument
    api.sendMessage("Please wait, taking screenshot... 📸", event.threadID);

    // Download the screenshot
    const response = await axios.get(
      `https://api.popcat.xyz/screenshot?url=${url}`,
      { responseType: "stream" }
    );

    // Define the image path
    const imagePath = path.join(__dirname, "/cache/screenshot.jpg");

    // Create a writable stream
    const writer = fs.createWriteStream(imagePath);

    // Pipe the image data to the writer
    response.data.pipe(writer);

    // Return a Promise to handle the asynchronous operation
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    }).then(async () => {
      // Send the image as a readable stream along with the message
      const attachment = fs.createReadStream(imagePath);
      const result = await api.sendMessage(
        {
          body: "Here's your screenshot! 🖼️",
          attachment,
        },
        event.threadID,
        () => {
          // Unlink (delete) the screenshot file after sending
          fs.unlinkSync(imagePath);
        }
      );
    });
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage(
      "Sorry, an error occurred while taking the screenshot. 😞",
      event.threadID
    );
  }
};
