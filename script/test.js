const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "test",
  version: "1.1.0",
  role: 2,
  description:
    "Sends a message to all groups and can only be done by the admin.",
  hasPrefix: false,
  aliases: ["noti"],
  usages: "[Text]",
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const msg = [
    "Pumasok na kayo mga bu gok, baka mamaya mag-attendance check si teacher at wala kayong maipakita kundi 'seen' lang!",
    "Hoy, mga bugok! Kapit lang, magkasama tayo sa struggle bus papuntang academic excellence!",
    "Tara na mga ka-bugok, ipakita natin ang full support sa subject na 'How to be a Certified Bugok 101'!",
    "Attention mga ka-bugok, it's time to shine! Show your virtual presence para di kayo mabansagan na 'invisible pero present sa GC'!",
    "Pssst! Mga bugok, time to switch from 'online gamer' mode to 'responsible student' mode. Game on sa klase!",
    "Alerto, mga ka-bugok! Magtago na kayo sa Zoom screen para kunwari attentive tayo sa klase. Charot!",
  ];

  function getContentRandom() {
    const randomIndex = Math.floor(Math.random() * msg.length);
    return msg[randomIndex];
  }

  // Example usage:
  const randomMessage = getContentRandom();
  console.log(randomMessage);

  try {
    const content = `pumasok na kayo mga bu gok`;
    const languageToSay = "tl";
    const pathFemale = path.resolve(
      __dirname,
      "cache",
      `${event.threadID}_female.mp3`
    );

    await downloadFile(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        randomMessage
      )}&tl=${languageToSay}&client=tw-ob&idx=1`,
      pathFemale
    );
    api.sendMessage(
      { attachment: fs.createReadStream(pathFemale) },
      event.threadID,
      () => fs.unlinkSync(pathFemale)
    );
  } catch (error) {
    console.error("Error sending a message:", error);
  }
};

async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
