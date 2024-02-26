const axios = require("axios");

module.exports.config = {
  name: "github",
  version: "1.0",
  role: 0,
  credits: "Developer",
  description: "Get GitHub user information",
  commandCategory: "utility",
  hasPrefix: true,
  usages: ["github <username>"],
  cooldown: 10,
};

function formatDate(dateString) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

module.exports.run = async function({ api, event, args }) {
  // Check if the command is called with a username
  if (args.length !== 1) {
    api.sendMessage(
      "⚠️ Please provide a GitHub username. Usage: github <username>",
      event.threadID
    );
    return;
  }

  const userName = args[0];

  try {
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    // Make a request to the GitHub API
    const response = await axios.get(
      `https://api.popcat.xyz/github/${userName}`
    );

    // Check if the response is successful
    if (response.status === 200) {
      const userData = response.data;

      // Format the user information with GitHub-themed emojis
      const userInfo = `
ℹ GitHub User Information:

- Username: ${userData.name}
- Bio: ${userData.bio}
- Followers: ${userData.followers}
- Following: ${userData.following}

- Public Repo: ${userData.public_repos}
- Account Type: ${userData.account_type}
- Created At: ${formatDate(userData.created_at)}
- Updated At: ${formatDate(userData.updated_at)}
- GitHub URL: ${userData.url}
      `;

      // Send the stylized user information to the chat
      api.sendMessage(userInfo, event.threadID);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } else {
      // Handle other status codes if needed
      api.sendMessage(
        `❌ Error fetching GitHub user information. Status Code: ${response.status}`,
        event.threadID
      );
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching GitHub user information:", error);
    api.sendMessage(
      "❌ An error occurred while fetching GitHub user information.",
      event.threadID
    );
  }
};
