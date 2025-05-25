  const admin = require("firebase-admin");
  const db = require("./firebase");

  /**
 * Save ticket info to Firestore
 * @param {Object} ticketData
 * @param {string} predictedTeam
 */
  async function saveToFirestore(ticketData, predictedTeam) {
    try {
      const docData = {
        ...ticketData,
        predictedTeam,
        createdAt: ticketData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        lastModified: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection("tickets").add(docData);
      console.log(`✅ Ticket saved to Firestore with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error saving to Firestore:", error);
      throw error;
    }
  }

  module.exports = saveToFirestore;
