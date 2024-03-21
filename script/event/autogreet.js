// const cron = require("node-cron");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// // Define the messages for greetings
// const greetingMessages = [
//   "✨Some days are going to go okay, but hopefully some days are going to go as you wanted. Keep calm because the best is yet to happen. Good morning, dear members of ${threadName}! ☀️🌈",
//   "✨Good morning, may you always find a path that you ever wanted; just the mornings are a thing that needs to be amazing. Morning wishes to all in ${threadName}! 🌅😊",
//   "✨Ask a question every day; take a challenge every day, spread love, smile, and happiness every day, because every day is a new one. Good morning, ${threadName}! 💬💖",
//   "✨Don’t believe in taking inspiration and motivation; believe in yourself of what was your aim and what did you held up till here. Have a good morning, members of ${threadName}! 🌟🌞",
//   "✨The paths and ways may be different and may always change your views, but your ultimate goal should be firm. Good morning, have a productive day, ${threadName}! 🛤️🚀",
//   "✨No matter how much you achieve, no matter if you become a superstar, be grounded and be prepared. Good morning, have a wonderful day ahead, ${threadName}! 🌟😊",
//   "✨A new day brings new hopes and opportunities. So, get out of bed and strive to make your day a productive one. Good morning, lovely members of ${threadName}! ☀️🌸",
//   "✨Happiness is a wonderful gift. It makes your day bright and cheerful and gives you the optimism to do new things in life. So, always be happy and have a very good morning, ${threadName}! 😄🌞",
//   "✨A new day has begun, and with it have arrived new dreams and opportunities. May God provide you the strength and determination to fulfill all your dreams. Good morning, ${threadName}! 🌅🙏",
//   "✨After every sunset, there is sunrise. So, do not get bogged down by your failures. Keep working hard, and you will surely achieve success one day. Good morning, ${threadName}! 🌇💪",
//   "✨Start your day with a cup of coffee and a whole lot of optimism. Stay calm and stay positive, and you would surely do well in your interview. Good morning and good luck, ${threadName}! ☕🍀",
//   // Add more greeting messages here...
// ];

// // Define the threads to send greetings
// const threadsToSendGreeting = [
//   // "7133477510012986",
//   "5776059305779745",
//   // "1854950071211727",
//   // "5776059305779745",
//   // "5450951238260571",
//   // "7133477510012986",
// ];

// // Image link for the greeting
// const greetingImageLink = "https://imgur.com/acocFI4.png";

// // Create a set to keep track of messaged threads
// let messagedThreads = new Set();

// // Set up the cron job to run every minute
// const task = cron.schedule(
//   "*/1 * * * *", // Run every minute
//   async () => {
//     if (!apiObject) {
//       console.error("API object is not initialized yet.");
//       return;
//     }

//     for (const threadID of threadsToSendGreeting) {
//       try {
//         const threadInfo = await apiObject.getThreadInfo(threadID);
//         const threadName = threadInfo.name || `Thread ${threadID}`;

//         // Randomly select a greeting message
//         const randomMessageIndex = Math.floor(
//           Math.random() * greetingMessages.length
//         );
//         const randomGreeting = greetingMessages[randomMessageIndex].replace(
//           "${threadName}",
//           threadName
//         );

//         // Download the image
//         const imagePath = path.join(__dirname, "../cache/greet.png");
//         const response = await axios.get(greetingImageLink, {
//           responseType: "stream",
//         });
//         const writer = fs.createWriteStream(imagePath);

//         response.data.pipe(writer);

//         await new Promise((resolve, reject) => {
//           writer.on("finish", resolve);
//           writer.on("error", reject);
//         });

//         // Send the message with the image
//         const attachment = fs.createReadStream(imagePath);
//         apiObject.sendMessage(
//           {
//             body: `✨ -MORNING AUTOGREET- ✨\n\n${randomGreeting}`,
//             attachment,
//           },
//           threadID,
//           (err) => {
//             fs.unlinkSync(imagePath);
//             if (err) return;
//             messagedThreads.add(threadID);
//           }
//         );

//         // Assuming you want to remove the thread from messagedThreads after 1 second
//         setTimeout(() => {
//           messagedThreads.delete(threadID);
//         }, 1000);
//       } catch (error) {
//         console.error("Error sending a message:", error);
//       }
//     }
//   },
//   {
//     scheduled: false, // Don't start the task right away
//     timezone: "Asia/Manila",
//   }
// );

// // Export the new event handler
// module.exports.config = {
//   name: "autogreet",
//   version: "1.0.0",
//   task,
// };

// module.exports.handleEvent = async ({ event, api }) => {
//   // You can add additional event handling logic if needed
//   apiObject = api; // Save the API object
//   // task.start(); // Start the task
//   // console.log("AUTOGREET IS NOW ON");
// };
