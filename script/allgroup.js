module.exports.config = {
  name: "allgroup",
  version: "1.0.0",
  credits: "manhIT",
  role: 0,
  aliases: ["boxlist", "grouplist", "listbox"],
  description: "Sends a list of all groups the bot has joined.",
  hasPrefix: true,
  usage: "[allgroup]",
  cooldown: 5,
};

module.exports.run = async function({ api, event, client }) {
  var inbox = await api.getThreadList(100, null, ["INBOX"]);
  let list = [...inbox].filter((group) => group.isSubscribed && group.isGroup);

  var listthread = [];

  for (var groupInfo of list) {
    let data = await api.getThreadInfo(groupInfo.threadID);

    listthread.push({
      id: groupInfo.threadID,
      name: groupInfo.name,
      sotv: data.userInfo.length,
    });
  }

  var listbox = listthread.sort((a, b) => {
    if (a.sotv > b.sotv) return -1;
    if (a.sotv < b.sotv) return 1;
  });

  let msg = "",
    i = 1;
  for (var group of listbox) {
    msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🐸Member: ${
      group.sotv
    }\n\n`;
  }

  api.sendMessage(msg, event.threadID);
};
