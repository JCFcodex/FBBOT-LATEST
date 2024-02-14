// Command Template

// Import any necessary modules or libraries
// const exampleModule = require("example-module");

// Define the command properties
module.exports.config = {
  name: "test", // Command name
  version: "1.0.0", // Command version
  aliases: ["", ""],
  hasPrefix: false, // Whether to use the bot's prefix or not
  role: 2, // Permission level required (adjust as needed)
  credits: "Your Name", // Command author
  description: "Description of your command", // Brief description of what the command does
  usage: "example <parameter>", // Array of command usages
  cooldowns: 5, // Cooldown period in seconds
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // Your command logic goes here

    api.sendMessage("Hello, World!", event.threadID);
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
