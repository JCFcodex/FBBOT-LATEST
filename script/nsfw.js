const fs = require("fs");
const path = require("path");
const nsfwDataPath = path.join(__dirname, "../threadData.json"); // Adjust the path accordingly

module.exports.config = {
  name: "nsfw",
  version: "1.0.0",
  role: 2,
  credits: "JC FAUSTINO",
  description: "Toggle NSFW status for the current thread/group",
  commandCategory: "Admin",
  usages: ["on", "off", "status"],
  usePrefix: false,
  cooldown: 1,
};

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

// Function to save NSFW data to file
function saveNSFWData(data) {
  try {
    fs.writeFileSync(nsfwDataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving NSFW data:", error);
  }
}

module.exports.run = async function({ api, event, args }) {
  try {
    const threadID = event.threadID;
    const nsfwData = loadNSFWData();

    // Ensure the thread has NSFW data
    if (!nsfwData.hasOwnProperty(threadID)) {
      nsfwData[threadID] = false; // Default to false if not present
      saveNSFWData(nsfwData);
    }

    if (
      args.length === 1 &&
      (args[0].toLowerCase() === "on" || args[0].toLowerCase() === "off")
    ) {
      // Toggle NSFW status
      nsfwData[threadID] = args[0].toLowerCase() === "on";
      saveNSFWData(nsfwData);

      const statusMessage =
        args[0].toLowerCase() === "on" ? "enabled" : "disabled";
      api.sendMessage(
        `✅ NSFW is now ${statusMessage} for this thread/group.`,
        threadID
      );
    } else if (args.length === 1 && args[0].toLowerCase() === "status") {
      // Check NSFW status
      const statusMessage = nsfwData[threadID] ? "enabled" : "disabled";
      api.sendMessage(
        `ℹ️ NSFW is currently ${statusMessage} for this thread/group.`,
        threadID
      );
    } else {
      api.sendMessage(
        "𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝘂𝘀𝗮𝗴𝗲. 𝗨𝘀𝗲 `𝗻𝘀𝗳𝘄 𝗼𝗻`, `𝗻𝘀𝗳𝘄 𝗼𝗳𝗳`, 𝗼𝗿 `𝗻𝘀𝗳𝘄 𝘀𝘁𝗮𝘁𝘂𝘀`.",
        threadID
      );
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
