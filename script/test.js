const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "test",
  version: "1.1.0",
  role: 2,
  description:
    "Sends a message to all groups and can only be done by the admin.",
  hasPrefix: false,
  aliases: ["noti"],
  usages: "[Text]",
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
 
};

async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
