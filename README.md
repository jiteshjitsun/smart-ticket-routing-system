# smart-ticket-routing-system
- This is a smart ticket routing system integrated with Jira, which automatically routes tickets to the appropriate team based on the ticket's priority and urgency.

# High level design

    Jira Webhook (New/Updated Ticket)
        ↓
    Ticket Listener (Webhook Server)
        ↓
    Preprocessing Module
        ↓
    ML Routing Engine (Predict Team)
        ↓
    Update Ticket via Jira API
        ↓
    Store Metadata in Firestore/DB
        ↓
    UI Dashboard (Optional)

# tech used 

- Express.js
- ML Model - HuggingFace/ scikit-learn
- Jira REST API
- Firestore
- React
- Node.js
- Python
- Node cron - for scheduling => For retries, failed tickets

# Architecture

 +----------------+     Jira Webhook      +-----------------------+
|    Jira Cloud  | ───────────────────▶ |  Express Webhook API  |
+----------------+                      +-----------------------+
                                                 │
                                                 ▼
                                        +--------------------+
                                        | Preprocessing Layer|
                                        +--------------------+
                                                 │
                                                 ▼
                                        +--------------------+
                                        | ML Routing Engine  |
                                        | (TF-IDF or BERT)   |
                                        +--------------------+
                                                 │
                    ┌────────────────────────────┴────────────────────────────┐
                    ▼                                                         ▼
        +---------------------+                                    +-------------------+
        | Jira REST API (PUT) |◀──────── Assignment Update ───────▶|   Jira Ticket UI  |
        +---------------------+                                    +-------------------+

                                                 ▼
                                     +-----------------------+
                                     |   Firestore / MongoDB |
                                     +-----------------------+
                                                 │
                                                 ▼
                                     +-----------------------+
                                     |    React + Tailwind   |
                                     |  UI Dashboard (Vite)  |
                                     +-----------------------+
