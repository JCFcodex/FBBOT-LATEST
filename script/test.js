// // Define the command properties
// module.exports.config = {
//   name: 'test',
//   version: '1.0.0',
//   aliases: ['example'],
//   hasPrefix: false,
//   role: 0,
//   credits: 'Your Name',
//   description: 'Description of your command',
//   usages: 'example <parameter>',
//   cooldown: 5,
// };

// // Main function to execute when the command is called
// module.exports.run = async function({ api, event, args }) {
//   try {
//     // Start typing indicator
//     const stopTyping = api.sendTypingIndicator(event.threadID);

//     // Your command logic goes here
//     api.sendMessage('this is test of typingIndicator!', event.threadID);

//     // Stop typing indicator after a short delay
//     setTimeout(() => {
//       stopTyping();
//     }, 2000); // Adjust the duration as needed
//   } catch (error) {
//     console.error(`Error in the ${module.exports.config.name} command:`, error);
//   }
// };

// // module.exports.handleReply = async function({ api, event, handleReply }) {
// //   // If there's a need to handle the reply
// // };
