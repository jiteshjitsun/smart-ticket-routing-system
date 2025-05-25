const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

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
    createdAt: new Date(),
  };

  await db.collection("tickets").add(doc);
  console.log("✅ Ticket saved to Firestore");
}

module.exports = saveToFirestore;
