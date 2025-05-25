require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const predictTeam = require("./predictTeam");
const saveToFirestore = require("./firestore");

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend URL
}));
app.use(express.json());
console.log("🚀 Server ready at http://localhost:3000");

const db = require("./firebase.js");

app.get("/tickets", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const after = req.query.after; // timestamp string

    let query = db.collection("tickets")
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (after) {
      query = query.startAfter(new Date(after));
    }
    // Fetch up to 100 tickets, newest first
    const snapshot = await query.get();

    const tickets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ 
      tickets,
      lastVisible: tickets.length > 0 ? tickets[tickets.length - 1].createdAt : null
    });
  } catch (err) {
    console.error("❌ Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
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
