// backend/utils/updateJiraTicketWithTeam.js
const axios = require("axios");
// Replace these with your Jira instance details
const JIRA_BASE_URL = "https://jitsun.atlassian.net/";
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const teamMap = require('./jiraTeamMap');
const getTeamIdByName = require("./getTeamIdByName");


// Team field in Jira (you can find this by inspecting the field or via API)
const TEAM_FIELD_ID = "customfield_10001"; // <- Replace with yours

// const getCreateMeta = async () => {
//   try {
//     const res = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/createmeta`, {
//       params: {
//         projectKeys: "SCRUM",
//         expand: 'projects.issuetypes.fields',
//       },
//       auth: {
//         username: JIRA_EMAIL,
//         password: JIRA_API_TOKEN,
//       },
//       headers: {
//         Accept: 'application/json',
//       },
//     });

//     console.dir(res.data, { depth: null });
//   } catch (err) {
//     console.error('❌ Failed to fetch create metadata:', err.response?.data || err.message);
//   }
// };

// getCreateMeta();

async function updateJiraTicketWithTeam(issueKey, teamValue,  email, apiToken) {
  const teamId = teamMap[teamValue]
  const url = `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;
  console.log("teamValue ", teamValue, teamId)
  try {
    const teamId = await getTeamIdByName(teamValue, email, apiToken);
    await axios.put(
      `https://your-domain.atlassian.net/rest/api/3/issue/${issueKey}`,
      {
        fields: {
          customfield_10001: {
            id: teamId
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error(
      "❌ Failed to update Jira:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  updateJiraTicketWithTeam,
};