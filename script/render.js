let url = "https://ai-tools.replit.app";
const { get } = require("axios"),
  fs = require("fs");
let f = __dirname + "/cache/render3d.png";

module.exports.config = {
  name: "render",
  version: "1.0.0",
  aliases: ["generate", "genimg"],
  role: 0,
  hasPrefix: true,
  credits: "Deku",
  description: "Generate image on Render 3D",
  commandCategory: "AI",
  usage: "[prompt]",
  cooldown: 15,
};

module.exports.run = async function({ api, event, args }) {
  function r(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  if (!args[0]) return r("Missing prompt!");

  const a = args.join(" ");
  if (!a) return r("Missing prompt!");
  try {
    const waitMessage = await api.sendMessage(
      "⌛ Please wait while rendering the request...",
      event.threadID
    );

    const d = (
      await get(url + "/render?prompt=" + a, {
        responseType: "arraybuffer",
      })
    ).data;

    fs.writeFileSync(f, Buffer.from(d, "utf8"));

    const stream = fs.createReadStream(f);

    stream.on("end", () => {
      // Delete the file after the stream ends
      fs.unlinkSync(f);
    });

    return Promise.all([
      r({ attachment: stream }),
      new Promise((resolve) => {
        api.unsendMessage(waitMessage.messageID, () => {
          resolve(); // Resolve the Promise when the unsendMessage is completed
        });
      }),
    ]);
  } catch (e) {
    return r(e.message);
  }
};
