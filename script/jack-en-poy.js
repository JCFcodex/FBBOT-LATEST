module.exports.config = {
  name: "jack-en-poy",
  version: "1.0.0",
  cooldown: 3,
  role: 0,
  hasPrefix: false,
  aliases: ["game", "jep"],
  description: "Play a game called Jack-en-poy or Rock, Paper, Scissors",
  usage: "play [rock, paper, scissors]",
  credits: "Ainz",
};

module.exports.run = async function({ api, event, args }) {
  let choices = ["rock", "paper", "scissors"];
  let computerChoice = choices[Math.floor(Math.random() * choices.length)];

  if (!args || args.length === 0) {
    api.sendMessage(
      "Please provide your choice of 'rock' 🪨, 'paper' 📃, or 'scissors' ✂️",
      event.threadID,
      event.messageID
    );
    return;
  }

  let userChoice = args[0];

  if (!userChoice || !choices.includes(userChoice)) {
    api.sendMessage(
      "Invalid choice, please choose either 'rock', 'paper', or 'scissors'",
      event.threadID,
      event.messageID
    );
    return;
  }

  if (userChoice === computerChoice) {
    api.sendMessage(
      `It's a tie! Both you and the computer chose ${userChoice} 😊`,
      event.threadID,
      event.messageID
    );
  } else if (userChoice === "rock" && computerChoice === "scissors") {
    api.sendMessage(
      `You win! 🎉\n\nYou pick: ${userChoice} 🪨\nComputer picked: ${computerChoice} ✂️`,
      event.threadID,
      event.messageID
    );
  } else if (userChoice === "paper" && computerChoice === "rock") {
    api.sendMessage(
      `You win! 🎉\n\nYou pick: ${userChoice} 📃 ✋\nComputer picked: ${computerChoice} 🪨 👊`,
      event.threadID,
      event.messageID
    );
  } else if (userChoice === "scissors" && computerChoice === "paper") {
    api.sendMessage(
      `You win! 🎉\n\nYou pick: ${userChoice} ✂️ ✌️\nComputer picked: ${computerChoice} 📃 ✋`,
      event.threadID,
      event.messageID
    );
  } else {
    api.sendMessage(
      `You lose! ❌\n\nYou pick: ${userChoice}\nComputer picked: ${computerChoice} ${
        computerChoice === "rock"
          ? "🪨"
          : computerChoice === "paper"
          ? "📃"
          : "✂️"
      }`,
      event.threadID,
      event.messageID
    );
  }
};
