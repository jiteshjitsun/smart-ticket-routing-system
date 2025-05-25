import React, { useState } from "react";
import TicketTable from "./components/TicketTable";
import Filters from "./components/Filters";
import { Container, Typography } from "@mui/material";

function App() {
  const [filters, setFilters] = useState({
    team: "",
    priority: "",
    fromDate: "",
    toDate: ""
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Jira Smart Ticket Dashboard
      </Typography>
      <Filters filters={filters} setFilters={setFilters} />
      <TicketTable filters={filters} />
    </Container>
  );
}

export default App;
