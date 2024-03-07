const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'src', 'timer.json');

module.exports = async ({ api }) => {
  try {
    console.log(`\nTimer is Running..\n`);
    let count = readTimerValue();

    const timerInterval = setInterval(() => {
      count++;
      saveTimerValue(count);

      const formattedTime = convertSecondsToTime(count);
    }, 1000); //1hour

    // Your logic goes here
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

function readTimerValue() {
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return parseInt(fileContent) || 0;
    } else {
      // Create the file with an initial value
      saveTimerValue(0);
      return 0;
    }
  } catch (error) {
    return 0;
  }
}

function saveTimerValue(value) {
  fs.writeFileSync(filePath, value.toString(), 'utf-8');
}

function convertSecondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
  return formattedTime;
}
