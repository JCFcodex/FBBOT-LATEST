const cron = require("node-cron");
const schedule = require("./schedule.json"); // Your schedule file

// latest

const threadID = "7133477510012986"; // Your thread ID
const timezone = "Asia/Manila"; // Your timezone

const motivationMsg = [
  "🌟 Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. You've got the power! 💪",
  "💡 Mistakes are proof that you are trying. Embrace challenges as opportunities to grow and learn. Keep pushing forward with determination! 🚀",
  "🌈 Your potential is endless. Don't limit your challenges; challenge your limits. Each hurdle is a chance to discover your capabilities! ✨",
  "📚 Education is the passport to the future, and tomorrow belongs to those who prepare for it today. Keep investing in your future success! 🌟",
  "🚀 Dream big, work hard, stay focused. Your efforts today are laying the foundation for the extraordinary achievements of tomorrow. Keep going! 💼",
  "🔥 Remember, the only way to do great work is to love what you do. Find passion in your studies, and success will follow. You're on the right path! 🌟",
  "🎓 Education is the key to unlock the golden door of freedom. Keep unlocking doors with your commitment to learning and growing! 🗝️",
  "🌟 Success is not final, failure is not fatal: It is the courage to continue that counts. Your resilience in the face of challenges is shaping your success story! 📜",
  "💪 Every small step you take today is a giant leap toward a brighter future. Keep moving forward, and you'll reach heights you never thought possible! 🌄",
  "🚀 You are capable of more than you know. Push yourself beyond your limits, and you'll discover new heights of achievement. Believe in your potential! 🚁",
  // Add more motivational messages
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

  if (messageType === "reminder") {
    message = `⏰ ＲＥＭＩＮＤＥＲ ⏰\n\n\n𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${subject} 📚\n\n𝗧𝗵𝗲 𝗰𝗹𝗮𝘀𝘀 𝘄𝗶𝗹𝗹 𝘀𝘁𝗮𝗿𝘁 𝗮𝘁: ${convertTo12Hour(
      time
    )} ⏰\n\n`;
    // message += `🌟 ${getRandomMotivationMessage()}\n\n`;
    console.log("REMINDER SENT");
  } else if (messageType === "start") {
    message = `🚀 ＣＬＡＳＳ ＳＴＡＲＴＥＤ 🚀\n\n\n𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${subject} 📚\n\n𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗧𝗶𝗺𝗲: ${convertTo12Hour(
      time
    )} ⏰\n\n\n\n\n`;

    const goodLuckMessage = "-Good luck and enjoy the class! 🌟";
    message += goodLuckMessage;

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
      console.error(`Invalid time format: ${time}`);
      return null;
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

function sendMessage(api, subject, time, messageType) {
  const message = formatMessage(subject, time, messageType);
  api.sendMessage(message, threadID);
}

function scheduleReminder(api, subject, originalTime, day, hour, minute) {
  const reminderMinute = (parseInt(minute, 10) - 10 + 60) % 60;
  const reminderHour =
    (parseInt(hour, 10) + Math.floor((parseInt(minute, 10) - 10 ) / 60) + 24) %
    24;

  const cronExpressionReminder = `${reminderMinute} ${reminderHour} * * ${day.toUpperCase()}`;

  cron.schedule(
    cronExpressionReminder,
    () => {
      sendMessage(api, subject, originalTime, "reminder");
    },
    { timezone }
  );
}

function scheduleOriginalReminder(
  api,
  subject,
  originalTime,
  day,
  hour,
  minute
) {
  const cronExpressionOriginal = `${minute} ${hour} * * ${day.toUpperCase()}`;

  cron.schedule(
    cronExpressionOriginal,
    () => {
      sendMessage(api, subject, originalTime, "start");
    },
    { timezone }
  );
}

function scheduleReminders(api) {
  for (const day in schedule) {
    for (let time in schedule[day]) {
      logInfo(`Scheduling reminder for time: ${time}`);
      const subject = schedule[day][time];
      const originalTime = time;

      time = convertTo24Hour(time);

      if (time === null) {
        logError(`Invalid time format for reminder: ${time}`);
        continue;
      }

      const [hour, minute] = time.split(":");

      scheduleReminder(api, subject, originalTime, day, hour, minute);
      scheduleOriginalReminder(api, subject, originalTime, day, hour, minute);
    }
  }
}

module.exports = async ({ api }) => {
  logInfo("Schedule job is running");
  scheduleReminders(api);
};
