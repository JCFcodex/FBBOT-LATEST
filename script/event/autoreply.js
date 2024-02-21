const fs = require("fs");

const getRandomMember = (groupMembers) =>
  groupMembers[Math.floor(Math.random() * groupMembers.length)];

const getRandomNonFacebookUser = async (api, participantIDs) => {
  let randomParticipantID;
  let participantName;

  do {
    randomParticipantID = getRandomMember(participantIDs);
    participantName = await getFirstName(api, randomParticipantID);
    console.log(participantName);
  } while (
    participantName === null ||
    participantName.toLowerCase() === "facebook user"
  );

  return participantName;
};
module.exports.config = {
  name: "autoreply",
  version: "1.1.1",
  role: 2,
  credits: "JC FAUSTINO",
  description: "Bot Reply",
  usePrefix: false,
  commandCategory: "No Prefix",
  cooldowns: 0,
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event || !event.senderID) {
    console.error("No senderID available");
    return;
  }

  const { threadID, messageID, senderID, body: react } = event;
  const botID = "100080460532201";

  let userName = "";
  try {
    const senderInfo = await api.getUserInfo(senderID);
    userName = senderInfo[senderID].name;
  } catch (error) {
    console.error("Error getting sender's name:", error);
  }

  const messages = {
    // Greetings
    hello: [
      `Hi👋 ${userName}`,
      `Hello din ${userName}`,
      `Hello musta ka ${userName}`,
      `Kamusta ka ${userName}?`,
      `Mabuhay, ${userName}!`,
    ],

    // OTW (On The Way) Messages
    otw: [
      "ingat par",
      "ingat par baka ma rape ka",
      "gago bilisan mo",
      "tagal mo",
      "otw, ingat ka din!",
    ],

    // Mobile Legends Messages
    "ml na": "Palo ka talaga, tara rg par",
    ml: "Palo ka talaga, tara rg par",
    "tara ml": "omsim tara g na",
    "open na": "Wait lang pota",
    "open lang": "Tagal",
    ggs: "ggs par",
    "nc g": "nays g par",
    "nays g": "nays g par",
    "sali ka": "ako ba di moko sasali?",
    "pabuhat ka": "mas pabuhat kang putangina ka",
    "pabuhat ako": "sige lang kaya ko naman magbuhat ng mga mahihina",
    tripings: "bugok yan eh",
    trippings: "bugok yan eh",
    "Lakas mo": "naman mana sayo yan eh",

    // School Related Messages
    "may pasok ba bukas": "nagtanong yung tamad pumasok oh HAHAHA",
    "may pasok ba": async () => {
      try {
        const groupMembers = await api.getThreadInfo(threadID);

        if (groupMembers && groupMembers.participantIDs.length > 0) {
          const participantName = await getRandomNonFacebookUser(
            api,
            groupMembers.participantIDs
          );

          return participantName ? `${participantName} may pasok daw ba?` : "";
        } else {
          return "";
        }
      } catch (error) {
        console.error("Error:", error);
        return "Error checking if there's class today.";
      }
    },

    // Random Room Messages
    "anong room": async () => {
      try {
        const groupMembers = await api.getThreadInfo(threadID);

        if (groupMembers && groupMembers.participantIDs.length > 0) {
          const randomReply = [
            `tanong mo kay ${await getRandomNonFacebookUser(
              api,
              groupMembers.participantIDs
            )}`,
            `${await getRandomNonFacebookUser(
              api,
              groupMembers.participantIDs
            )} anong room daw!`,
            // Add more responses as needed
          ];

          return randomReply[Math.floor(Math.random() * randomReply.length)];
        } else {
          return "";
        }
      } catch (error) {
        console.error("Error:", error);
        return "Error checking the room.";
      }
    },

    // Miscellaneous Messages
    "ano ginawa": "tanong mo kay kuya will",
    "nays wan": "nays wan ka jan",
    "palo ka": "omsim palo talaga yan",
  };

  for (const [keyword, reply] of Object.entries(messages)) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, "i");

    if (keywordRegex.test(react)) {
      const msgBody = Array.isArray(reply)
        ? reply[Math.floor(Math.random() * reply.length)]
        : typeof reply === "function"
        ? await reply()
        : reply;

      api.sendMessage({ body: msgBody }, threadID, messageID);
      break;
    }
  }
};

// module.exports.run = function() {};

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
