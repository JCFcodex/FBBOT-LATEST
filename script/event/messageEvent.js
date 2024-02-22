module.exports.config = {
  name: "messageEvent",
  version: "1.0.0",
};

var msgData = {};

module.exports.handleEvent = async function({ api, event }) {
  const { senderID, threadID, messageID } = event; // Include threadID in the destructuring
  let userName = "";
  let senderInfo; // Declare senderInfo outside the try block

  try {
    senderInfo = await api.getUserInfo(senderID);

    // Check if senderInfo contains the user information for the senderID
    if (senderInfo && senderInfo[senderID]) {
      userName = senderInfo[senderID].name;
    } else {
      // console.error("Sender information not available");
    }
  } catch (error) {
    // console.error("Error getting sender's name:", error);
  }

  const adminUID = "100076613706558";
  if (event.type === "message") {
    // Check if event.attachments is defined before accessing its properties
    msgData[messageID] = {
      body: event.body,
      attachments: event.attachments || [],
    };
  }

  // Check if msgData[messageID] is defined before accessing its properties
  if (msgData[messageID] && senderID !== adminUID) {
    if (msgData[messageID].attachments.length === 0) {
      console.log(`${userName} sent this message: ${msgData[messageID].body}`);
      // api.sendMessage(
      //   `Name: ${userName}\nMsg: ${
      //     msgData[messageID].body
      //   }\n\nGROUP: ${await getThreadName(api, threadID)}`, // Pass api and threadID to getThreadName
      //   adminUID
      // );
    } else {
      const attachmentType = msgData[messageID].attachments[0].type;

      if (attachmentType === "photo") {
        console.log(`${userName} sent a photo`);
      } else if (attachmentType === "audio") {
        console.log(`${userName} sent an audio`);
      } else if (attachmentType === "animated_image") {
        console.log(`${userName} sent a gif`);
      } else if (attachmentType === "video") {
        console.log(`${userName} sent a video`);
      }
    }
  }
};

const getThreadName = async (api, threadID) => {
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    if (threadInfo === null) {
      console.error("Thread info is null for thread ID:", threadID);
      return `GroupChat-${threadID}`;
    }
    return threadInfo.name || `GroupChat-${threadID}`;
  } catch (error) {
    console.error("Error fetching thread info:", error);
    return `GroupChat-${threadID}`;
  }
};
