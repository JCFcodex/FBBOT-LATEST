const fs = require("fs");
const auto = require("../auto");

module.exports.config = {
  name: "gtoken", // Command name
  version: "1.0.0", // Command version
  aliases: ["updatetoken", "settoken"],
  hasPrefix: false, // Whether to use the bot's prefix or not
  role: 3, // Permission level required (adjust as needed)
  credits: "JC FAUSTINO", // Command author
  description: "Description of your command", // Brief description of what the command does
  usage: "gtoken <value>", // Array of command usages
  cooldowns: 5, // Cooldown period in seconds
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Check if the correct number of arguments is provided
    if (args.length !== 1) {
      api.sendMessage(
        "Invalid number of arguments. Usage: gtoken <value>",
        event.threadID
      );
      return;
    }

    // Set the new token value
    const newToken = args[0];
    auto.setToken(newToken);

    api.sendMessage(`Token has been updated to: ${newToken}`, event.threadID);
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
