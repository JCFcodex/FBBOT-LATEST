const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const morningGreetFile = path.join(__dirname, "cache", "morningGreet.txt");

module.exports = async ({ api }) => {
  const threadsToSendGreeting = [
    // "5776059305779745",
    "7133477510012986",
    // "5450951238260571",
  ];
  const greetingMessages = [
    "✨The paths and ways may be different and may always change your views, but your ultimate goal should be firm. Good morning, have a productive day, ${threadName}! 🛤️🚀",
    "✨No matter how much you achieve, no matter if you become a superstar, be grounded and be prepared. Good morning, have a wonderful day ahead, ${threadName}! 🌟😊",
    "✨A new day brings new hopes and opportunities. So, get out of bed and strive to make your day a productive one. Good morning, lovely members of ${threadName}! ☀️🌸",
    "✨Happiness is a wonderful gift. It makes your day bright and cheerful and gives you the optimism to do new things in life. So, always be happy and have a very good morning, ${threadName}! 😄🌞",
    "✨A new day has begun, and with it have arrived new dreams and opportunities. May God provide you the strength and determination to fulfill all your dreams. Good morning, ${threadName}! 🌅🙏",
    "✨After every sunset, there is sunrise. So, do not get bogged down by your failures. Keep working hard, and you will surely achieve success one day. Good morning, ${threadName}! 🌇💪",
    "✨Start your day with a cup of coffee and a whole lot of optimism. Stay calm and stay positive, and you would surely do well in your interview. Good morning and good luck, ${threadName}! ☕🍀",
    // Add more greeting messages here...
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
      "Goodmorning mga bugok",
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

    const threadName = await getThreadName(threadID);
    // const greetingMessage = getRandomMessage().replace(
    //   "${threadName}",
    //   threadName
    // );

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
        body: `-ＭＯＲＮＩＮＧ ＡＵＴＯＧＲＥＥＴ-\n\n${greetingMessage}`,
        attachment,
      },
      threadID,
      (err) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        if (err) return console.error("Error sending message:", err);
        console.log("AUTOGREET SUCCESSFULLY SENT");
        fs.writeFileSync(morningGreetFile, "true");
      }
    );

    setTimeout(() => {
      voiceGreet(threadID);
    }, 5000);
  };

  const reset = cron.schedule(
    "0-30 5 * * *",
    async () => {
      fs.writeFileSync(morningGreetFile, "false");
    },
    {
      timezone: "Asia/Manila",
    }
  );

  const task = cron.schedule(
    "0-30 6 * * *",
    async () => {
      if (
        !fs.existsSync(morningGreetFile) ||
        fs.readFileSync(morningGreetFile, "utf-8") === "false"
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

  console.log("\nMorningGreet is running");
};
