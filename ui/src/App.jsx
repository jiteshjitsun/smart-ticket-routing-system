import React, { useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import TicketTable from "./components/TicketTable";
import Filters from "./components/Filters";

function App() {
  const [filters, setFilters] = useState({});
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Jira Smart Ticket Routing
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Filters  onFilter={setFilters} />
      </Paper>

      <TicketTable filters={filters}  />
    </Container>
  );
}

export default App;
