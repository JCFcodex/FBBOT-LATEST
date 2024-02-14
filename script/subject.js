// Import any necessary modules or libraries
const moment = require("moment");

// Define the command properties
module.exports.config = {
  name: "subject", // Command name
  version: "1.0.0", // Command version
  aliases: ["", ""],
  hasPrefix: false, // Whether to use the bot's prefix or not
  role: 2, // Permission level required (adjust as needed)
  credits: "Your Name", // Command author
  description:
    "Returns all subjects for the specified day with time and subject name", // Brief description of what the command does
  usage: "subject <day>", // Array of command usages
  cooldowns: 5, // Cooldown period in seconds
};

// Define the subjects schedule
const subjectsSchedule = {
  monday: {
    "10:00AM-1:00PM": "System Integration and Architecture",
    "2:00PM-3:30PM": "Life and Works of Rizal",
    "4:00PM-6:00PM": "System Integration and Architecture",
  },
  tuesday: {},
  wednesday: {
    "9:00AM-11:00AM": "Elective 4",
    "11:00AM-1:00PM": "Web System and Technologies 2",
    "2:00PM-4:00PM": "Elective 3",
    "4:00PM-5:30PM": "Life and Works of Rizal",
  },
  thursday: {
    "7:00AM-10:00AM": "Elective 3",
    "10:00AM-1:00PM": "Elective 4",
  },
  friday: {
    "7:00AM-10:00AM": "Web System and Technologies 2",
    "4:00PM-7:00PM": "Capstone Project and Research 1",
  },
  saturday: {
    "7:00AM-9:00AM": "Information Assurance and Security",
    "1:00PM-4:00PM": "Foreign Language 2",
  },
  sunday: {},
};

// Main function to execute when the command is called
module.exports.run = async function({ api, event, args }) {
  try {
    // If the event is not a message or doesn't contain text, or if the thread ID is not the specified one, return immediately
    if (
      event.type !== "message" ||
      !event.body ||
      event.threadID !== "7133477510012986"
    ) {
      return;
    }

    // Get the day from the arguments or use the current day
    const day = (args[0] || moment().format("dddd")).toLowerCase();

    // Get the subjects for the day
    const subjects = subjectsSchedule[day];

    // Check if there are any subjects for the day
    if (Object.keys(subjects).length === 0) {
      // If there are no subjects, send a message saying there are no classes
      api.sendMessage(
        `✨ There are no classes for ${day}. Enjoy your day! 😊\n\n\nML NAAAAAA!!!!!!`,
        event.threadID
      );
    } else {
      // If there are subjects, create a message with the subjects
      let message = `✨ Subjects for ${day}:\n\n\n\n`;
      for (const time in subjects) {
        message += `-Time:   ${time}\n-Subject:   ${subjects[time]}\n\n`;
      }

      // Send the message
      api.sendMessage(message, event.threadID);
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};
