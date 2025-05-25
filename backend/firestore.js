
const admin = require('firebase-admin');
const db = require("./firebase.js");

/**
 * Save ticket info to Firestore
 * @param {Object} ticketData
 * @param {string} team
 */
async function saveToFirestore(ticketData, team) {
  const doc = {
    summary: ticketData.summary,
    description: ticketData.description,
    predictedTeam: team,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection("tickets").add(doc);
  console.log("✅ Ticket saved to Firestore");
}

module.exports = saveToFirestore;
