const axios = require("axios");

module.exports.config = {
  name: "tempmail",
  version: "1.0.1",
  info:
    "Generates random email from www.1secmail.com and fetches message from inbox",
  credits: "Kenneth Panio",
  type: "Accounting",
  role: 0,
  aliases: ["1secmail", "temp", "genmail", "dumpmail", "mail", "dump"],
  usage:
    "[count (optional)] or inbox [email] [message limit to show (optional)]",
};

const TEMP_MAIL_URL = "https://www.1secmail.com/api/v1/";
const MAX_EMAIL_COUNT = 10;
const DEFAULT_DISPLAY_LIMIT = 5;

module.exports.run = async ({ api, event, args }) => {
  try {
    if (args[0] === "inbox") {
      if (!args[1]) {
        return api.sendMessage(
          "Please provide an email address for the inbox.",
          event.threadID
        );
      }

      const [username, domain] = args[1].replace(/\(\.\)/g, ".").split("@");
      const inboxResponse = await axios.get(
        `${TEMP_MAIL_URL}?action=getMessages&login=${username}&domain=${domain}`
      );
      const messages = inboxResponse.data;

      if (!messages || messages.length === 0) {
        return api.sendMessage(
          `No messages found for ${args[1]}.`,
          event.threadID
        );
      }

      const displayLimit = args[2] || DEFAULT_DISPLAY_LIMIT;
      const limitedMessages = messages.slice(0, displayLimit);

      let messageText = "";
      for (const message of limitedMessages) {
        const messageDetails = await axios.get(
          `${TEMP_MAIL_URL}?action=readMessage&login=${username}&domain=${domain}&id=${message.id}`
        );
        const detailedMessage = messageDetails.data;
        const attachments = detailedMessage.attachments
          .map(
            (attachment) =>
              `📎 Attachment: ${attachment.filename} (${attachment.size} bytes)`
          )
          .join("\n");

        messageText += `👤 𝗦𝗘𝗡𝗗𝗘𝗥: ${
          detailedMessage.from
        }\n🎯 𝗦𝗨𝗕𝗝𝗘𝗖𝗧: ${detailedMessage.subject ||
          "No Subject 🎯"}\n📅 𝗗𝗔𝗧𝗘: ${
          detailedMessage.date
        }\n\n${detailedMessage.textBody ||
          detailedMessage.body}\n\n${attachments}\n\n`;
      }

      api.sendMessage(
        `Successful! Displaying the latest ${displayLimit} messages. Please check pm or spam in your message request.`,
        event.threadID
      );
      api.sendMessage(messageText, event.senderID);
    } else {
      const count = Math.min(args[0] || 1, MAX_EMAIL_COUNT);
      if (count > MAX_EMAIL_COUNT)
        return api.sendMessage(
          `Maximum allowed count is ${MAX_EMAIL_COUNT}.`,
          event.threadID
        );
      const generatedEmails = (
        await axios.get(
          `${TEMP_MAIL_URL}?action=genRandomMailbox&count=${count}`
        )
      ).data
        .map((email) => `${email.replace(/\./g, "(.)")}`)
        .join("\n");
      api.sendMessage(generatedEmails, event.threadID);
    }
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage(
      "Failed to generate or retrieve email, please try again.",
      event.threadID
    );
  }
};
