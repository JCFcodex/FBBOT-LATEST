const { spawn } = require("child_process");
const path = require("path");
const SCRIPT_FILE = "auto.js";
const SCRIPT_PATH = path.join(__dirname, SCRIPT_FILE);

function start() {
  const main = spawn("node", [SCRIPT_PATH], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  main.on("close", (exitCode) => {
    if (exitCode === 0) {
      console.log("Main process exited with code 0");
    } else if (exitCode === 1) {
      console.log("Main process exited with code 1. Restarting...");
      start();
    } else {
      console.error(`Main process exited with code ${exitCode}`);
    }
  });
}

start();


// const { spawn } = require("child_process");
// const path = require("path");
// const SCRIPT_FILE = "auto.js";
// const SCRIPT_PATH = path.join(__dirname, SCRIPT_FILE);

// // Replace with the actual import statement for your API module
// // const api = require("your-api-module");

// async function getAllThreadIDs(api) {
//   try {
//     const threadList = await api.getThreadList(0, 10); // Adjust the limit as needed
//     return threadList.map((thread) => thread.threadID);
//   } catch (error) {
//     console.error("Error getting thread list:", error);
//     return [];
//   }
// }

// async function sendRestartMessage(api, threadID) {
//   try {
//     await api.sendMessage("🚀 Bot is restarting. Please wait a moment... 🔄", threadID);
//   } catch (error) {
//     console.error(`Error sending restart message to thread ${threadID}:`, error);
//   }
// }

// async function start() {
//   const threadIDs = await getAllThreadIDs(api);

//   for (const threadID of threadIDs) {
//     await sendRestartMessage(api, threadID);
//   }

//   const main = spawn("node", [SCRIPT_PATH], {
//     cwd: __dirname,
//     stdio: "inherit",
//     shell: true,
//   });

//   main.on("close", (exitCode) => {
//     if (exitCode === 0) {
//       console.log("Main process exited with code 0");
//     } else if (exitCode === 1) {
//       console.log("Main process exited with code 1. Restarting...");
//       start();
//     } else {
//       console.error(`Main process exited with code ${exitCode}`);
//     }
//   });
// }

// start();
