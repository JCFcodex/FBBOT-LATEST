module.exports.config = {
  name: "dictionary",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["search"],
  description: "Search words dictionary",
  usage: "Ai [promot]",
  credits: "Develeoper",
  cooldown: 5,
};
module.exports.run = async function({ api, event, args }) {
  const input = args.join(" ");
  if (!input) {
    return api.sendMessage(
      "𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘄𝗼𝗿𝗱 𝘁𝗼 𝘀𝗲𝗮𝗿𝗰𝗵 𝗳𝗼𝗿.",
      event.threadID,
      event.messageID
    );
  }
  try {
    const response = await require("axios").get(
      encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
    );
    const data = response.data[0];
    const example = data.meanings[0].definitions.example;
    const phonetics = data.phonetics;
    const meanings = data.meanings;
    let msg_meanings = "";
    meanings.forEach((item) => {
      const definition = item.definitions[0].definition;
      const example = item.definitions[0].example
        ? `\n*𝗲𝘅𝗮𝗺𝗽𝗹𝗲:\n \"${item.definitions[0].example[0].toUpperCase() +
            item.definitions[0].example.slice(1)}\"`
        : "";
      msg_meanings += `\n• ${
        item.partOfSpeech
      }\n ${definition[0].toUpperCase() + definition.slice(1) + example}`;
    });
    let msg_phonetics = "";
    phonetics.forEach((item) => {
      const text = item.text ? `\n    /${item.text}/` : "";
      msg_phonetics += text;
    });
    const msg = `❰ ❝ ${data.word} ❞ ❱` + msg_phonetics + msg_meanings;
    api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    if (error.response?.status === 404) {
      api.sendMessage(
        `𝗡𝗼 𝗱𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 '${word}'.`,
        event.threadID,
        event.messageID
      );
    } else {
      api.sendMessage(
        "𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗱𝗲𝗳𝗶𝗻𝗶𝘁𝗶𝗼𝗻. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.",
        event.threadID,
        event.messageID
      );
    }
  }
};
