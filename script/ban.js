const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "ban",
  version: "1.7.0",
  credits: "JC FAUSTINO",
  role: 2,
  description: "Ban or unban a user from using commands",
  commandCategory: "Moderation",
  usages: ["ban add uid", "ban list", "ban remove uid"],
  hasPrefix: true,
  cooldown: 5,
};

async function getUserName(api, uid) {
  const userInfo = await api.getUserInfo(uid);
  return userInfo[uid]?.name || "Unknown";
}

module.exports.run = async function({ api, event, args }) {
  try {
    const historyPath = path.join(__dirname, "../data/history.json");
    const historyData = require(historyPath);

    const command = args[0];
    const mentionID = event.mentions[0]?.id || args[1];

    if (command === "list") {
      const bannedUsers = historyData.flatMap(
        (data) => data.blacklist || [] // Access 'blacklist' property if it exists, otherwise, default to an empty array
      );
      const userList = await Promise.all(
        bannedUsers.map(async (uid) => `${await getUserName(api, uid)}: ${uid}`)
      );

      const message = `Banned Users:\n${userList.join("\n")}`;
      return api.sendMessage(message, event.threadID);
    }

    if (command === "remove") {
      const uidToUnban = args[1];

      if (!uidToUnban) {
        return api.sendMessage(
          "Please provide a valid user ID to unban.",
          event.threadID
        );
      }

      const adminData = historyData[0]; // Assuming there is only one admin entry in the array
      if (!adminData || !adminData.blacklist.includes(uidToUnban)) {
        return api.sendMessage("This user is not banned.", event.threadID);
      }

      adminData.blacklist = adminData.blacklist.filter(
        (uid) => uid !== uidToUnban
      );
      fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2));

      return api.sendMessage(
        `User with UID ${uidToUnban} has been unbanned.`,
        event.threadID
      );
    }

    if (command === "add") {
      if (!mentionID || !/^\d+$/.test(mentionID)) {
        return api.sendMessage(
          "Please provide a valid user ID to ban.",
          event.threadID
        );
      }

      const adminData = historyData[0]; // Assuming there is only one admin entry in the array
      if (adminData.blacklist.includes(mentionID)) {
        return api.sendMessage("This user is already banned.", event.threadID);
      }

      adminData.blacklist.push(mentionID);
      fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2));

      const userName = await getUserName(api, mentionID);
      return api.sendMessage(
        `User ${userName} with UID ${mentionID} has been banned.`,
        event.threadID
      );
    }

    return api.sendMessage(
      "Invalid usage. Use `ban add uid`, `ban list`, or `ban remove uid`.",
      event.threadID
    );
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    return api.sendMessage(
      "An error occurred while processing the command.",
      event.threadID
    );
  }
};
