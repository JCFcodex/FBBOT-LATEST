const getRandomMember = (groupMembers) =>
  groupMembers[Math.floor(Math.random() * groupMembers.length)];

module.exports.config = {
  name: "autoreply",
  version: "1.1.1",
  role: 0,
  credits: "JC FAUSTINO",
  description: "Bot Reply",
  hasPrefix: false,
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
      "on the way!",
      "ready na me!",
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
      const groupMembers = await api.getThreadInfo(threadID);
      return groupMembers.participantIDs.length
        ? `${await getFirstName(
            api,
            getRandomMember(groupMembers.participantIDs)
          )} may pasok daw ba?`
        : "";
    },

    // Random Room Messages
    "anong room": async () => {
      const groupMembers = await api.getThreadInfo(threadID);
      if (groupMembers.participantIDs.length > 0) {
        const randomReply =
          groupMembers.participantIDs.length > 1
            ? [
                `di ko alam, tanong mo kay papi ${await getFirstName(
                  api,
                  getRandomMember(groupMembers.participantIDs)
                )}`,
                `tanong mo kay ${await getFirstName(
                  api,
                  getRandomMember(groupMembers.participantIDs)
                )}`,
                `tanong mo rin kay ${await getFirstName(
                  api,
                  getRandomMember(groupMembers.participantIDs)
                )}`,
              ]
            : [
                `tanong mo kay ${await getFirstName(
                  api,
                  getRandomMember(groupMembers.participantIDs)
                )}`,
              ];
        return randomReply[Math.floor(Math.random() * randomReply.length)];
      }
      return "";
    },

    // Miscellaneous Messages
    "ano ginawa": "tanong mo kay kuya will",
    "nays wan": "nays wan ka jan",

    // Kagaguhan (Nonsense) Messages
    "lakas trip": "Lakas ng trip mo, ano ba yan!",
    "tara inom": "Shot na, walwalan na!",
    "ang daming alam": "Ang dami mong alam, pakamatay ka na lang!",
    "ewan ko sayo": "Ewan ko sayo, bahala ka diyan!",
    "magbago ka na": "Uy, magbago ka na, bawasan mo ang kagaguhan mo!",
    nakakabwiset: "Nakakabwiset ka na, tigilan mo yan!",
    "taena mo": [
      "Taena mo din",
      "Seryoso ka ba?",
      "Luh, ano bang problema mo?",
      "Hala, sige daldal pa.",
    ],
    "corny mo": "mas corny kang putangina ka gago",
    "gago ka":
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"Gago ka ba talaga o nagpapakabobo ka lang?",
    gago:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29",
    "tangina mo":
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"tangina mo din gago",
    tanginamo:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29",
    tangina:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29",
    bobo:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"mas bobo ka",
    angas: "mas maangas ka par",
    "patay tayo dyan": "Patay tayo dyan, lagot ka!",
    yuck: "Yuck, anong kagaguhan yan?",
    "putangina mo":
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"Putangina mo din!",
    "wala ka kwenta": "Wala kang kwenta, tigilan mo na yan!",
    shet: "ughh shett!",
    pota:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"Pota ka din",
    pakyu:
      "Tunay na kasalanan ang pagmumura, pagsumpa at panunungayaw. Malinaw na itinuturo ng Bibliya na ito ay kasalanan. Sinasabi sa atin sa EFESO 4:29", //"Pakyu ka",
    bwisit: "mas bwisite ka!",
    "ewan ko sayo": "Ewan ko sayo, bahala ka diyan sa kagaguhan mo!",
    "may klase ba": "sipag parang papasok",
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

async function getFirstName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);

    // Check if isMessengerUser is true and name is not "Facebook user"
    if (
      userInfo &&
      userInfo[userID] &&
      userInfo[userID].isMessengerUser === true &&
      userInfo[userID].name &&
      userInfo[userID].name.toLowerCase() !== "facebook user"
    ) {
      return userInfo[userID].firstName || "";
    }

    return null; // Filter out disabled accounts
  } catch (error) {
    console.error("Error getting user info:", error);
    return "";
  }
}
