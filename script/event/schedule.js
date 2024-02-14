// const cron = require("node-cron");

// const schedule = [
//   {
//     monday: {
//       "8:00am": "Computer Networks",
//       "10:00am": "System Integration and Architecture",
//       "2:00pm": "Life and Works of Rizal",
//       "4:00pm": "System Integration and Architecture",
//     },
//     tuesday: "REST DAY",
//     wednesday: {
//       "9:00am": "Elective 4",
//       "11:00am": "WST",
//       "2:00pm": "Software Development Principles",
//       "4:00pm": "Database Management Systems",
//     },
//     thursday: {
//       "10:00am": "Artificial Intelligence",
//       "2:00pm": "Data Structures and Algorithms",
//     },
//     friday: {
//       "9:00am": "Web Development",
//       "11:00am": "Operating Systems",
//       "3:00pm": "Ethics in Technology",
//     },
//     saturday: {
//       "10:00am": "Programming Languages",
//       "12:00pm": "Mobile App Development",
//       "2:00pm": "Cybersecurity",
//       "4:00pm": "Networking and Security",
//       "11:47pm": "kain time",
//     },
//   },
// ];
// module.exports.config = {
//   name: "schedule",
//   version: "1.0.0",
//   // add other configurations if needed
// };

// module.exports.handleEvent = function({ api, event }) {
//   // You can add a trigger here to manually check the schedule if needed.
//   // For example, you can check the schedule when someone sends a specific command.

//   // You can also add logic to check the current time and notify members if a class is ongoing.
//   checkSchedule(api);
// };

// // Schedule a cron job to check the schedule every minute
// cron.schedule("* * * * *", () => {
//   checkSchedule();
// });

// function checkSchedule(api) {
//   const now = new Date();
//   const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "lowercase" });

//   if (schedule[dayOfWeek]) {
//     const currentTime = now.toLocaleTimeString("en-US", { hour12: false });

//     for (const [time, subject] of Object.entries(schedule[dayOfWeek])) {
//       if (isTimeToRemind(currentTime, time)) {
//         const message = `Get ready for the next subject: ${subject} at ${time} on ${dayOfWeek}`;
//         api.sendMessage(message, "5776059305779745"); // Change to your desired threadID
//         break; // Notify only once for the first match
//       }
//     }
//   }
// }

// function isTimeToRemind(currentTime, scheduledTime) {
//   // Adjust the timezone as needed
//   const timezoneOffset = 8; // UTC+8 for Asia/Manila
//   const [scheduledHour, scheduledMinute] = scheduledTime.split(":").map(Number);
//   const [currentHour, currentMinute] = currentTime.split(":").map(Number);

//   return (
//     currentHour === scheduledHour &&
//     currentMinute === scheduledMinute &&
//     new Date().getHours() === scheduledHour + timezoneOffset
//   );
// }
