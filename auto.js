const fs = require('fs');
const path = require('path');
const axios = require('axios');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const script = path.join(__dirname, 'script');
const cron = require('node-cron');
const { Octokit } = require('@octokit/rest');
const chokidar = require('chokidar'); // Install this package
let token = fs.readFileSync('token.txt', 'utf8').trim();
const getToken = () => token;
const setToken = (newToken) => {
  token = newToken;
  fs.writeFileSync('token.txt', newToken, 'utf8');
};

module.exports = {
  getToken,
  setToken,
};
const config =
  fs.existsSync('./data') && fs.existsSync('./data/config.json')
    ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8'))
    : createConfig();
const Utils = new Object({
  commands: new Map(),
  handleEvent: new Map(),
  account: new Map(),
  cooldowns: new Map(),
  ObjectReply: new Map(),
  handleReply: [],
});
fs.readdirSync(script).forEach((file) => {
  const scripts = path.join(script, file);
  const stats = fs.statSync(scripts);
  if (stats.isDirectory()) {
    fs.readdirSync(scripts).forEach((file) => {
      try {
        const { config, run, handleEvent, handleReply } = require(path.join(
          scripts,
          file
        ));
        if (config) {
          const {
            name = [],
            role = '0',
            version = '1.0.0',
            hasPrefix = true,
            aliases = [],
            description = '',
            usage = '',
            credits = '',
            cooldown = '5',
          } = Object.fromEntries(
            Object.entries(config).map(([key, value]) => [
              key.toLowerCase(),
              value,
            ])
          );
          aliases.push(name);
          if (run) {
            Utils.commands.set(aliases, {
              name,
              role,
              run,
              aliases,
              description,
              usage,
              version,
              hasPrefix: config.hasPrefix,
              credits,
              cooldown,
            });
          }
          if (handleEvent) {
            Utils.handleEvent.set(aliases, {
              name,
              handleEvent,
              role,
              description,
              usage,
              version,
              hasPrefix: config.hasPrefix,
              credits,
              cooldown,
            });
          }
          if (handleReply) {
            Utils.ObjectReply.set(aliases, {
              name,
              handleReply,
            });
          }
        }
      } catch (error) {
        console.error(
          chalk.red(
            `Error installing command from file ${file}: ${error.message}`
          )
        );
      }
    });
  } else {
    try {
      const { config, run, handleEvent, handleReply } = require(scripts);
      if (config) {
        const {
          name = [],
          role = '0',
          version = '1.0.0',
          hasPrefix = true,
          aliases = [],
          description = '',
          usage = '',
          credits = '',
          cooldown = '5',
        } = Object.fromEntries(
          Object.entries(config).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ])
        );
        aliases.push(name);
        if (run) {
          Utils.commands.set(aliases, {
            name,
            role,
            run,
            aliases,
            description,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cooldown,
          });
        }
        if (handleEvent) {
          Utils.handleEvent.set(aliases, {
            name,
            handleEvent,
            role,
            description,
            usage,
            version,
            hasPrefix: config.hasPrefix,
            credits,
            cooldown,
          });
        }
        if (handleReply) {
          Utils.ObjectReply.set(aliases, {
            name,
            handleReply,
          });
        }
      }
    } catch (error) {
      console.error(
        chalk.red(
          `Error installing command from file ${file}: ${error.message}`
        )
      );
    }
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [
  {
    path: '/',
    file: 'index.html',
  },
  {
    path: '/step_by_step_guide',
    file: 'guide.html',
  },
  {
    path: '/online_user',
    file: 'online.html',
  },
];
routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', route.file));
  });
});
app.get('/info', (req, res) => {
  const data = Array.from(Utils.account.values()).map((account) => ({
    name: account.name,
    profileUrl: account.profileUrl,
    thumbSrc: account.thumbSrc,
    time: account.time,
  }));
  res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
  const command = new Set();
  const commands = [...Utils.commands.values()].map(
    ({ name }) => (command.add(name), name)
  );
  const handleEvent = [...Utils.handleEvent.values()]
    .map(({ name }) => (command.has(name) ? null : (command.add(name), name)))
    .filter(Boolean);
  const role = [...Utils.commands.values()].map(
    ({ role }) => (command.add(role), role)
  );
  const aliases = [...Utils.commands.values()].map(
    ({ aliases }) => (command.add(aliases), aliases)
  );
  res.json(
    JSON.parse(
      JSON.stringify(
        {
          commands,
          handleEvent,
          role,
          aliases,
        },
        null,
        2
      )
    )
  );
});
app.post('/login', async (req, res) => {
  const { state, commands, prefix, admin } = req.body;
  try {
    if (!state) {
      throw new Error('Missing app state data');
    }
    const cUser = state.find((item) => item.key === 'c_user');
    if (cUser) {
      const existingUser = Utils.account.get(cUser.value);
      if (existingUser) {
        console.log(`User ${cUser.value} is already logged in`);
        return res.status(400).json({
          error: false,
          message: 'Active user session detected; already logged in',
          user: existingUser,
        });
      } else {
        try {
          await accountLogin(state, commands, prefix, [admin]);
          res.status(200).json({
            success: true,
            message:
              'Authentication process completed successfully; login achieved.',
          });
        } catch (error) {
          console.error(error);
          res.status(400).json({
            error: true,
            message: error.message,
          });
        }
      }
    } else {
      return res.status(400).json({
        error: true,
        message: "There's an issue with the appstate data; it's invalid.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "There's an issue with the appstate data; it's invalid.",
    });
  }
});
app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  // Respond to the user with an error message if applicable
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
  return new Promise((resolve, reject) => {
    login(
      {
        appState: state,
      },
      async (error, api) => {
        if (error) {
          reject(error);
          return;
        }
        const userid = await api.getCurrentUserID();
        addThisUser(userid, enableCommands, state, prefix, admin);
        try {
          const userInfo = await api.getUserInfo(userid);
          if (
            !userInfo ||
            !userInfo[userid]?.name ||
            !userInfo[userid]?.profileUrl ||
            !userInfo[userid]?.thumbSrc
          )
            throw new Error(
              'Unable to locate the account; it appears to be in a suspended or locked state.'
            );
          const { name, profileUrl, thumbSrc } = userInfo[userid];
          let time =
            (
              JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(
                (user) => user.userid === userid
              ) || {}
            ).time || 0;
          Utils.account.set(userid, {
            name,
            profileUrl,
            thumbSrc,
            time: time,
          });
          const intervalId = setInterval(() => {
            try {
              const account = Utils.account.get(userid);
              if (!account) throw new Error('Account not found');
              Utils.account.set(userid, {
                ...account,
                time: account.time + 1,
              });
            } catch (error) {
              clearInterval(intervalId);
              return;
            }
          }, 1000);
        } catch (error) {
          reject(error);
          return;
        }
        api.setOptions({
          listenEvents: config[0].fcaOption.listenEvents,
          logLevel: config[0].fcaOption.logLevel,
          updatePresence: config[0].fcaOption.updatePresence,
          selfListen: config[0].fcaOption.selfListen,
          forceLogin: config[0].fcaOption.forceLogin,
          online: config[0].fcaOption.online,
          autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
          autoMarkRead: config[0].fcaOption.autoMarkRead,
        });
        global.custom = require('./cron/morningGreet')({ api: api });
        global.custom = require('./cron/eveningGreet')({ api: api });
        global.custom = require('./cron/reminderNoti')({ api: api });
        global.custom = require('./cron/startedNoti')({ api: api });
        global.custom = require('./cron/restartNoti')({ api: api });
        global.custom = require('./cron/timer')({ api: api });
        // global.custom = require("./index")({ api: api });
        try {
          let database;

          function readDatabase() {
            try {
              if (fs.existsSync('./data/database.json')) {
                const content = fs.readFileSync('./data/database.json', 'utf8');
                if (content.trim() !== '') {
                  // Only parse if the content is not empty
                  database = JSON.parse(content);
                } else {
                  console.error('Error parsing database.json: Empty file');
                  database = createDatabase();
                }
              } else {
                console.error(
                  'Error parsing database.json: File does not exist'
                );
                database = createDatabase();
              }
            } catch (error) {
              console.error('Error parsing database.json:', error);
              database = createDatabase();
            }
          }

          // Initial read
          readDatabase();

          // Watch for changes in the database.json file
          chokidar.watch('./data/database.json').on('change', () => {
            try {
              readDatabase();
            } catch (error) {
              console.error('Error handling changes in database.json:', error);
            }
          });

          api.listenMqtt(async (error, event) => {
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM

            if (event.body !== null) {
              // Check if the message type is log:subscribe
              if (event.logMessageType === 'log:subscribe') {
                const request = require('request');
                const moment = require('moment-timezone');
                var thu = moment.tz('Asia/Manila').format('dddd');
                if (thu == 'Sunday') thu = 'Sunday';
                if (thu == 'Monday') thu = 'Monday';
                if (thu == 'Tuesday') thu = 'Tuesday';
                if (thu == 'Wednesday') thu = 'Wednesday';
                if (thu == 'Thursday') thu = 'Thursday';
                if (thu == 'Friday') thu = 'Friday';
                if (thu == 'Saturday') thu = 'Saturday';
                const time = moment
                  .tz('Asia/Manila')
                  .format('HH:mm:ss - DD/MM/YYYY');
                const fs = require('fs-extra');
                const { threadID } = event;

                if (
                  event.logMessageData.addedParticipants &&
                  Array.isArray(event.logMessageData.addedParticipants) &&
                  event.logMessageData.addedParticipants.some(
                    (i) => i.userFbId == userid
                  )
                ) {
                  api.changeNickname(`》 KULUBOT 《`, threadID, userid);

                  let gifUrl = 'https://i.imgur.com/gBYZHdw.mp4';
                  let gifPath = __dirname + '/cache/connected.jpeg';

                  axios
                    .get(gifUrl, { responseType: 'arraybuffer' })
                    .then((response) => {
                      fs.writeFileSync(gifPath, response.data);
                      return api.sendMessage(
                        `🔴🟢🟡\n\n✅ 𝗚𝗥𝗢𝗨𝗣 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗢𝗡 𝗦𝗨𝗖𝗖𝗘𝗦! \n➭ Bot Prefix: ${prefix}\n➭ Admin: ‹${admin}›\n➭ Facebook: ‹https://www.facebook.com/${admin}›\n➭ Use ${prefix}help to view command details\n➭ Added bot at: ⟨ ${time} ⟩〈 ${thu} 〉`,
                        event.threadID
                      );
                    })
                    .catch((error) => {
                      console.error('Error fetching GIF:', error);
                    });
                } else {
                  try {
                    const fs = require('fs-extra');
                    let {
                      threadName,
                      participantIDs,
                    } = await api.getThreadInfo(threadID);

                    var mentions = [],
                      nameArray = [],
                      memLength = [],
                      i = 0;

                    let addedParticipants1 =
                      event.logMessageData.addedParticipants;
                    for (let newParticipant of addedParticipants1) {
                      let userID = newParticipant.userFbId;
                      api.getUserInfo(parseInt(userID), (err, data) => {
                        if (err) {
                          return console.log(err);
                        }
                        var obj = Object.keys(data);
                        var userName = data[obj].name.replace('@', '');
                        if (userID !== api.getCurrentUserID()) {
                          nameArray.push(userName);
                          mentions.push({
                            tag: userName,
                            id: userID,
                            fromIndex: 0,
                          });

                          memLength.push(participantIDs.length - i++);
                          memLength.sort((a, b) => a - b);

                          typeof threadID.customJoin == 'undefined'
                            ? (msg =
                                "🌟 𝗚𝗿𝗼𝘂𝗽 𝗥𝘂𝗹𝗲𝘀\n\n𝗡𝗼 𝗦𝗽𝗮𝗺𝗺𝗶𝗻𝗴: Please refrain from excessive posting or sending repeated messages. Respect others' space in the group.\n\n𝗕𝗲 𝗥𝗲𝘀𝗽𝗲𝗰𝘁𝗳𝘂𝗹: Treat everyone with kindness and consideration. Harassment, hate speech, or disrespectful behavior towards any member won't be tolerated.\n𝖵i𝗈𝗅𝖺𝗍i𝗇𝗀 𝗍𝗁𝖾𝗌𝖾 𝗋𝗎𝗅𝖾𝗌 𝗆𝖺𝗒 𝗋𝖾𝗌𝗎𝗅𝗍 𝗂𝗇 𝗐𝖺𝗋𝗇𝗂𝗇𝗀𝗌 𝗈𝗋 𝗋𝖾𝗆𝗈𝗏𝖺𝗅 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝗐𝖨𝗍𝗁𝗈𝗎𝗍 𝗉𝗋𝗈𝗋𝗇𝗈𝗍𝗂𝖼𝖾. 𝖫𝖾𝗍'𝗌 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗐𝖾𝗅𝖼𝗈𝗆𝗂𝗇𝗀 𝖺𝗇𝖽 𝗋𝖾𝗌𝗉𝖾𝖼𝘁𝖿𝗎𝗅 𝖾𝗇𝗏𝗂𝗋𝗈𝗇𝗆𝖾𝗇𝗍 𝖿𝗈𝗋 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾. 𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝖼𝗈𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇!\n\n\n\nHELLO!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! 🥳♥")
                            : (msg = threadID.customJoin);
                          msg = msg
                            .replace(/\{uName}/g, nameArray.join(', '))
                            .replace(
                              /\{type}/g,
                              memLength.length > 1 ? 'you' : 'Friend'
                            )
                            .replace(/\{soThanhVien}/g, memLength.join(', '))
                            .replace(/\{threadName}/g, threadName);

                          let callback = function() {
                            return api.sendMessage(
                              {
                                body: msg,
                                attachment: fs.createReadStream(
                                  __dirname + `/cache/come.jpg`
                                ),
                                mentions,
                              },
                              event.threadID,
                              () => fs.unlinkSync(__dirname + `/cache/come.jpg`)
                            );
                          };
                          const avatarImg = [
                            'https://imgur.com/cQr1H9K.png',
                            'https://imgur.com/AM2GcVW.png',
                            'https://imgur.com/mzLlNRU.png',
                            'https://imgur.com/At9Ue26.png',
                            'https://imgur.com/oFobpnX.png',
                            'https://imgur.com/nNF2cIC.png',
                            'https://imgur.com/c8Wg0c5.png',
                            'https://imgur.com/Gu57rQc.png',
                            'https://imgur.com/i7Sdmde.png',
                          ];

                          // Generate a random index
                          const randomIndex = Math.floor(
                            Math.random() * avatarImg.length
                          );

                          const profilePicUrl = `https://graph.facebook.com/${userID}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`;

                          // Get the selected avatar
                          const selectedAvatar = avatarImg[randomIndex];
                          request(
                            encodeURI(
                              `https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/SPntrcb/Picsart-24-02-21-11-31-58-712.jpg&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The ${participantIDs.length}th+Member&avatar=${selectedAvatar}`
                            )
                          )
                            .pipe(
                              fs.createWriteStream(
                                __dirname + `/cache/come.jpg`
                              )
                            )
                            .on('close', callback);
                        }
                      });
                    }
                  } catch (err) {
                    return console.log('ERROR: ' + err);
                  }
                }
              }
            }
            if (event.body !== null) {
              if (event.logMessageType === 'log:unsubscribe') {
                api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
                  let leaverID = event.logMessageData.leftParticipantFbId;
                  api.getUserInfo(leaverID, (err, userInfo) => {
                    if (err) {
                      return console.error('Failed to get user info:', err);
                    }
                    const name = userInfo[leaverID].name;
                    const type =
                      event.author == event.logMessageData.leftParticipantFbId
                        ? 'left the group.'
                        : 'kicked by Admin of the group';
                    api.sendMessage(
                      `${name} has ${type} the group.`,
                      event.threadID
                    );
                  });
                });
              }
            }

            // if (event.body) {
            //   const emojis = [
            //     "😀",
            //     "😳",
            //     "♥️",
            //     "😪",
            //     "🥲",
            //     "🙀",
            //     "😘",
            //     "🥺",
            //     "🚀",
            //     "😝",
            //     "🥴",
            //     "😐",
            //     "😆",
            //     "😊",
            //     "🤩",
            //     "😼",
            //     "😽",
            //     "🤭",
            //     "🐱",
            //     "😹",
            //   ];
            //   const randomEmoji =
            //     emojis[Math.floor(Math.random() * emojis.length)];

            //   api.setMessageReaction(
            //     randomEmoji,
            //     event.messageID,
            //     () => {},
            //     true
            //   );
            // }

            // Check the autoseen setting from config and apply accordingly
            if (event.body !== null) {
              api.markAsReadAll(() => {});
            }

            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            // CUSTOM

            // CUSTOM
            if (error) {
              if (error === 'Connection closed.') {
              }
            }
            if (event?.senderID === userid) return;
            //here
            let history = (await fs.existsSync('./data/history.json'))
              ? JSON.parse(fs.readFileSync('./data/history.json'))
              : {};
            if (
              !userid === event.senderID ||
              database.length === 0 ||
              !Object.keys(database[0]?.Threads || {}).includes(event?.threadID)
            ) {
              create = createThread(event.threadID, api);
            } else {
              update = updateThread(event?.senderID);
            }
            let blacklist =
              (history.find((blacklist) => blacklist.userid === userid) || {})
                .blacklist || [];
            let hasPrefix =
              event.body &&
              aliases(
                (event.body || '')
                  ?.trim()
                  .toLowerCase()
                  .split(/ +/)
                  .shift()
              )?.hasPrefix == false
                ? ''
                : prefix;
            let [command, ...args] = (event.body || '')
              .trim()
              .toLowerCase()
              .startsWith(hasPrefix?.toLowerCase())
              ? (event.body || '')
                  .trim()
                  .substring(hasPrefix?.length)
                  .trim()
                  .split(/\s+/)
                  .map((arg) => arg.trim())
              : [];
            if (hasPrefix && aliases(command)?.hasPrefix === false) {
              api.sendMessage(
                `Invalid usage this command doesn't need a prefix`,
                event.threadID,
                event.messageID
              );
              return;
            }
            if (
              event.body &&
              enableCommands[0].commands.includes(
                aliases(command?.toLowerCase())?.name
              )
            ) {
              const role = aliases(command)?.role ?? 0;
              const isAdmin =
                config?.[0]?.masterKey?.admin?.includes(event.senderID) ||
                admin.includes(event.senderID);
              const isThreadAdmin =
                isAdmin ||
                Object.values(
                  database[0]?.Threads[event.threadID]?.adminIDs || {}
                ).some((admin) => admin.id === event.senderID);
              if (
                (role === 1 && !isAdmin) ||
                (role === 2 && !isThreadAdmin) ||
                (role === 3 &&
                  !config?.[0]?.masterKey?.admin?.includes(event.senderID))
              ) {
                api.sendMessage(
                  `You don't have permission to use this command.`,
                  event.threadID,
                  event.messageID
                );
                return;
              }
            }
            if (
              event.body &&
              event.body?.toLowerCase().startsWith(prefix.toLowerCase()) &&
              aliases(command)?.name &&
              enableCommands[0].commands.includes(
                aliases(command?.toLowerCase())?.name
              )
            ) {
              if (blacklist.includes(event.senderID)) {
                api.sendMessage(
                  "We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.",
                  event.threadID,
                  event.messageID
                );
                return;
              }
            }
            if (event.body && aliases(command)?.name) {
              const now = Date.now();
              const name = aliases(command)?.name;
              const sender = Utils.cooldowns.get(
                `${event.senderID}_${name}_${userid}`
              );
              const delay = aliases(command)?.cooldown ?? 0;
              if (!sender || now - sender.timestamp >= delay * 1000) {
                Utils.cooldowns.set(`${event.senderID}_${name}_${userid}`, {
                  timestamp: now,
                  command: name,
                });
              } else {
                const active = Math.ceil(
                  (sender.timestamp + delay * 1000 - now) / 1000
                );
                api.sendMessage(
                  `Please wait ${active} seconds before using the "${name}" command again.`,
                  event.threadID,
                  event.messageID
                );
                return;
              }
            }
            if (
              event.body &&
              !command &&
              event.body?.toLowerCase().startsWith(prefix.toLowerCase())
            ) {
              api.sendMessage(
                `Invalid command please use ${prefix}help to see the list of available commands.`,
                event.threadID,
                event.messageID
              );
              return;
            }
            if (
              event.body &&
              command &&
              prefix &&
              event.body?.toLowerCase().startsWith(prefix.toLowerCase()) &&
              !aliases(command)?.name
            ) {
              api.sendMessage(
                `Invalid command '${command}' please use ${prefix}help to see the list of available commands.`,
                event.threadID,
                event.messageID
              );
              return;
            }
            for (const { handleEvent, name } of Utils.handleEvent.values()) {
              if (
                handleEvent &&
                name &&
                ((enableCommands[1].handleEvent || []).includes(name) ||
                  (enableCommands[0].commands || []).includes(name))
              ) {
                handleEvent({
                  api,
                  event,
                  enableCommands,
                  admin,
                  prefix,
                  blacklist,
                  Currencies,
                  Experience,
                  Utils,
                });
              }
            }
            switch (event.type) {
              case 'message':
              case 'message_unsend':
              case 'message_reaction':
              case 'message_reply':
              case 'message_reply':
                if (
                  enableCommands[0].commands.includes(
                    aliases(command?.toLowerCase())?.name
                  )
                ) {
                  Utils.handleReply.findIndex(
                    (reply) => reply.author === event.senderID
                  ) !== -1
                    ? (api.unsendMessage(
                        Utils.handleReply.find(
                          (reply) => reply.author === event.senderID
                        ).messageID
                      ),
                      Utils.handleReply.splice(
                        Utils.handleReply.findIndex(
                          (reply) => reply.author === event.senderID
                        ),
                        1
                      ))
                    : null;
                  await (aliases(command?.toLowerCase())?.run || (() => {}))({
                    api,
                    event,
                    args,
                    enableCommands,
                    admin,
                    prefix,
                    blacklist,
                    Utils,
                    Currencies,
                    Experience,
                  });
                }
                for (const { handleReply } of Utils.ObjectReply.values()) {
                  if (
                    Array.isArray(Utils.handleReply) &&
                    Utils.handleReply.length > 0
                  ) {
                    if (!event.messageReply) return;
                    const indexOfHandle = Utils.handleReply.findIndex(
                      (reply) => reply.author === event.messageReply.senderID
                    );
                    if (indexOfHandle !== -1) return;
                    await handleReply({
                      api,
                      event,
                      args,
                      enableCommands,
                      admin,
                      prefix,
                      blacklist,
                      Utils,
                      Currencies,
                      Experience,
                    });
                  }
                }
                break;
            }
          });
          watchDatabaseChanges();
        } catch (error) {
          console.error('Error during API listen, outside of listen', userid);
          Utils.account.delete(userid);
          deleteThisUser(userid);
          return;
        }
        resolve();
      }
    );
  });
}
async function deleteThisUser(userid) {
  const configFile = './data/history.json';
  let config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const sessionFile = path.join('./data/session', `${userid}.json`);
  const index = config.findIndex((item) => item.userid === userid);
  if (index !== -1) config.splice(index, 1);
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  try {
    fs.unlinkSync(sessionFile);
  } catch (error) {
    console.log(error);
  }
}
async function addThisUser(
  userid,
  enableCommands,
  state,
  prefix,
  admin,
  blacklist
) {
  const configFile = './data/history.json';
  const sessionFolder = './data/session';
  const sessionFile = path.join(sessionFolder, `${userid}.json`);
  if (fs.existsSync(sessionFile)) return;
  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  config.push({
    userid,
    prefix: prefix || '',
    admin: admin || [],
    blacklist: blacklist || [],
    enableCommands,
    time: 0,
  });
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  fs.writeFileSync(sessionFile, JSON.stringify(state));
}

function aliases(command) {
  const aliases = Array.from(Utils.commands.entries()).find(([commands]) =>
    commands.includes(command?.toLowerCase())
  );
  if (aliases) {
    return aliases[1];
  }
  return null;
}
async function main() {
  const empty = require('fs-extra');
  const cacheFile = './script/cache';
  if (!fs.existsSync(cacheFile)) fs.mkdirSync(cacheFile);
  const configFile = './data/history.json';
  if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, '[]', 'utf-8');
  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const sessionFolder = path.join('./data/session');
  if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);
  const adminOfConfig =
    fs.existsSync('./data') && fs.existsSync('./data/config.json')
      ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8'))
      : createConfig();
  cron.schedule(
    `*/${adminOfConfig[0].masterKey.restartTime} * * * *`,
    async () => {
      const history = JSON.parse(
        fs.readFileSync('./data/history.json', 'utf-8')
      );
      history.forEach((user) => {
        !user || typeof user !== 'object' ? process.exit(1) : null;
        user.time === undefined || user.time === null || isNaN(user.time)
          ? process.exit(1)
          : null;
        const update = Utils.account.get(user.userid);
        update ? (user.time = update.time) : null;
      });
      await empty.emptyDir(cacheFile);
      await fs.writeFileSync(
        './data/history.json',
        JSON.stringify(history, null, 2)
      );
      //api.sendMessage("restarting", "5776059305779745");
      process.exit(1);
    }
  );
  try {
    for (const file of fs.readdirSync(sessionFolder)) {
      const filePath = path.join(sessionFolder, file);
      try {
        const { enableCommands, prefix, admin, blacklist } =
          config.find((item) => item.userid === path.parse(file).name) || {};
        const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (enableCommands)
          await accountLogin(state, enableCommands, prefix, admin, blacklist);
      } catch (error) {
        deleteThisUser(path.parse(file).name);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createConfig() {
  const config = [
    {
      masterKey: {
        admin: ['100076613706558'],
        devMode: false,
        database: false,
        restartTime: 99999999,
      },
      fcaOption: {
        forceLogin: true,
        listenEvents: true,
        logLevel: 'silent',
        updatePresence: true,
        selfListen: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64',
        online: true,
        autoMarkDelivery: false,
        autoMarkRead: false,
      },
    },
  ];
  const dataFolder = './data';
  if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
  fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2));
  return config;
}
async function createThread(threadID, api) {
  try {
    const database = JSON.parse(
      fs.readFileSync('./data/database.json', 'utf8')
    );
    const threadInfo = await api.getThreadInfo(threadID);
    const Threads = database.findIndex((Thread) => Thread.Threads);
    const Users = database.findIndex((User) => User.Users);
    if (Threads !== -1) {
      database[Threads].Threads[threadID] = {
        threadName: threadInfo.threadName,
        participantIDs: threadInfo.participantIDs,
        adminIDs: threadInfo.adminIDs,
      };
    } else {
      const Threads = threadInfo.isGroup
        ? {
            [threadID]: {
              threadName: threadInfo.threadName,
              participantIDs: threadInfo.participantIDs,
              adminIDs: threadInfo.adminIDs,
            },
          }
        : {};
      database.push({
        Threads: {
          Threads,
        },
      });
    }
    if (Users !== -1) {
      threadInfo.userInfo.forEach((userInfo) => {
        const Thread = database[Users].Users.some(
          (user) => user.id === userInfo.id
        );
        if (!Thread) {
          database[Users].Users.push({
            id: userInfo.id,
            name: userInfo.name,
            money: 0,
            exp: 0,
            level: 1,
          });
        }
      });
    } else {
      const Users = threadInfo.isGroup
        ? threadInfo.userInfo.map((userInfo) => ({
            id: userInfo.id,
            name: userInfo.name,
            money: 0,
            exp: 0,
            level: 1,
          }))
        : [];
      database.push({
        Users,
      });
    }
    await fs.writeFileSync(
      './data/database.json',
      JSON.stringify(database, null, 2),
      'utf-8'
    );
    return database;
  } catch (error) {
    console.log(error);
  }
}
async function createDatabase() {
  const data = './data';
  const database = './data/database.json';

  if (!fs.existsSync(data)) {
    fs.mkdirSync(data, {
      recursive: true,
    });
  }

  if (
    !fs.existsSync(database) ||
    fs.readFileSync(database, 'utf-8').trim() === ''
  ) {
    // If database.json doesn't exist or is empty, fetch it from GitHub and write to local file
    try {
      const githubURL =
        'https://raw.githubusercontent.com/JCFcodex/FBBOT-LATEST/main/data/database.json';
      const response = await axios.get(githubURL, {
        headers: {
          Authorization: `Bearer ${fs
            .readFileSync('token.txt', 'utf8')
            .trim()}`,
        },
      });

      const jsonData = JSON.stringify(response.data); // Convert to JSON string

      fs.writeFileSync(database, jsonData);
      console.log('Database.json created and populated with GitHub data.');
    } catch (error) {
      console.error('Error fetching or writing GitHub data:', error.message);
    }
  } else {
    try {
      // Attempt to parse the existing database.json
      JSON.parse(fs.readFileSync(database, 'utf-8'));
    } catch (error) {
      console.error('Error parsing database.json:', error);
      console.log('Attempting to create a new valid database.json.');

      // Handle the error appropriately, e.g., by initializing the database with a default value
      fs.writeFileSync(database, JSON.stringify([]));
    }
  }
  console.error('Creating a new database.');
  return;
}
async function updateThread(id) {
  const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
  const user = database[1]?.Users.find((user) => user.id === id);
  if (!user) {
    return;
  }
  user.exp += 1;
  await fs.writeFileSync(
    './data/database.json',
    JSON.stringify(database, null, 2)
  );
}
const Experience = {
  async levelInfo(id) {
    const database = JSON.parse(
      fs.readFileSync('./data/database.json', 'utf8')
    );
    const data = database[1].Users.find((user) => user.id === id);
    if (!data) {
      return;
    }
    return data;
  },
  async levelUp(id) {
    const database = JSON.parse(
      fs.readFileSync('./data/database.json', 'utf8')
    );
    const data = database[1].Users.find((user) => user.id === id);
    if (!data) {
      return;
    }
    data.level += 1;
    await fs.writeFileSync(
      './data/database.json',
      JSON.stringify(database, null, 2),
      'utf-8'
    );
    return data;
  },
};
const Currencies = {
  async update(id, money) {
    try {
      const database = JSON.parse(
        fs.readFileSync('./data/database.json', 'utf8')
      );
      const data = database[1].Users.find((user) => user.id === id);
      if (!data || !money) {
        return;
      }
      data.money += money;
      await fs.writeFileSync(
        './data/database.json',
        JSON.stringify(database, null, 2),
        'utf-8'
      );
      return data;
    } catch (error) {
      console.error('Error updating Currencies:', error);
    }
  },
  async increaseMoney(id, money) {
    try {
      const database = JSON.parse(
        fs.readFileSync('./data/database.json', 'utf8')
      );
      const data = database[1].Users.find((user) => user.id === id);
      if (!data) {
        return;
      }
      if (data && typeof data.money === 'number' && typeof money === 'number') {
        data.money += money;
      }
      await fs.writeFileSync(
        './data/database.json',
        JSON.stringify(database, null, 2),
        'utf-8'
      );
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  },
  async decreaseMoney(id, money) {
    try {
      const database = JSON.parse(
        fs.readFileSync('./data/database.json', 'utf8')
      );
      const data = database[1].Users.find((user) => user.id === id);
      if (!data) {
        return;
      }
      if (data && typeof data.money === 'number' && typeof money === 'number') {
        data.money -= money;
      }
      await fs.writeFileSync(
        './data/database.json',
        JSON.stringify(database, null, 2),
        'utf-8'
      );
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  },
  async getData(id) {
    try {
      const database = JSON.parse(
        fs.readFileSync('./data/database.json', 'utf8')
      );
      const data = database[1].Users.find((user) => user.id === id);
      if (!data) {
        return;
      }
      return data;
    } catch (error) {
      console.error('Error checking Currencies:', error);
    }
  },
};
//
//
//
//
//
//
//
//
//
//
//

const octokit = new Octokit({
  auth: fs.readFileSync('token.txt', 'utf8').trim(), // Replace with your GitHub token
});

async function commitChanges(database) {
  try {
    await fs.promises.writeFile(
      './data/database.json',
      JSON.stringify(database, null, 2),
      'utf-8'
    );

    const repoContent = await octokit.repos.getContent({
      owner: 'JCFcodex',
      repo: 'FBBOT-LATEST',
      path: 'data/database.json',
    });

    await octokit.repos.createOrUpdateFileContents({
      owner: 'JCFcodex',
      repo: 'FBBOT-LATEST',
      path: 'data/database.json',
      message: 'Update database.json',
      content: Buffer.from(JSON.stringify(database, null, 2)).toString(
        'base64'
      ),
      sha: repoContent.data.sha,
    });

    console.log('Changes committed to GitHub.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function watchDatabaseChanges() {
  let changesDetected = false;

  chokidar.watch('./data/database.json').on('change', () => {
    changesDetected = true;
  });

  cron.schedule('0,10,20,30,40,50 * * * *', async () => {
    if (changesDetected) {
      const existingData = await fs.promises.readFile(
        './data/database.json',
        'utf-8'
      );
      const database = JSON.parse(existingData);

      // Make your changes to the database
      if (database[1]?.Users && database[1].Users.length > 0) {
        database[1].Users[0].exp += 1;
      }

      await commitChanges(database);
      changesDetected = false;
    }
  });
}

main(); // Call main() after committing changes
