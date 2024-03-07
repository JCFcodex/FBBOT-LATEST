const path = require('path');
const fs = require('fs');

// Function to convert seconds to formatted time
function secondsToTime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  let formattedTime = '';
  if (days > 0) formattedTime += `${days} day${days > 1 ? 's' : ''} `;
  if (hours > 0) formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (minutes > 0)
    formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
  if (remainingSeconds > 0)
    formattedTime += `${remainingSeconds} second${
      remainingSeconds > 1 ? 's' : ''
    }`;

  return formattedTime.trim();
}

// Command properties
module.exports.config = {
  name: 'servertime',
  version: '1.0.0',
  // aliases: [],
  hasPrefix: false,
  role: 0,
  credits: 'JC FAUSTINO',
  description: 'Displays the server time.',
  usages: ['servertime'],
  cooldown: 5,
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // Read the total seconds from the JSON file (assuming it's named "timer.json")
    const filePath = path.join(__dirname, '../cron', 'src', 'timer.json');
    let totalSeconds = 1;

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      totalSeconds = parseInt(fileContent) || 1;
    }

    // Convert seconds to formatted time
    const formattedTime = secondsToTime(totalSeconds);

    // Send the formatted time as a message
    api.sendMessage(
      `Server has been running for:\n\n${formattedTime}`,
      event.threadID
    );
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
