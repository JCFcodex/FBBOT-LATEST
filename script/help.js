const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "help",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: ["info"],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: "Developer",
  cooldown: 5,
};
module.exports.run = async function({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix,
}) {
  const input = args.join(" ");
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁:\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
      }
      helpMessage += "\n𝗘𝘃𝗲𝗻𝘁 𝗟𝗶𝘀𝘁:\n\n";
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. 「 ${prefix}${eventCommand} 」\n`;
      });
      helpMessage += `\n𝗣𝗮𝗴𝗲 ${page}/${Math.ceil(
        commands.length / pages
      )}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.`;

      // Image attachment code
      const img = "https://imgur.com/acocFI4.png"; // Replace with your image URL
      const path = __dirname + "/cache/help.png";

      const { data } = await axios.get(img, {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(path, Buffer.from(data, "utf-8"));
      const imgReadStream = fs.createReadStream(path);

      // Check if the file exists before deleting
      if (fs.existsSync(path)) {
        api.sendMessage(
          {
            body: `🌟 𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝘁𝗵𝗲 𝘄𝗼𝗿𝗹𝗱 𝗼𝗳 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗮𝗻𝗱 𝗲𝘃𝗲𝗻𝘁𝘀!\n\n${helpMessage}`,
            attachment: imgReadStream,
          },
          event.threadID,
          (messageID) => {
            // Delete the help.png file after sending the image
            fs.unlinkSync(path);
          }
        );
      }
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁:\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
      }
      helpMessage += "\n𝗘𝘃𝗲𝗻𝘁 𝗟𝗶𝘀𝘁:\n\n";
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. 「 ${prefix}${eventCommand} 」\n`;
      });
      helpMessage += `\n𝗣𝗮𝗴𝗲 ${page} of ${Math.ceil(commands.length / pages)}`;

      // Image attachment code
      const img = "https://imgur.com/acocFI4.png"; // Replace with your image URL
      const path = __dirname + "/cache/help.png";

      const { data } = await axios.get(img, {
        responseType: "arraybuffer",
      });

      fs.writeFileSync(path, Buffer.from(data, "utf-8"));
      const imgReadStream = fs.createReadStream(path);

      // Check if the file exists before deleting
      if (fs.existsSync(path)) {
        api.sendMessage(
          {
            body: `🌟 𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝘁𝗵𝗲 𝘄𝗼𝗿𝗹𝗱 𝗼𝗳 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗮𝗻𝗱 𝗲𝘃𝗲𝗻𝘁𝘀!\n\n${helpMessage}`,
            attachment: imgReadStream,
          },
          event.threadID,
          (messageID) => {
            // Delete the help.png file after sending the image
            fs.unlinkSync(path);
          }
        );
      }
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) =>
        key.includes(input?.toLowerCase())
      )?.[1];
      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix,
        } = command;
        const roleMessage =
          role !== undefined
            ? role === 0
              ? "➛ Permission: user"
              : role === 1
              ? "➛ Permission: admin"
              : role === 2
              ? "➛ Permission: thread Admin"
              : role === 3
              ? "➛ Permission: super Admin"
              : ""
            : "";
        const aliasesMessage = aliases.length
          ? `➛ 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${aliases.join(", ")}\n`
          : "";
        const descriptionMessage = description
          ? `𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}\n`
          : "";
        const usageMessage = usage ? `➛ 𝗨𝘀𝗮𝗴𝗲: ${usage}\n` : "";
        const creditsMessage = credits ? `➛ 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${credits}\n` : "";
        const versionMessage = version ? `➛ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${version}\n` : "";
        const cooldownMessage = cooldown
          ? `➛ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${cooldown} second(s)\n`
          : "";
        const message = ` 「 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 」\n\n➛ 𝗡𝗮𝗺𝗲: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;

        // Image attachment code
        const img = "https://imgur.com/acocFI4.png"; // Replace with your image URL
        const path = __dirname + "/cache/help.png";

        const { data } = await axios.get(img, {
          responseType: "arraybuffer",
        });

        fs.writeFileSync(path, Buffer.from(data, "utf-8"));
        const imgReadStream = fs.createReadStream(path);

        // Check if the file exists before deleting
        if (fs.existsSync(path)) {
          api.sendMessage(
            {
              body: `🌟 𝗘𝘅𝗽𝗹𝗼𝗿𝗲 𝘁𝗵𝗲 𝘄𝗼𝗿𝗹𝗱 𝗼𝗳 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗮𝗻𝗱 𝗲𝘃𝗲𝗻𝘁𝘀!\n\n${message}`,
              attachment: imgReadStream,
            },
            event.threadID,
            (messageID) => {
              // Delete the help.png file after sending the image
              fs.unlinkSync(path);
            }
          );
        }
      } else {
        api.sendMessage("𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.", event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.handleEvent = async function({ api, event, prefix }) {
  const { threadID, messageID, body } = event;
  const message = prefix
    ? "This is my prefix: " + prefix
    : "Sorry i don't have prefix";
  if (body?.toLowerCase().startsWith("prefix")) {
    api.sendMessage(message, threadID, messageID);
  }
};
