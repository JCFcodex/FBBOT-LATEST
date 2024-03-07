const axios = require("axios");

module.exports.config = {
  name: "player", // Command name
  version: "1.0.0", // Command version
  aliases: ["getplayer", "nbaplayer"],
  hasPrefix: true, // Assuming you use the bot's prefix
  role: 0, // Permission level required (adjust as needed)
  credits: "Your Name", // Command author
  description: "Get NBA player information", // Brief description of what the command does
  usage: "{pref}player <name>", // Command usage
  cooldown: 5, // Cooldown period in seconds
};

module.exports.run = async function({ api, event, args }) {
  try {
    const playerName = args.join(" ");

    if (!playerName) {
      return api.sendMessage(
        "Please provide a player firstname.",
        event.threadID
      );
    }

    const apiKey = "e5340ca9-0ee3-485e-9a02-ee7d980de447";
    const apiUrl = `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(
      playerName
    )}`;

    const headers = {
      Authorization: apiKey,
    };

    const response = await axios.get(apiUrl, { headers });

    if (response.data.data && response.data.data.length > 0) {
      const player = response.data.data[0];
      const team = player.team || {};

      const message = `🏀 Player Information 🏀\n\nName: ${player.first_name} ${
        player.last_name
      }\nPosition: ${player.position}\nHeight: ${player.height}\nWeight: ${
        player.weight
      }\nJersey Number: ${player.jersey_number}\n\nCollege: ${
        player.college
      }\nCountry: ${player.country}\nTeam: ${team.full_name || "N/A"}`;

      api.sendMessage(message, event.threadID);
    } else {
      api.sendMessage(
        "Player not found. Please try providing only the player's first name.",
        event.threadID
      );
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage(
      "An error occurred while fetching player information.",
      event.threadID
    );
  }
};
