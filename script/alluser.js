// Import any necessary modules or libraries
// const exampleModule = require("example-module");

// Define the command properties
module.exports.config = {
  name: "alluser", // Command name
  version: "1.0.0", // Command version
  aliases: ["userlist"],
  role: 0, // Permission level required (adjust as needed)
  credits: "Your Name", // Command author
  hasPrefix: true,
  description: "Get all usernames with UID in the group chat", // Brief description of what the command does
  usage: "[alluser]", // Array of command usages
  cooldown: 5, // Cooldown period in seconds
};

// Function to get the username for a given UID
async function getUserName(api, uid) {
  try {
    const userInfo = await api.getUserInfo(uid);

    // Check if gender is not null and name is not "Facebook user"
    if (
      userInfo &&
      userInfo[uid] &&
      userInfo[uid].gender !== null &&
      userInfo[uid].name.toLowerCase() !== "facebook user"
    ) {
      return userInfo[uid].name;
    }

    return null; // Filter out disabled accounts
  } catch (getUserInfoError) {
    console.error(`Error getting user info for UID ${uid}:`, getUserInfoError);
    return `User${uid}`;
  }
}

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // Your command logic goes here

    // Get the list of participants in the group
    const participants = await api.getThreadInfo(event.threadID);

    // Extract and format the usernames with UID, filtering out disabled accounts
    const usernamesWithUIDPromises = participants.participantIDs.map(
      async (uid) => {
        const userName = await getUserName(api, uid);

        // Filter out disabled accounts
        if (userName !== null) {
          return `🚀 ${userName}\nUID: ${uid}`;
        }

        return null;
      }
    );

    // Wait for all promises to resolve
    const filteredUsernamesWithUID = (
      await Promise.all(usernamesWithUIDPromises)
    ).filter((username) => username !== null);

    // Send the list of usernames with UID as a message
    const message =
      filteredUsernamesWithUID.length > 0
        ? `🌟 𝗔𝗹𝗹 𝘂𝘀𝗲𝗿𝘀 𝗶𝗻 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽:\n\n\n${filteredUsernamesWithUID.join(
            "\n\n"
          )}\n\n\n😊 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗞𝗨𝗟𝗨 𝗕𝗢𝗧 - 𝗖𝗛𝗔𝗧𝗕𝗢𝗧 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥! 🤖`
        : "𝗡𝗼 𝗮𝗰𝘁𝗶𝘃𝗲 𝘂𝘀𝗲𝗿𝘀 𝗳𝗼𝘂𝗻𝗱 𝗶𝗻 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽. 😕";

    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
