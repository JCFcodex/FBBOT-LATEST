module.exports.config = {
  name: "antitag",
  version: "1.0.0",
  // role: 2,
  // credits: "John Arida",
  // description: "Bot will rep ng tag admin or rep ng tagbot ",
  // commandCategory: "Other",
  // usage: "",
  // hasPrefix: true,
  // cooldowns: 5,
};

module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100076613706558") {
    var aid = ["100076613706558"];

    for (const id of aid) {
      if (event.mentions && event.mentions[id]) {
        var msg = [
          "Babe nalang iatawag mo sakanya",
          "Stop mentioning my creator, he's busy 😗",
          "My Creator is currently offline 😢",
          "Tag him again and 𝗂 𝗐𝗂𝗅𝗅 𝗉𝗎𝗇𝖼𝗁 𝗒𝗈𝗎 🙂",
          "busy pa ata yun kaya mag-antay ka",
          "Sorry, naka bebetime pa don't disturb him 🙄",
          "Do you like my creator thats why your tagging him? Why dont you add him https://www.facebook.com/profile.php?id=100076613706558 😏",
          "Another tag in my Creator, i will kick your fucking ass",
        ];
        api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        return api.sendMessage(
          { body: msg[Math.floor(Math.random() * msg.length)] },
          event.threadID,
          event.messageID
        );
      }
    }
  }
};

// module.exports.run = async function({}) {
//   // Your run logic here, it's currently empty
// };
