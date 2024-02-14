module.exports.config = {
  name: "out",
  version: "1.0.0",
  role: 1,
  hasPrefix: true,
  credits: "Developer",
  description: "Bot leaves the thread",
  usage: "out",
  cooldown: 10,
};

module.exports.run = async function({ api, event, args }) {
  try {
    const threadName = await api.getThreadInfo(event.threadID);
    const leaveMessage = `Goodbye, ${threadName.name}! 😢 The bot is leaving.`;

    // Send a sad message before leaving
    await api.sendMessage(leaveMessage, event.threadID);

    // Remove the bot from the group
    if (!args[0])
      return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    if (!isNaN(args[0]))
      return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
};
