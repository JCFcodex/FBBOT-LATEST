// deleteuser.js

const fs = require("fs");
const path = require("path");

async function deleteThisUser(userid) {
  const configFile = "./data/history.json";
  let config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  const sessionFile = path.join("./data/session", `${userid}.json`);
  const index = config.findIndex((item) => item.userid === userid);
  if (index !== -1) config.splice(index, 1);
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  try {
    fs.unlinkSync(sessionFile);
  } catch (error) {
    console.log(error);
  }
  return { success: true };
}

module.exports.config = {
  name: "deleteuser",
  version: "1.0.0",
  hasPermission: 3,
  credits: "Your Name",
  description: "Delete a user by UID.",
  commandCategory: "Moderation",
  usages: ["deleteuser <uid>"],
  usePrefix: false,
  cooldowns: 2,
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (args.length !== 1 || !/^\d+$/.test(args[0])) {
      return api.sendMessage(
        "Invalid usage. Use `deleteuser <uid>`.",
        event.threadID
      );
    }

    const uidToDelete = args[0];

    // Call the delete user function directly
    const result = await deleteThisUser(uidToDelete);

    // Handle the result accordingly
    if (result.success) {
      // api.sendMessage(
      //   `User with UID ${uidToDelete} has been deleted.`,
      //   event.threadID
      // );
      try {
        api.sendMessage("Please wait... ⏳", event.threadID, async () => {
          // Add a delay of 5 seconds before calling process.exit(1)
          setTimeout(async () => {
            await api.sendMessage(
              `User with UID ${uidToDelete} has been deleted.`,
              event.threadID
            );
            process.exit(1);
          }, 5000);
        });
      } catch (error) {
        console.error(
          `Error in the ${module.exports.config.name} command:`,
          error
        );
      }
    } else {
      api.sendMessage(
        `Failed to delete user with UID ${uidToDelete}. Reason: ${result.error}`,
        event.threadID
      );
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
    api.sendMessage(
      "An error occurred while processing the command.",
      event.threadID
    );
  }
};
