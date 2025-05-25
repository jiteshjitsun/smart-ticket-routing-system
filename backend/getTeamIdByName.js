// services/jira/getTeamIdByName.js
const axios = require("axios");

const getTeamIdByName = async (teamName, email, apiToken) => {
  try {
    const response = await axios.get(
      "https://api.atlassian.com/team/v1/teams",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`,
          Accept: "application/json"
        }
      }
    );

    const teams = response.data.values || [];

    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());

    if (!team) {
      throw new Error(`Team "${teamName}" not found in Atlassian.`);
    }

    return team.id;
  } catch (err) {
    console.error("Error fetching team ID:", err.message);
    throw err;
  }
};

module.exports = getTeamIdByName;
