const { exec } = require("child_process");
const path = require('path');

/**
 * Calls the Python script to predict the team for a given ticket
 * @param {Object} ticketData - { summary: string, description: string }
 * @returns {Promise<string>} - Predicted team name (e.g., 'Frontend')
 */
function predictTeam(ticketData) {
  return new Promise((resolve, reject) => {
    const inputText = `${ticketData.summary} ${ticketData.description}`.replace(/"/g, "'");
    const pythonScriptPath = path.resolve(__dirname, '..', 'ml', 'team_classifier.py');
    console.log('Resolved pathjgh:', pythonScriptPath);
    const command = `python3 "${pythonScriptPath}" predict "${inputText}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Prediction error:", stderr);
        return reject("Failed to predict team");
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = predictTeam;
