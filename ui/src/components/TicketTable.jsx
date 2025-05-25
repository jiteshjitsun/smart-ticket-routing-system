import React, { useEffect, useState } from "react";
import {
  collection, onSnapshot, query, orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Chip,
  Box, Avatar, Skeleton, useTheme, alpha
} from "@mui/material";
import {
  ConfirmationNumber as TicketIcon,
  Schedule as TimeIcon,
  Group as TeamIcon,
  Flag as PriorityIcon
} from "@mui/icons-material";

export default function TicketTable({ filters }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply filters
      const filtered = allTickets.filter((ticket) => {
        const { team, priority, fromDate, toDate, search } = filters;
      
        const matchesTeam = team ? ticket.team === team : true;
        const matchesPriority = priority ? ticket.priority === priority : true;
      
        let matchesDate = true;
        if (fromDate) {
          matchesDate =
            matchesDate &&
            new Date(ticket.createdAt?.toDate?.()) >= new Date(fromDate);
        }
        if (toDate) {
          matchesDate =
            matchesDate &&
            new Date(ticket.createdAt?.toDate?.()) <= new Date(toDate);
        }
      
        const matchesSearch = search
          ? ticket.summary?.toLowerCase().includes(search.toLowerCase()) ||
            ticket.id?.toLowerCase().includes(search.toLowerCase())
          : true;
      
        return matchesTeam && matchesPriority && matchesDate && matchesSearch;
      });      

      setTickets(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filters]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'new':
        return 'primary';
      case 'in progress':
      case 'assigned':
        return 'info';
      case 'resolved':
      case 'closed':
        return 'success';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTeamAvatar = (team) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f'];
    const colorIndex = team ? team.length % colors.length : 0;
    return colors[colorIndex];
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '-';
    const date = timestamp.toDate();
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
              {['ID', 'Summary', 'Team', 'Priority', 'Status', 'Created'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (tickets.length === 0) {
    return (
      <Box 
        sx={{ 
          mt: 4, 
          textAlign: 'center', 
          py: 8,
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 2,
          border: `1px dashed ${theme.palette.grey[300]}`
        }}
      >
        <TicketIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tickets found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or create a new ticket
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 3, 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow 
            sx={{ 
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiTableCell-head': {
                fontWeight: 600,
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TicketIcon fontSize="small" />
                ID
              </Box>
            </TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TeamIcon fontSize="small" />
                Team
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PriorityIcon fontSize="small" />
                Priority
              </Box>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" />
                Created
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow 
              key={ticket.id}
              sx={{ 
                '&:hover': { 
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                },
                '&:nth-of-type(even)': {
                  backgroundColor: alpha(theme.palette.grey[50], 0.5)
                },
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
            >
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    backgroundColor: alpha(theme.palette.grey[100], 0.8),
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                    fontSize: '0.75rem'
                  }}
                >
                  {ticket.id.slice(-8)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={ticket.summary}
                >
                  {ticket.summary}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      fontSize: '0.75rem',
                      backgroundColor: getTeamAvatar(ticket.predictedTeam)
                    }}
                  >
                    {ticket.predictedTeam?.charAt(0)?.toUpperCase() || '?'}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {ticket.predictedTeam || 'Unassigned'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={ticket.priority || 'Medium'} 
                  color={getPriorityColor(ticket.priority)}
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    minWidth: 70,
                    textTransform: 'capitalize'
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={ticket.status || 'Open'} 
                  color={getStatusColor(ticket.status)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    minWidth: 80,
                    textTransform: 'capitalize'
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {formatDate(ticket.createdAt)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
