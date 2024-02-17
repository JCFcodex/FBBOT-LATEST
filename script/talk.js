const fs = require("fs");
const path = require("path");
const axios = require("axios");

const imagePath = path.join("talkOngoing.json");

// Load ongoing talk sessions from JSON file
function loadOngoingTalks() {
  try {
    const data = fs.readFileSync(imagePath, "utf-8");
    return new Map(JSON.parse(data));
  } catch (error) {
    console.error("Error loading ongoing talks:", error);
    return new Map();
  }
}

// Save ongoing talk sessions to JSON file
function saveOngoingTalks() {
  try {
    const data = JSON.stringify([...ongoingTalks]);
    fs.writeFileSync(imagePath, data, "utf-8");
  } catch (error) {
    console.error("Error saving ongoing talks:", error);
  }
}

// Map to store ongoing talk sessions
let ongoingTalks = loadOngoingTalks();

module.exports.config = {
  name: "talk",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "KENLIEPLAYS",
  description: "Talk to par",
  commandCategory: "chat",
  hasPrefix: false,
  usages: "talk <reply to user message>, talk @mention, talk me, talk stop",
  cooldown: 1,
  // aliases: [
  //   "pre",
  //   "tol",
  //   "bai",
  //   "gar",
  //   "boi",
  //   "pare",
  //   "kapatid",
  //   "tsong",
  //   "kaibigan",
  //   "kabarkada",
  //   "bro",
  //   "kuya",
  //   "tolits",
  //   "amigo",
  //   "kabayan",
  // ],
};

module.exports.run = async function({ api, event, args }) {
  let { messageID, threadID, senderID, body } = event;
  let tid = threadID,
    mid = messageID;

  if (args[0] && args[0].toLowerCase() === "stop") {
    // Stop ongoing talk session
    if (ongoingTalks.has(threadID)) {
      ongoingTalks.delete(threadID);
      saveOngoingTalks();
      api.sendMessage(`Talk session stopped.`, tid, mid);
    } else {
      api.sendMessage(`No ongoing talk session in this chat.`, tid, mid);
    }
    return;
  }

  let targetUserID;

  if (args[0] && args[0].toLowerCase() === "me") {
    // Target the user who sent the command
    targetUserID = senderID;
  } else if (event.type === "message_reply") {
    // Target user from the replied message
    targetUserID = event.messageReply.senderID;
  } else if (event.mentions && Object.keys(event.mentions).length > 0) {
    // Target user from mentions
    targetUserID = Object.keys(event.mentions)[0];
  } else {
    api.sendMessage(
      "Invalid usage. Please use 'talk <reply to user message>', 'talk @mention', 'talk me', or 'talk stop'",
      tid,
      mid
    );
    return;
  }

  // Start or resume talk session with the target user
  if (
    !ongoingTalks.has(threadID) ||
    ongoingTalks.get(threadID).targetUserID !== targetUserID
  ) {
    // Avoid double responses when using "talk me" repeatedly
    ongoingTalks.set(threadID, { targetUserID, isOngoing: true });
    const targetUserFirstName = await getFirstName(api, targetUserID);

    saveOngoingTalks();
    api.sendMessage(
      `Talk session started with user ${targetUserFirstName}.`,
      tid,
      mid
    );
  }

  // Listen for messages from the target user during the talk session
  api.listen((err, event) => {
    if (
      event.type === "message" &&
      event.senderID === targetUserID &&
      ongoingTalks.has(threadID) &&
      ongoingTalks.get(threadID).isOngoing
    ) {
      // Perform SimSimi API call and respond
      // handleTalk(api, threadID, targetUserID, event.body, mid);
    }
  });
};

async function handleTalk(api, threadID, targetUserID, message, mid) {
  const content = encodeURIComponent(message);

  try {
    const res = await axios.get(
      `https://simsimi.fun/api/v2/?mode=talk&lang=en&message=${content}&filter=false`
    );

    if (res.data.error) {
      api.sendMessage(`Error: ${res.data.error}`, threadID, mid);
    } else {
      api.sendMessage(res.data.success, threadID, mid);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(
      "An error occurred while fetching the data.",
      threadID,
      mid
    );
  }
}

// Function to get the first name of a user
async function getFirstName(api, uid) {
  try {
    const userInfo = await api.getUserInfo(uid);

    // Check if gender is not null and name is not "Facebook user"
    if (
      userInfo &&
      userInfo[uid] &&
      userInfo[uid].vanity !== undefined &&
      userInfo[uid].name.toLowerCase() !== "facebook user"
    ) {
      return userInfo[uid].firstName;
    }

    console.log(userInfo[uid].name);

    return null; // Filter out disabled accounts
  } catch (getUserInfoError) {
    console.error(`Error getting user info for UID ${uid}:`, getUserInfoError);
    return `User${uid}`;
  }
}

module.exports.handleEvent = async function({ api, event }) {
  // Check if the event is a message and it's from the target user
  if (
    (event.type === "message" || event.type === "message_reply") &&
    ongoingTalks.has(event.threadID) &&
    ongoingTalks.get(event.threadID).isOngoing &&
    event.senderID === ongoingTalks.get(event.threadID).targetUserID
  ) {
    const targetUserID = ongoingTalks.get(event.threadID).targetUserID;

    // Respond to the target user's messages during the talk session
    handleTalk(api, event.threadID, targetUserID, event.body, event.messageID);
  }
};
