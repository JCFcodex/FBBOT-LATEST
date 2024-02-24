// const axios = require("axios");

// module.exports.config = {
//   name: "pi",
//   version: "1.0.0",
//   aliases: ["askpi", "ask"],
//   hasPrefix: false,
//   role: 2,
//   credits: "YourName",
//   description: "Ask the AI anything using the pi API",
//   usage: ["pi <question>", "pi reset"],
//   cooldown: 5,
// };

// module.exports.run = async function({ api, event, args }) {
//   try {
//     if (args.length === 0) {
//       api.sendMessage(
//         "Please provide a question or use 'pi reset' to reset the conversation.",
//         event.threadID
//       );
//       return;
//     }

//     const command = args[0].toLowerCase();

//     if (command === "reset") {
//       // Handle reset command
//       await resetConversation(api, event);
//     } else {
//       // Handle ask command
//       const question = args.join(" ");
//       await askPi(api, event, question);
//     }
//   } catch (error) {
//     console.error(`Error in the ${module.exports.config.name} command:`, error);
//   }
// };

// module.exports.handleReply = async function({ api, event, handleReply }) {
//   // Handle any replies if needed
// };

// async function askPi(api, event, question) {
//   const apiUrl = "https://pi.aliestercrowley.com/api";

//   // Make a request to the API with the provided question
//   const response = await axios.get(
//     `${apiUrl}?prompt=${encodeURIComponent(question)}&uid=${event.senderID}`
//   );

//   if (response.status === 200 && response.data) {
//     // Process the response from the API
//     const answer = response.data.answer || "No response from the AI.";
//     api.sendMessage(`🤖 AI Response: ${answer}`, event.threadID);
//   } else {
//     api.sendMessage("Error communicating with the AI.", event.threadID);
//   }
// }

// async function resetConversation(api, event) {
//   const resetUrl = "https://pi.aliestercrowley.com/api/reset";

//   // Make a request to reset the conversation session
//   const response = await axios.get(`${resetUrl}?uid=${event.senderID}`);

//   if (response.status === 200 && response.data && response.data.success) {
//     api.sendMessage(
//       "🔄 Conversation session reset successfully.",
//       event.threadID
//     );
//   } else {
//     api.sendMessage(
//       "Error resetting the conversation session.",
//       event.threadID
//     );
//   }
// }
