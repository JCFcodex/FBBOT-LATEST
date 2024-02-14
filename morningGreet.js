const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const pathFile = path.join(__dirname, "script", "cache", "restart.txt");

module.exports = async ({ api }) => {
  const threadsToSendGreeting = [
    "5776059305779745",
    "7133477510012986",
    "5450951238260571",
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

  const greet = async (threadID) => {
    const threadName = await getThreadName(threadID);
    const greetingMessage = getRandomMessage().replace(
      "${threadName}",
      threadName
    );
    const greetingImageLink = "https://imgur.com/acocFI4.png";
    const imagePath = path.join(__dirname, "script", "cache", "greet.png");

    await downloadImage(greetingImageLink, imagePath);

    const attachment = fs.createReadStream(imagePath);
    api.sendMessage(
      {
        body: `✨ -MORNING AUTOGREET- ✨\n\n${greetingMessage}`,
        attachment,
      },
      threadID,
      (err) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        if (err) return console.error("Error sending message:", err);
        console.log("AUTOGREET SUCCESSFULLY SENT");
      }
    );
  };

  const task = cron.schedule(
    "0 6 * * *",
    async () => {
      await Promise.all(
        threadsToSendGreeting.map((threadID) => greet(threadID))
      );
    },
    {
      timezone: "Asia/Manila",
    }
  );

  console.log("MorningGreet is running");

  if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, "false");
  const isEnable = fs.readFileSync(pathFile, "utf-8");
  if (isEnable == "true") {
    threadsToSendGreeting.forEach((threadID) => {
      api.sendMessage(
        "🚀 𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆! 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗯𝗮𝗰𝗸! 🎉",
        threadID
      );
    });
    fs.writeFileSync(pathFile, "false");
  }
};
