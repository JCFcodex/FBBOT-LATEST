const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const eveningGreetFile = path.join(__dirname, "cache", "eveningGreet.txt");

module.exports = async ({ api }) => {
  const threadsToSendGreeting = [
    // "5776059305779745",
    "7133477510012986",
    // "5450951238260571",
  ];
  const greetingMessages = [
    "🌙 As the day comes to a close, take a moment to reflect on your achievements, ${threadName}. Good evening and relax! 🌌🌠",
    "🌙 The night sky is filled with possibilities. Wishing you a peaceful evening, ${threadName}. 🌃✨",
    "🌙 It's time to unwind and enjoy the serenity of the evening. Have a great one, ${threadName}! 🌆😌",
    "🌙 The stars are shining just for you, ${threadName}. Good evening, and may your night be filled with joy! 🌟🌙",
    "🌙 As the sun sets, embrace the tranquility of the night. Good evening, dear members of ${threadName}! 🌅🌠",

    // Add more evening greeting messages here...
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    return greetingMessages[randomIndex];
  };

  const getThreadName = async (threadID) => {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      if (threadInfo === null) {
        console.error("Thread info is null for thread ID:", threadID);
        return `GroupChat-${threadID}`;
      }
      return threadInfo.name || `GroupChat-${threadID}`;
    } catch (error) {
      console.error("Error fetching thread info:", error);
      return `GroupChat-${threadID}`;
    }
  };

  const downloadImage = async (imageUrl, imagePath) => {
    try {
      const response = await axios.get(imageUrl, { responseType: "stream" });
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading image:", error);
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

  async function voiceGreet(threadID) {
    const msg = [
      "Goodevening mga bugok",
      // "Hoy, mga bugok! Kapit lang, magkasama tayo sa struggle bus papuntang academic excellence!",
      // "Tara na mga ka-bugok, ipakita natin ang full support sa subject na 'How to be a Certified Bugok 101'!",
      // "Attention mga ka-bugok, it's time to shine! Show your virtual presence para di kayo mabansagan na 'invisible pero present sa GC'!",
      // "Pssst! Mga bugok, time to switch from 'online gamer' mode to 'responsible student' mode. Game on sa klase!",
      // "Alerto, mga ka-bugok! Magtago na kayo sa Zoom screen para kunwari attentive tayo sa klase. Charot!",
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
      const pathFemale = path.resolve(__dirname, "cache", `voice_female.mp3`);

      await downloadFile(
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          randomMessage
        )}&tl=${languageToSay}&client=tw-ob&idx=2`,
        pathFemale
      );
      api.sendMessage(
        { attachment: fs.createReadStream(pathFemale) },
        threadID
      );
    } catch (error) {
      console.error("Error sending a message:", error);
    }
  }

  const greet = async (threadID) => {
    const threadName = await getThreadName(threadID);
    const greetingMessage = getRandomMessage().replace(
      "${threadName}",
      threadName
    );
    const greetingImageLink = "https://imgur.com/acocFI4.png";
    const imagePath = path.join(__dirname, "cache", "greet.png");

    await downloadImage(greetingImageLink, imagePath);

    const attachment = fs.createReadStream(imagePath);
    api.sendMessage(
      {
        body: `-ＥＶＥＮＩＮＧ ＡＵＴＯＧＲＥＥＴ-\n\n${greetingMessage}`,
        attachment,
      },
      threadID,
      (err) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        if (err) return console.error("Error sending message:", err);
        console.log("AUTOGREET SUCCESSFULLY SENT");
        fs.writeFileSync(eveningGreetFile, "true");
      }
    );
    setTimeout(() => {
      voiceGreet(threadID);
    }, 5000);
  };

  const reset = cron.schedule(
    "0-30 17 * * *",
    async () => {
      fs.writeFileSync(eveningGreetFile, "false");
    },
    {
      timezone: "Asia/Manila",
    }
  );

  const task = cron.schedule(
    "0-30 18 * * *",
    async () => {
      if (
        !fs.existsSync(eveningGreetFile) ||
        fs.readFileSync(eveningGreetFile, "utf-8") === "false"
      ) {
        await Promise.all(
          threadsToSendGreeting.map((threadID) => greet(threadID))
        );
      }
    },
    {
      timezone: "Asia/Manila",
    }
  );

  console.log("EveningGreet is running\n");
};
