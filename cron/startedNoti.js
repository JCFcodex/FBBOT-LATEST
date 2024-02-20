const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cron = require("node-cron");

const schedule = require("./src/schedule.json"); // Your schedule file

const threadID = "7133477510012986"; // Your thread ID 7133477510012986 / 5776059305779745
const timezone = "Asia/Manila"; // Your timezone

const motivationMsg = [
  "- Good luck and enjoy the class! 🌟",
  "- Embrace the challenges, they're stepping stones to success! 🚀",
  "- Remember, every error is an opportunity to learn and grow! 💡",
  "- You're not just coding, you're crafting solutions. Keep going! 👩‍💻👨‍💻",
  "- Each line of code you write is a step closer to becoming a coding maestro! 🎶",
  "- Mistakes are proof that you're trying. Keep coding fearlessly! 🛠️",
  "- Your code may have bugs, but your determination should be bug-free! 🐜❌",
  "- Celebrate small victories in your coding journey! They add up! 🎉",
  "- Success is not just about the destination; enjoy the coding journey! 🗺️",
  "- You're not just an IT student; you're a future tech wizard! 🔮",
  "- Coffee, code, conquer! ☕💻🚀",
  "- Stay curious and keep exploring the vast world of programming! 🌐",
  "- Challenges are opportunities in disguise. Unleash your problem-solving skills! 🔍",
  "- Debugging is like detective work; enjoy the thrill of solving the mystery! 🕵️‍♂️",
  "- Code with passion, and success will follow suit! ❤️💻",
  "- Learning to code is like leveling up in a game—each challenge makes you stronger! 🎮💪",
  "- Your coding journey is uniquely yours; embrace it and make it legendary! 🏰✨",
  "- Continuous improvement is the key. Keep coding, keep evolving! 🔄🚶‍♂️",
  "- Programming is not just about syntax; it's about creating a digital masterpiece! 🎨👾",
  "- Remember, the best coders are the best problem solvers. You're on the right path! 🤔💼",
];

function logInfo(message) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
}

function getRandomMotivationMessage() {
  return motivationMsg[Math.floor(Math.random() * motivationMsg.length)];
}

function formatMessage(subject, time, messageType) {
  let message;

  if (messageType === "start") {
    message = `🚀 ＣＬＡＳＳ ＳＴＡＲＴＥＤ 🚀\n\n\n𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${subject} 📚\n\n𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗧𝗶𝗺𝗲: ${convertTo12Hour(
      time
    )} ⏰\n\n\n`;
    message += `🌟 ${getRandomMotivationMessage()}\n\n`;

    console.log("CLASS STARTED SENT");
  }

  return message;
}

function convertTo24Hour(time) {
  console.log(`Converting time: ${time}`);
  if (!time.includes("am") && !time.includes("pm")) {
    if (time.includes(":")) {
      let [hours, minutes] = time.split(":");
      hours = hours.padStart(2, "0");
      minutes = minutes.padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      throw new Error(`Invalid time format: ${time}`);
    }
  }

  let [hours, minutes] = time.split(":");
  const period = minutes.slice(-2);
  minutes = minutes.slice(0, -2);

  if (period.toLowerCase() === "pm" && hours !== "12") {
    hours = Number(hours) + 12;
  } else if (period.toLowerCase() === "am" && hours === "12") {
    hours = "00";
  }

  hours = hours.toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function convertTo12Hour(time) {
  const [hour, minute] = time.split(":");

  let hours = parseInt(hour, 10);
  if (hours > 12) {
    hours -= 12;
  }

  return `${hours}:${minute}`;
}

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

async function sendMessage(api, subject, time, messageType) {
  try {
    const content = `tang ina nyo, pumasok na kayo!, nag start na ang ${subject}`;
    const languageToSay = "tl";
    const pathFemale = path.resolve(__dirname, "cache", `voice_female.mp3`);

    await downloadFile(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        content
      )}&tl=${languageToSay}&client=tw-ob&idx=1`,
      pathFemale
    );

    const voiceMessage = fs.createReadStream(pathFemale);
    const message = formatMessage(subject, time, messageType);

    // Sending the voice message directly as a readable stream
    api.sendMessage(
      {
        body: message,
        attachment: voiceMessage,
      },
      threadID
    );

    // Cleanup: Delete the temporary voice file after sending
    // fs.unlinkSync(pathFemale);
  } catch (error) {
    console.error("Error sending a message:", error);
  }
}

function scheduleOriginalReminder(
  api,
  subject,
  originalTime,
  day,
  hour,
  minute
) {
  const reminderMinute = (parseInt(minute, 10) + 1) % 60;
  const reminderHour =
    (parseInt(hour, 10) + Math.floor((parseInt(minute, 10) + 1) / 60)) % 24;
  const cronExpressionOriginal = `${reminderMinute} ${reminderHour} * * ${day.toUpperCase()}`;

  cron.schedule(
    cronExpressionOriginal,
    () => {
      sendMessage(api, subject, originalTime, "start");
    },
    { timezone }
  );
}

function scheduleClassStarted(api) {
  for (const day in schedule) {
    for (let time in schedule[day]) {
      logInfo(`Scheduling class started for time: ${time}`);
      const subject = schedule[day][time];
      const originalTime = time;

      time = convertTo24Hour(time);

      if (time === null) {
        logError(`Invalid time format for class started: ${time}`);
        continue;
      }

      const [hour, minute] = time.split(":");

      scheduleOriginalReminder(api, subject, originalTime, day, hour, minute);
    }
  }
}

module.exports = async ({ api }) => {
  logInfo("Class Started job is running");
  scheduleClassStarted(api);
};
