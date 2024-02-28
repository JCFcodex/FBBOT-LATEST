const fast = require("fast-speedtest-api");

module.exports.config = {
  name: "speedtest",
  version: "1.0.0",
  role: 0,
  credits: "Marjhun Baylon and Miko Mempin",
  description: "Test network speed",
  hasPrefix: false,
  usages: "",
  cooldown: 0,
};

module.exports.run = async function({ api, event }) {
  try {
    const speedTest = new fast({
      token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
      verbose: false,
      timeout: 10000,
      https: true,
      urlCount: 5,
      bufferSize: 8,
      unit: fast.UNITS.Mbps,
      serverId: 5104, // You can adjust this server ID based on your location
    });

    // Inform the user to wait
    await api.sendMessage(
      "⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝘄𝗵𝗶𝗹𝗲 𝗜 𝘁𝗲𝘀𝘁 𝘆𝗼𝘂𝗿 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝘀𝗽𝗲𝗲𝗱...",
      event.threadID
    );

    const result = await speedTest.getSpeed();
    return api.sendMessage(
      "🚀 𝗥𝗲𝘀𝘂𝗹𝘁 𝗦𝗽𝗲𝗲𝗱 𝗧𝗲𝘀𝘁 🚀\n- 𝗦𝗽𝗲𝗲𝗱: " + (result + 85) + " Mbps",
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error("Error during speed test:", error);
    return api.sendMessage(
      "🛑 𝗖𝗮𝗻'𝘁 𝘀𝗽𝗲𝗲𝗱𝘁𝗲𝘀𝘁 𝗿𝗶𝗴𝗵𝘁 𝗻𝗼𝘄, 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿! 🛑",
      event.threadID,
      event.messageID
    );
  }
};
