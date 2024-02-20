// // Import necessary modules
// const fs = require("fs");
// const path = require("path");

// // Add a function to calculate the Levenshtein distance
// function levenshtein(a, b) {
//   const matrix = [];
//   let i, j;

//   if (a.length === 0) return b.length;
//   if (b.length === 0) return a.length;

//   for (i = 0; i <= b.length; i++) {
//     matrix[i] = [i];
//   }

//   for (j = 0; j <= a.length; j++) {
//     matrix[0][j] = j;
//   }

//   for (i = 1; i <= b.length; i++) {
//     for (j = 1; j <= a.length; j++) {
//       if (b.charAt(i - 1) === a.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(
//           matrix[i - 1][j - 1] + 1,
//           Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
//         );
//       }
//     }
//   }

//   return matrix[b.length][a.length];
// }

// // Define the command properties
// module.exports.config = {
//   name: "quiz",
//   version: "1.0.0",
//   // aliases: ["", ""],
//   hasPrefix: false,
//   role: 0,
//   credits: "JC FAUSTINO",
//   description: "Quiz command for IT, computers, mobile devices, or programming",
//   usage: "quiz",
//   cooldowns: 5,
// };

// // Define the questions and answers
// const qaPath = path.join("game", "questions.json");
// let qa = [];

// // Read the questions and answers from the file
// try {
//   const data = fs.readFileSync(qaPath);
//   qa = JSON.parse(data);
// } catch (error) {
//   console.error(`Error reading questions and answers from ${qaPath}:`, error);
// }

// let questionActive = false;
// let activeQuestion = null;

// // Main function to execute when the command is called
// module.exports.run = async function({ api, event, args }) {
//   try {
//     if (event.type !== "message") {
//       return;
//     }

//     if (questionActive) {
//       api.sendMessage(
//         "The current question has not been answered yet.",
//         event.threadID
//       );
//       return;
//     }

//     const pointsPath = path.join("game", "cache", "points.json");
//     let points;

//     // Check if points file exists
//     if (fs.existsSync(pointsPath)) {
//       points = JSON.parse(fs.readFileSync(pointsPath));
//     } else {
//       points = {};
//       fs.writeFileSync(pointsPath, JSON.stringify(points));
//     }

//     // Select a random question and answer
//     if (qa && qa.length > 0) {
//       activeQuestion = qa[Math.floor(Math.random() * qa.length)];
//     } else {
//       console.error("No questions available in the qa array");
//       return;
//     }

//     // api.sendMessage(
//     //   `Welcome to the Quiz Game! Here's how to play:\n\n
//     //   1. You have 30 seconds to answer each question.
//     //   2. Reply to the question to submit your answer.\n\n
//     //   Are you ready to start the game? Let's go!`,
//     //   event.threadID,
//     //   event.messageID
//     // );

//     api.sendMessage(
//       `Reply to the question within 1 minute to submit your answer!\n\nREADY??`,
//       event.threadID,
//       event.messageID
//     );

//     let catergory = setInterval(() => {
//       if (!questionActive && activeQuestion) {
//         api.sendMessage(
//           `Category: ${activeQuestion.category}\n\nLevel: ${activeQuestion.level}\n\nPoints: ${activeQuestion.points}`,
//           event.threadID,
//           event.messageID
//         );
//       }
//     }, 5000);

//     let currectQuestion = setInterval(() => {
//       if (!questionActive && activeQuestion) {
//         api.sendMessage(
//           ` - ＱＵＥＳＴＩＯＮ - \n\n${activeQuestion.question}`,
//           event.threadID,
//           event.messageID
//         );
//         questionActive = true;
//       }
//     }, 10000);

//     // Set a 30-second timer
//     let timer = setTimeout(() => {
//       if (questionActive) {
//         api.sendMessage(
//           `🔴 Time's up! The current question has not been answered in time.\n\nCorrect Answer: ${activeQuestion.answer}`,
//           event.threadID,
//           event.messageID
//         );
//         questionActive = false;
//         activeQuestion = null;
//       }
//     }, 60000);

//     // Listen for the answer
//     api.listenMqtt(async (err, message) => {
//       if (message.type === "message_reply") {
//         if (
//           activeQuestion && // Ensure activeQuestion is not null
//           message.body &&
//           levenshtein(
//             message.body.toLowerCase(),
//             activeQuestion.answer.toLowerCase()
//           ) <= 2
//         ) {
//           // Clear the timer
//           clearTimeout(timer);
//           clearTimeout(catergory);
//           clearTimeout(currectQuestion);

//           // Update the points
//           const threadID = message.threadID;
//           const senderID = message.senderID;
//           if (!points[threadID]) points[threadID] = {};

//           points[threadID][senderID] =
//             (points[threadID][senderID] || 0) + activeQuestion.points;

//           // Save the points
//           fs.writeFileSync(pointsPath, JSON.stringify(points));

//           // Get the sender's name
//           let userName = "";
//           try {
//             const senderInfo = await api.getUserInfo(senderID);
//             const fullName = senderInfo[senderID].name.split(" ");
//             userName = fullName.slice(0, 2).join(" "); // Combine first and second names
//           } catch (error) {
//             console.error("Error getting sender's name:", error);
//             api.sendMessage(
//               `Someone got the correct answer! They now have ${points[threadID][
//                 senderID
//               ] || 0} points.`,
//               event.threadID,
//               event.messageID
//             );
//             return;
//           }

//           // Send the success message
//           api.sendMessage(
//             `🏆 ＴＡＭＡ ＰＡＲＲ 🏆\n\n${userName} got the correct answrer! 🚀\n+${activeQuestion.points} points added!\n\nCurrent points: ${points[threadID][senderID]}`,
//             event.threadID,
//             event.messageID
//           );

//           // Stop listening
//           api.stopListening();

//           questionActive = false;
//           activeQuestion = null;
//         } else {
//           // If the answer is wrong, react with ❌
//           api.setMessageReaction("❌", message.messageID, () => {}, true);
//         }
//       }
//     });
//   } catch (error) {
//     console.error(`Error in the ${module.exports.config.name} command:`, error);
//   }
// };

const axios = require("axios");

module.exports.config = {
  name: "quiz",
  version: "1.0.0",
  cooldown: 5,
  role: 0,
  hasPrefix: true,
  aliases: ["game", "system"],
  description: "Quiz's game earn money in quiz",
  usage: "{pref}quiz [filipino|english]",
  credits: "Ainz",
};

module.exports.run = async function({ api, event, args, Utils }) {
  const category = args[0] ? args[0].toLowerCase() : "random";

  const apis = {
    filipino: "https://quiz-6rhj.onrender.com/api/quiz/qz?category=filipino",
    english: "https://quiz-6rhj.onrender.com/api/quiz/qz?category=english",
    random: [
      "https://quiz-6rhj.onrender.com/api/quiz/qz?category=filipino",
      "https://quiz-6rhj.onrender.com/api/quiz/qz?category=english",
    ],
  };

  // Select API based on user's choice or random if not specified
  const selectedApi = apis[category] || apis["random"];
  const randomIndex = Array.isArray(selectedApi)
    ? Math.floor(Math.random() * selectedApi.length)
    : 0;
  const randomApi = Array.isArray(selectedApi)
    ? selectedApi[randomIndex]
    : selectedApi;

  try {
    // Make the API call using the selected API
    const response = await axios.get(randomApi, { timeout: 5000 });
    const { question, answer } = response.data;

    api.sendMessage(
      `Reply to the question to submit your answer!\n\nREADY??`,
      event.threadID,
      event.messageID
    );

    setTimeout(() => {
      // Send the question to the chat
      api.sendMessage(question, event.threadID, function(err, info) {
        return Utils.handleReply.push({
          type: "quiz",
          author: event.senderID,
          messageID: info.messageID,
          answer: answer.toLowerCase(),
        });
      });
    }, 5000);
  } catch (error) {
    console.error(`Error fetching data from API: ${error}`);
    api.sendMessage("Error fetching data from API", event.threadID);
  }
};

module.exports.handleReply = async function({ api, event, Utils, Currencies }) {
  const { threadID, messageID, body, messageReply } = event;

  // Check if messageReply is available and not null
  if (!messageReply || !messageReply.messageID) {
    api.sendMessage("This question is not for you.", threadID, messageID);
    return;
  }

  const reply = Utils.handleReply.findIndex(
    (reply) => reply.author === event.senderID
  );

  const handleReply = Utils.handleReply[reply];

  // Check if handleReply is available
  if (!handleReply) {
    api.sendMessage("This question is not for you.", threadID, messageID);
    return;
  }

  if (handleReply.messageID !== messageReply.messageID) {
    api.sendMessage("This question is not for you.", threadID, messageID);
    return;
  }

  switch (handleReply.type) {
    case "quiz": {
      const choices = ["a", "b", "c", "d"];
      if (!choices.includes(body.toLowerCase())) {
        return api.sendMessage(
          "Invalid choice. Please select one of the following options: a, b, c, or d.",
          threadID,
          messageID
        );
      }
      api.unsendMessage(Utils.handleReply[reply].messageID);
      if (body?.toLowerCase() === Utils.handleReply[reply].answer) {
        await Currencies.increaseMoney(event.senderID, 500);
        api.sendMessage(`You win and gain 500`, threadID, messageID);
        Utils.handleReply.splice(reply, 1);
      } else {
        api.sendMessage(
          `You lose, the correct answer is ${Utils.handleReply[reply].answer}`,
          threadID,
          messageID
        );
        Utils.handleReply.splice(reply, 1);
      }
      break;
    }
  }
};
