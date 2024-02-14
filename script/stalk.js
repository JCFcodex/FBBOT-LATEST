function convert(time) {
  var date = new Date(`${time}`);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var formattedDate =
    `${day < 10 ? "0" + day : day}` +
    "/" +
    `${month < 10 ? "0" + month : month}` +
    "/" +
    year +
    " || " +
    `${hours < 10 ? "0" + hours : hours}` +
    ":" +
    `${minutes < 10 ? "0" + minutes : minutes}` +
    ":" +
    `${seconds < 10 ? "0" + seconds : seconds}`;
  return formattedDate;
}

module.exports.config = {
  name: "stalk",
  version: "2.0.0",
  role: 0,
  credits: "cliff",
  usage: ["stalk [stalk/mention]"],
  cooldown: 5,
};
module.exports.run = async function({ api, event, args }) {
  const request = require("request");
  const axios = require("axios");
  const fs = require("fs");
  let path = __dirname + `/cache/info.png`;

  if (args.join().indexOf("@") !== -1) {
    var id = Object.keys(event.mentions);
  } else var id = args[0] || event.senderID;
  if (event.type == "message_reply") {
    var id = event.messageReply.senderID;
  }
  try {
    const resp = await axios.get(
      `http://eu4.diresnode.com:3588/stalk?uid=${id}`
    );
    var name = resp.data.name;
    var link_profile = resp.data.link;
    var uid = resp.data.id;
    var first_name = resp.data.first_name;
    var username = resp.data.username || "No data!";
    var created_time = convert(resp.data.created_time);
    var web = resp.data.website || "No data!";
    var gender = resp.data.gender;
    var relationship_status = resp.data.relationship_status || "No data!";
    var love = resp.data.significant_other || "No data!";
    var bday = resp.data.birthday || "No data!";
    var follower = resp.data.subscribers.summary.total_count || "No data!";
    var is_verified = resp.data.is_verified;
    var quotes = resp.data.quotes || "No data!";
    var about = resp.data.about || "No data!";
    var locale = resp.data.locale || "No data!";
    var hometown = !!resp.data.hometown
      ? resp.data.hometown.name
      : "No Hometown";
    var cover = resp.data.source || "No Cover photo";
    var avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;
    // callback
    let cb = function() {
      api.sendMessage(
        {
          body: `🌟 •—— 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡𝗦 ——• 🌟

𝗡𝗮𝗺𝗲: ${name}
𝗙𝗶𝗿𝘀𝘁 𝗻𝗮𝗺𝗲: ${first_name}
𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗗𝗮𝘁𝗲: ${created_time}
𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗹𝗶𝗻𝗸: ${link_profile}
𝗚𝗲𝗻𝗱𝗲𝗿: ${gender}
𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 𝗦𝘁𝗮𝘁𝘂𝘀: ${relationship_status}
𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${bday}
𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿(𝘀): ${follower}
𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱: ${is_verified}
𝗛𝗼𝗺𝗲𝘁𝗼𝘄𝗻: ${hometown}
𝗟𝗼𝗰𝗮𝗹𝗲: ${locale}

🌟 •—— 𝗘𝗡𝗗 ——• 🌟`,
          attachment: fs.createReadStream(path),
        },
        event.threadID,
        () => fs.unlinkSync(path),
        event.messageID
      );
    };
    request(encodeURI(avatar))
      .pipe(fs.createWriteStream(path))
      .on("close", cb);
  } catch (err) {
    api.sendMessage(
      `❌ Error: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};
