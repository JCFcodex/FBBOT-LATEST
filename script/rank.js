module.exports.config = {
  name: "rank",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  // aliases: ["game", "system"],
  description: "ranking",
  usage: "rank [info] to check your rank",
  credits: "Ainz",
};

let rankup = {};

module.exports.handleEvent = async function({ api, event, Experience }) {
  try {
    if (rankup[event.threadID] === false) {
      return;
    }

    if (event?.body && event.senderID == api.getCurrentUserID()) {
      return;
    }

    const { levelInfo, levelUp } = Experience;

    const rank = await levelInfo(event?.senderID);

    if (!rank || typeof rank !== "object") {
      return;
    }

    const { name, exp, level } = rank;

    if (exp % (10 * Math.pow(2, level - 1)) === 0) {
      await levelUp(event?.senderID);

      api.sendMessage(
        `🎉 Congratulations, ${name}!\n\nYou've leveled up to Level ${level +
          1}!\n🚀 Keep rocking and earning those XP points! 🌟`,
        event.threadID
      );

      // api.sendMessage(
      //   `🎉 Congratulations ${name}! \n\n 🚀 You've just soared to level ${level +
      //     1}! Keep it up!`,
      //   event.threadID
      // );
    }
  } catch (error) {
    console.log(error);
  }
};

const path = require("path");

module.exports.run = async function({ api, event, Experience, args }) {
  try {
    if (event?.body && event.senderID == api.getCurrentUserID()) {
      return;
    }

    const input = args.join(" ");

    if (!input) {
      api.sendMessage(
        "Invalid command usage. Rankup [info/list] to check your rank or view the rank list",
        event.threadID,
        event.messageID
      );
      return;
    }

    const { levelInfo } = Experience;

    switch (input) {
      case "info":
        const rankInfo = await levelInfo(event?.senderID);
        if (!rankInfo || typeof rankInfo !== "object") {
          return;
        }

        const { name, exp, level } = rankInfo;

        api.sendMessage(
          `Hi ${name}\n\nLevel: ${level}\nExperience Points: ${exp}\n\nTo advance to the next level, you need ${10 *
            Math.pow(2, level) -
            exp} more experience points.`,
          event.threadID,
          event.messageID
        );

        break;
      case "list":
        try {
          const userListData = require("../data/database.json");
          console.log("userListData:", userListData);

          if (
            !userListData ||
            !userListData[0] ||
            !userListData[0].Threads ||
            !userListData[0].Threads[event.threadID] ||
            !userListData[0].Threads[event.threadID].participantIDs ||
            !userListData[1] ||
            !userListData[1].Users
          ) {
            api.sendMessage(
              "Error retrieving user data.",
              event.threadID,
              event.messageID
            );
            return;
          }

          const threadParticipantIDs =
            userListData[0].Threads[event.threadID].participantIDs;

          const userList = userListData[1].Users.filter((user) =>
            threadParticipantIDs.includes(user.id)
          );

          const filteredUserList = userList
            .filter((user) => user.name.toLowerCase() !== "facebook user")
            .sort((a, b) => b.exp - a.exp);

          let rankListMessage = "🏆 𝗥𝗮𝗻𝗸 𝗟𝗶𝘀𝘁 🏆\n\n";
          for (let i = 0; i < filteredUserList.length; i++) {
            rankListMessage += `${i + 1}. ${
              filteredUserList[i].name
            }\n - Level: ${filteredUserList[i].level}\n - Exp: ${
              filteredUserList[i].exp
            }\n\n`;
          }

          api.sendMessage(rankListMessage, event.threadID, event.messageID);
        } catch (error) {
          console.error("Error reading user data:", error);
          api.sendMessage(
            "Error retrieving user data.",
            event.threadID,
            event.messageID
          );
        }
        break;
      default:
        api.sendMessage(
          "Invalid command usage. Rankup [info/list] to check your rank or view the rank list",
          event.threadID,
          event.messageID
        );
    }
  } catch (error) {
    console.log(error);
  }
};
