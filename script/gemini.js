// Import any necessary modules or libraries
const axios = require('axios');

// Define the command properties
module.exports.config = {
  name: 'gemini', // Command name
  version: '1.0.0', // Command version
  aliases: ['gmn'], // No aliases for this command
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
    if (!args || args.length === 0) {
      // Send a message asking the user to provide a prompt or reply to an image
      api.sendMessage(
        "Please reply to an image with the 'gemini' command and provide a prompt.",
        event.threadID
      );
      return;
    }

    if (event.type === 'message_reply') {
      if (event.messageReply.attachments[0]) {
        const attachment = event.messageReply.attachments[0];
        api.sendMessage(
          `🕟 | ɢᴇᴍɪɴɪ ᴀɪ ʀᴇᴄᴏɢɴɪᴢɪɴɢ ɪᴍᴀɢᴇ. ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...`,
          event.threadID
        );
        if (attachment.type === 'photo') {
          const imageURL = attachment.url;
          imageMsgID = event.messageReply.messageID;
          convertImageToCaption(imageURL, api, event, args.join(' '));
          return;
        } else {
          // If the user didn't reply to an image or didn't provide a prompt, send an error message
          api.sendMessage(
            "Please reply to an image with the 'gemini' command and provide a prompt.",
            event.threadID
          );
          return;
        }
      }
    }

    api.sendMessage(
      `🕟 | ᴀɴꜱᴡᴇʀɪɴɢ ʏᴏᴜʀ Qᴜᴇꜱᴛɪᴏɴ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...`,
      event.threadID
    );

    responseToPrompt(api, event, args.join(' '));
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
    if (error.response && error.response.status === 500) {
      // Handle the error when the request fails with status code 500
      api.sendMessage(
        'There was an error processing the image. It may be inappropriate or contain sensitive content. Please try again later.',
        event.threadID
      );
    } else {
      // Handle other errors
      console.error(`Error in the convertImageToCaption function:`, error);
    }
  }
}

async function responseToPrompt(api, event, inputText) {
  try {
    const response = await axios.get(
      `https://hazee-gemini-pro-vision-12174af6c652.herokuapp.com/gemini-vision?text=${encodeURIComponent(
        inputText
      )}`
    );
    const caption = response.data.response;
    api.sendMessage(caption, event.threadID, imageMsgID);
  } catch (error) {
    console.error(`Error in the responseToPrompt function:`, error);
  }
}
