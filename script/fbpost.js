// // Import any necessary modules or libraries
// // const exampleModule = require("example-module");

// // Define the command properties
// module.exports.config = {
//   name: "fbpost", // Command name
//   version: "1.0.0", // Command version
//   aliases: ["post"], // Optional: Additional command aliases
//   hasPrefix: false, // Whether to use the bot's prefix or not
//   role: 0, // Permission level required (adjust as needed)
//   credits: "Your Name", // Command author
//   description: "Posts a message in the Facebook group", // Brief description of what the command does
//   usage: "fbpost <message>", // Array of command usages
//   cooldowns: 5, // Cooldown period in seconds (optional)
// };

// // Main function to execute when the command is called
// module.exports.run = async function({ api, event, args }) {
//   try {
//     if (args.length < 1) {
//       api.sendMessage("Please provide a message to post.", event.threadID);
//       return;
//     }

//     const message = args.join(" ");
//     const groupID = "7176488085805718"; // Replace with your actual group ID

//     // Use api.sendMessage to post the message to the group
//     api.sendMessage({ body: message, threadID: groupID }, (err, info) => {
//       if (err) {
//         console.error(`Error posting message: ${err}`);
//       } else {
//         console.log(`Message sent: ${info}`);
//       }
//     });
//   } catch (error) {
//     console.error(`Error in the ${module.exports.config.name} command:`, error);
//   }
// };

// // // Optional: Handle replies (if needed)
// // module.exports.handleReply = async function({ api, event, handleReply }) {
// //   // Implement reply handling logic here
// // };
