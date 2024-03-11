const path = require('path');
const fs = require('fs');
const pathFile = path.join('script', 'cache', 'restart.txt');
const global = require('../config.json');

module.exports = async ({ api }) => {
  const threadsToSendGreeting = ['5776059305779745']; //7133477510012986 and 5776059305779745

  if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, 'true');
  const isEnable = fs.readFileSync(pathFile, 'utf-8');

  if (isEnable == 'true') {
    try {
      const promises = threadsToSendGreeting.map(async (threadID) => {
        const restartMsg = await api.sendMessage(
          `🚀 𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!🎉\n\nSorry for any inconvenience caused by the auto restart. If you had any pending requests, feel free to resend them now, and the bot will be happy to assist you. 🤖✨\n\n\n-Admin: ${global.BOTADMIN}`,
          threadID
        );

        // Delay before unsending the message (adjust the delay time as needed)
        setTimeout(async () => {
          await api.unsendMessage(restartMsg.messageID);
        }, 1800000); // 30mins
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending or unsending messages:', error.message);
    }

    // fs.writeFileSync(pathFile, "false");  // Uncomment this line if needed
  }
};
