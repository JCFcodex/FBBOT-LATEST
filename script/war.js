const fs = require("fs");

const fightMessages = [
  "gumagamit ka nalang bot ingay mo pa tanginaka ket nga siguro reboot ng cp mo di mo alam dami mong satsat ampota",
  "paduduguin ko ulo mo ewan kona lang kung dika mag panic",
  "gago ampota palamunin",
  "pabigat sa pamilya tanginaka lagay mo na cp mo paluin ka mamaya di kapa nag hugas plato HAHAHAHA tanga ampota",
  "asa sa magulang feeling coolkid ang cool mo naman tanginamo",
  "syempre mag rereply ka dito tanga ka eh alam mong bot kakausapin mo ulol kanaba?",
  "jejemon amputa liit tite",
  "kaya pa ? baka mapahiya ka sa gc nato? leave kana block mo bot HAHAHAHAHA luha mo boi punasan mo na",
  "pumapatol sa bot am.puta baka ikaw yung tigang na lalaki na nag papasend ng nudes",
  "feeling coolkid amputa babatukan lang kita e",
  "kaya paba? pag naluluha kana stop na ah leave na awa ako sayo eh bata ",
  "baka ikaw yung 16 years old na nag cocomment sabi ng minor ah ulol HAHAHAHAHA",
  "Walis kana ng bahay nyo tamo lilipad tsinelas sa mukha mo mamaya",
  "tanginaka ginigigil mo bot ko sarap mong i sidekick with recall putanginaka",
  "gulat ka no ? HAHAHAHA tanga ka kase d moto alam ",
  "nagrereply ka palang minumura na kita tanginamo",
  "shempre rereply ka ule dito yakk ilalabas mo pagiging coolkid mo frfr istg",
  "baka pag in-english kita pati pwet mo dumugo",
  "feeling famous nagmamakaawa i heart profile agoiiii HAHAHAHAHAA LT si tanga",
  "lakas maka myday pangit naman tuwang tuwa pa pag may nag heart napindot lng naman yak",
  "face reveal nga baka puro sipon at luha kna ah HAAHHAHAHA iyakin ka eh",
  "stop naba ako ? baka hiyang hiya kana sa sarili mo leave kana",
  "wala kang masabi? malamang tanga ka gago ka putangina kang nigga ka HAHAHAHAHA ",
  "feeling gwapo/maganda pag hinubad facemask mukhang tilapiang nakawala sa tubig ampota",
  "till next time gago bye na pasok kana sa aquarium mo bawal ka sa lupa mukha kang wtf",
  "tangina mo pabigat ka lang sa pamilya mo e",
  "di kapa minumura umiiyak kana",
  "inutusan ako na dapat nakakadepressed at nakakatraumatize daw",
  "kokotong kotongan lang kita rito e",
  "bye kinginamo pangit",
];

// Map to store ongoing wars
let ongoingWars = new Map();

// Function to load ongoing wars from JSON file
function loadOngoingWars() {
  try {
    const data = fs.readFileSync("ongoingWars.json", "utf-8");
    return new Map(JSON.parse(data));
  } catch (error) {
    console.error("Error loading ongoing wars:", error);
    return new Map();
  }
}

// Function to save ongoing wars to JSON file
function saveOngoingWars() {
  try {
    const data = JSON.stringify([...ongoingWars]);
    fs.writeFileSync("ongoingWars.json", data, "utf-8");
  } catch (error) {
    console.error("Error saving ongoing wars:", error);
  }
}

// Load ongoing wars on bot startup
ongoingWars = loadOngoingWars();

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

module.exports.config = {
  name: "war",
  version: "1.0.0",
  aliases: ["war stop"], // Adding "war stop" as an alias
  hasPrefix: false,
  role: 0,
  credits: "JC FAUSTINO",
  description: "Initiate a war with a targeted user or stop the ongoing battle",
  usage: ["war <reply to user message>", "war @mention", "war me", "war stop"], // Updated usage
  cooldowns: 2,
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (args[0] && args[0].toLowerCase() === "stop") {
      // If the command is "war stop", stop the ongoing battle
      stopWar(api, event.threadID);
    } else if (args[0] && args[0].toLowerCase() === "me") {
      // If the command is "war me," initiate a war with the sender
      initiateWar(api, event.threadID, event.senderID);
    } else if (event.type === "message_reply") {
      // Target user from the replied message
      const targetUserID = event.messageReply.senderID;
      initiateWar(api, event.threadID, targetUserID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      // Target user from mentions
      const targetUserID = Object.keys(event.mentions)[0];
      initiateWar(api, event.threadID, targetUserID);
    } else {
      api.sendMessage(
        "Invalid usage. Please use 'war <reply to user message>', 'war @mention', 'war me', or 'war stop'",
        event.threadID
      );
    }
  } catch (error) {
    console.error(`Error in the ${module.exports.config.name} command:`, error);
  }
};

async function initiateWar(api, threadID, targetUserID) {
  // Get the first names of the challenger and the target user
  const challengerFirstName = await getFirstName(api, api.getCurrentUserID());
  const targetUserFirstName = await getFirstName(api, targetUserID);

  // Check if a war is already ongoing with the target user
  if (ongoingWars.has(threadID)) {
    api.sendMessage(
      `A war is already ongoing in this chat. Finish the current battle first or use 'war stop' to stop the battle.`,
      threadID
    );
  } else {
    // Start a new war
    ongoingWars.set(threadID, { targetUserID, isOngoing: true });

    // Save ongoing wars to the JSON file
    saveOngoingWars();

    // Send the challenge message with the first names
    api.sendMessage(
      `${challengerFirstName} is challenging ${targetUserFirstName}: Prepare for battle!`,
      threadID
    );

    // Listen for messages from the target user during the war
    api.listen((err, event) => {
      if (
        event.type === "message" &&
        event.senderID === targetUserID &&
        ongoingWars.has(threadID) &&
        ongoingWars.get(threadID).isOngoing
      ) {
        // Respond to the target user's messages during the war
        // warWithUser(
        //   api,
        //   threadID,
        //   targetUserID,
        //   event.messageID,
        //   challengerFirstName,
        //   targetUserFirstName,
        //   event
        // );
      }
    });
  }
}

function warWithUser(
  api,
  threadID,
  targetUserID,
  messageID,
  challengerFirstName,
  targetUserFirstName,
  event
) {
  // Send random fight message with first names
  const randomMessage =
    fightMessages[Math.floor(Math.random() * fightMessages.length)];

  api.sendMessage(`${randomMessage}`, threadID, messageID);
}

function stopWar(api, threadID) {
  // Stop the ongoing battle in the specified thread
  if (ongoingWars.has(threadID)) {
    ongoingWars.delete(threadID);

    // Save ongoing wars to the JSON file
    saveOngoingWars();

    api.sendMessage(
      `The ongoing battle has been stopped. You can start a new battle.`,
      threadID
    );
  } else {
    api.sendMessage(`No ongoing battle in this chat.`, threadID);
  }
}

module.exports.handleEvent = async function({ api, event }) {
  // Check if the event is a message and it's from the target user
  if (
   ( event.type === "message" ||  event.type === "message_reply") &&
    ongoingWars.has(event.threadID) &&
    ongoingWars.get(event.threadID).isOngoing &&
    event.senderID === ongoingWars.get(event.threadID).targetUserID
  ) {
    const targetUserID = ongoingWars.get(event.threadID).targetUserID;

    // Respond to the target user's messages during the war
    warWithUser(api, event.threadID, targetUserID, event.messageID, event);
  }
};
