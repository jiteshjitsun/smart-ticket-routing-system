import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { fetchTickets } from "../services/api";

export default function TicketTable(filters) {
  console.log("Filters:", filters);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getTickets = async () => {
      try {
        const data = await fetchTickets(filters);
        console.log("Fetched tickets:", data);
        setTickets(data.tickets);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, [filters]);
  if (loading) {
    return <CircularProgress />;
  }
  console.log("Tickets:", tickets);
  if (!tickets.length) {
    return <Typography>No tickets found.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>
              <strong>Summary</strong>
            </TableCell>
            <TableCell>
              <strong>Team</strong>
            </TableCell>
            <TableCell>
              <strong>Description</strong>
            </TableCell>
            <TableCell>
              <strong>Priority</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell>
              <strong>Created At</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow key={index}>
              <TableCell>{ticket.summary}</TableCell>
              <TableCell>{ticket.predictedTeam}</TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>
                {new Date(
                  ticket.createdAt._seconds * 1000 +
                    ticket.createdAt._nanoseconds / 1000000
                ).toLocaleDateString()}{" "}
                {new Date(
                  ticket.createdAt._seconds * 1000 +
                    ticket.createdAt._nanoseconds / 1000000
                ).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
