const axios = require('axios');
const he = require('he');

module.exports.config = {
  name: 'quiz',
  version: '1.0.0',
  cooldown: 10,
  role: 0,
  hasPrefix: true,
  aliases: ['game', 'system'],
  description: "Quiz's game earn money in quiz",
  usage: '{pref}quiz',
  credits: 'Ainz',
};

let timerId;
let isAnswered = false;
let quizType;
let questionDifficulty;

module.exports.run = async function({ api, event, Utils }) {
  const categories = Array.from({ length: 24 }, (_, index) => index + 9);
  const selectedCategory =
    categories[Math.floor(Math.random() * categories.length)];

  const difficulties = ['easy', 'medium', 'hard'];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * difficulties.length);

  // Get the difficulty at the random index
  const randomDifficulty = difficulties[randomIndex];

  const apiUrls = [
    'https://opentdb.com/api.php?amount=1&type=multiple',
    'https://opentdb.com/api.php?amount=1&type=boolean',
  ];

  const randomApiUrl = apiUrls[Math.floor(Math.random() * apiUrls.length)];

  const apiUrl = randomApiUrl;
  // const apiUrl = `https://opentdb.com/api.php?amount=1&type=boolean`;

  try {
    // Make the API call using the selected API
    const response = await axios.get(apiUrl, { timeout: 10000 });
    const {
      type,
      difficulty,
      category,
      question,
      correct_answer: answer,
      incorrect_answers = [],
    } = response.data.results[0];

    quizType = type;
    questionDifficulty = difficulty;

    // Decode HTML entities in the question and answer
    const decodedQuestion = he.decode(question);
    let decodedAnswer = he.decode(answer);
    const decodedCategory = he.decode(category);

    let typeOfQuestion =
      quizType === 'multiple' ? 'Multiple Choice' : 'True or False';

    if (!isAnswered) {
      if (type === 'boolean') {
        api.sendMessage(
          `Please reply to the question with either "𝗧𝗿𝘂𝗲" or "𝗙𝗮𝗹𝘀𝗲" to submit your answer!\n\n𝗡𝗼𝘁𝗲: You have 1 minute to answer each question.\n\n𝗧𝘆𝗽𝗲: ${typeOfQuestion}\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${decodedCategory}.\n𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆: ${difficulty}`,
          event.threadID,
          event.messageID
        );
      } else {
        api.sendMessage(
          `Please reply to the question with the letter of your answer choice to submit your answer!\n\n𝗡𝗼𝘁𝗲: You have 1 minute to answer each question.\n\n𝗧𝘆𝗽𝗲: ${typeOfQuestion}\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${decodedCategory}\n𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆: ${difficulty}`,
          event.threadID,
          event.messageID
        );
      }
    } else {
      api.sendMessage(
        `Moving on to the next question ➡️\n\n𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${decodedCategory}.\n𝗗𝗶𝗳𝗳𝗶𝗰𝘂𝗹𝘁𝘆: ${difficulty}`,
        event.threadID,
        event.messageID
      );
    }
    console.log(`Question: ${decodedQuestion}`);
    const choices = [
      incorrect_answers[0],
      incorrect_answers[1],
      incorrect_answers[2],
    ];
    const allAnswers = [...choices, decodedAnswer];

    // Shuffle the array
    const shuffledAnswers = shuffleArray(allAnswers);

    // Function to shuffle an array (Fisher-Yates shuffle)
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    setTimeout(() => {
      // Send the question to the chat
      let multipleChoices = '';
      if (type === 'multiple') {
        multipleChoices = `\n\n𝗔: ${shuffledAnswers[0]}\n𝗕: ${shuffledAnswers[1]}\n𝗖: ${shuffledAnswers[2]}\n𝗗: ${shuffledAnswers[3]}`;
        for (let i = 0; i < shuffledAnswers.length; i++) {
          if (shuffledAnswers[i] === decodedAnswer) {
            switch (i) {
              case 0:
                decodedAnswer = 'a';
                break;
              case 1:
                decodedAnswer = 'b';
                break;
              case 2:
                decodedAnswer = 'c';
                break;
              case 3:
                decodedAnswer = 'd';
                break;
            }
          }
        }
      }

      api.sendMessage(
        `- 𝗤 𝗨 𝗘 𝗦 𝗧 𝗜 𝗢 𝗡 -\n\n${decodedQuestion}\n${multipleChoices}`,
        event.threadID,
        function(err, info) {
          Utils.handleReply.push({
            type: 'quiz',
            author: event.threadID,
            messageID: info.messageID,
            answer: decodedAnswer.toLowerCase(),
          });
          console.log(`Correct Answer: ${decodedAnswer}`);

          // Set a timer to unsend the question after 1 minute
          timerId = setTimeout(() => {
            api.unsendMessage(info.messageID);
            const replyIndex = Utils.handleReply.findIndex(
              (reply) => reply.messageID === info.messageID
            );
            if (replyIndex !== -1) {
              Utils.handleReply.splice(replyIndex, 1);
            }
            api.sendMessage(
              `🔴 𝗧𝗶𝗺𝗲'𝘀 𝘂𝗽! The current question has not been answered in time.\n\n𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿: ${decodedAnswer}`,
              event.threadID,
              event.messageID
            );
          }, 60000); // 1 minute = 60,000 milliseconds
        }
      );
    }, 7000);
  } catch (error) {
    console.error(`Error fetching data from API: ${error}`);
    api.sendMessage('Error fetching data from API', event.threadID);
  }
};

module.exports.handleReply = async function({
  api,
  event,
  Utils,
  Currencies,
  Experience,
  args,
}) {
  const { threadID, messageID, body, messageReply } = event;

  // Check if messageReply is available and not null
  if (!messageReply || !messageReply.messageID) {
    api.sendMessage(checkQuizType(), threadID, messageID);
    return;
  }

  const reply = Utils.handleReply.findIndex(
    (reply) => reply.author === event.threadID
  );

  const handleReply = Utils.handleReply[reply];

  // Check if handleReply is available
  if (!handleReply) {
    api.sendMessage(checkQuizType(), threadID, messageID);
    return;
  }

  if (handleReply.messageID !== messageReply.messageID) {
    api.sendMessage(checkQuizType(), threadID, messageID);
    return;
  }

  switch (handleReply.type) {
    case 'quiz': {
      if (quizType === 'boolean') {
        const choices = ['true', 'false'];
        if (!choices.includes(body.toLowerCase())) {
          return api.sendMessage(
            'Invalid choice. Please reply with either "𝗧𝗿𝘂𝗲" or "𝗙𝗮𝗹𝘀𝗲".',
            threadID,
            messageID
          );
        }
      } else {
        const choices = ['a', 'b', 'c', 'd'];
        if (!choices.includes(body.toLowerCase())) {
          return api.sendMessage(
            'Invalid choice. Please select one of the following options: 𝗮, 𝗯, 𝗰, or 𝗱.',
            threadID,
            messageID
          );
        }
      }
      api.unsendMessage(Utils.handleReply[reply].messageID);
      if (body?.toLowerCase() === Utils.handleReply[reply].answer) {
        isAnswered = true;
        const { levelInfo } = Experience;
        const rankInfo = await levelInfo(event.senderID);
        if (!rankInfo || typeof rankInfo !== 'object') {
          return;
        }

        const rewards = {
          easy: 500,
          medium: 550,
          hard: 600,
        };

        let reward = rewards[questionDifficulty] || 0;

        await Currencies.increaseMoney(event.senderID, reward);
        const userData = await Currencies.getData(event.senderID);

        const { name, exp, level, money } = rankInfo;

        console.log(`user data: ${userData.money}`);

        api.sendMessage(
          `🟢 You win and gain ${reward}\n\n𝗡𝗮𝗺𝗲: ${name}\n𝗘𝘅𝗽: ${exp}\n𝗟𝗲𝘃𝗲𝗹: ${level}\n𝗠𝗼𝗻𝗲𝘆: ${money +
            500}`,
          threadID,
          messageID
        );
        // Clear the existing timeout
        clearTimeout(timerId);
        console.log(`${messageID} increased money to ${reward}`);
        Utils.handleReply.splice(reply, 1);
        // Call the run function again to start a new quiz
        setTimeout(() => {
          module.exports.run({ api, event, args, Utils });
        }, 5000);
      } else {
        // Clear the existing timeout
        clearTimeout(timerId);
        api.sendMessage(
          `You lose, the correct answer is ${Utils.handleReply[reply].answer}`,
          threadID,
          messageID
        );
        Utils.handleReply.splice(reply, 1);
        isAnswered = false;
      }
      break;
    }
  }
};

function checkQuizType() {
  if (quizType === 'boolean') {
    return 'Reply to the question with either "𝗧𝗿𝘂𝗲" or "𝗙𝗮𝗹𝘀𝗲" to submit your answer!';
  } else {
    return 'Reply to the question with either 𝗔, 𝗕, 𝗖, 𝗼𝗿 𝗗. to submit your answer!';
  }
}
