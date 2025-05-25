require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const predictTeam = require("./predictTeam");
const saveToFirestore = require("./firestore");

const app = express();
app.use(cors());
app.use(express.json());
console.log("🚀 Server ready at http://localhost:3000");
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

const db = admin.firestore();

app.get("/jira-webhook", (req, res) => {
  res.send("👋 This endpoint only accepts POST requests from Jira.");
});

app.post("/jira-webhook", express.json(), async (req, res) => {
  console.log("📦 Webhook payload:", req.body);
  try {
    const { issue, webhookEvent } = req.body;

    if (!issue || webhookEvent !== "jira:issue_created") {
      return res.status(200).json({ message: "Ignoring non-create webhook" });
    }

    const ticketData = {
      key: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description,
      issueType: issue.fields.issuetype.name,
      project: issue.fields.project.name,
      createdAt: issue.fields.created,
      updatedAt: issue.fields.updated,
    };

    console.log("🎫 New Ticket:", ticketData);
    const team = await predictTeam(ticketData);
    await saveToFirestore(ticketData, team);
    console.log("Predicted team:", team);

    res.status(200).json({ message: "Ticket received" });
  } catch (err) {
    console.error("Error saving ticket:", err);
    res.status(500).json({ error: "Failed to process ticket" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
