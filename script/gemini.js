// Import any necessary modules or libraries
const axios = require('axios');

// Define the command properties
module.exports.config = {
  name: 'gemini', // Command name
  version: '1.0.0', // Command version
  aliases: [], // No aliases for this command
  hasPrefix: false, // Whether to use the bot's prefix or not
  role: 0, // Permission level required (adjust as needed)
  credits: 'Your Name', // Command author
  description: 'Generates a response based on an image and a prompt', // Brief description of what the command does
  usages: 'gemini <reply to image>', // Array of command usages
  cooldown: 5, // Cooldown period in seconds
};
let imageMsgID; // This is the message ID

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    if (event.type === 'message_reply') {
      if (event.messageReply.attachments[0]) {
        const attachment = event.messageReply.attachments[0];
        api.sendMessage(
          `🕟 | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚁𝚎𝚌𝚘𝚐𝚗𝚒𝚣𝚒𝚗𝚐 𝙸𝚖𝚊𝚐𝚎, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...`,
          event.threadID
        );
        if (attachment.type === 'photo') {
          const imageURL = attachment.url;
          imageMsgID = event.messageReply.messageID;
          convertImageToCaption(imageURL, api, event, args.join(' '));
          return;
        }
      }
    }

    // If the user didn't reply to an image or didn't provide a prompt, send an error message
    api.sendMessage(
      "Please reply to an image with the 'gemini' command and provide a prompt.",
      event.threadID
    );
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};

async function convertImageToCaption(imageURL, api, event, inputText) {
  try {
    const response = await axios.get(
      `https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=${encodeURIComponent(
        inputText
      )}&image_url=${encodeURIComponent(imageURL)}`
    );
    const caption = response.data.response;
    api.sendMessage(caption, event.threadID, imageMsgID);
  } catch (error) {
    console.error(`Error in the convertImageToCaption function:`, error);
  }
}
