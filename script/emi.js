let url = "https://ai-tools.replit.app";
const { get } = require("axios"),
  fs = require("fs");
let f = __dirname + "/cache/emi.png";

module.exports = {
  config: {
    name: "emi",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Deku",
    description: "Generate image in emi",
    commandCategory: "AI",
    usages: "emi [prompt]",
    cooldowns: 15,
  },
  run: async function({ api, event, args }) {
    function r(msg) {
      api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return r("Missing prompt!");

    const a = args.join(" ");
    if (!a) return r("Missing prompt!");
    try {
      api.sendMessage(
        "Generating your request. Please wait... ⏳",
        event.threadID,
        event.messageID
      );
      const d = (
        await get(url + "/emi?prompt=" + a, {
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(f, Buffer.from(d, "utf8"));
      return r({ attachment: fs.createReadStream(f, () => fs.unlinkSync(f)) });
    } catch (e) {
      return r(e.message);
    }
  },
};
