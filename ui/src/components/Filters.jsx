import React, { useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  Chip,
  InputAdornment,
  Collapse,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Group as TeamIcon,
  Flag as PriorityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

export default function Filters({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value && value !== "")
      .length;
  };

  const teams = [
    { value: "Frontend", color: "#2196f3", icon: "🎨" },
    { value: "Backend", color: "#4caf50", icon: "⚙️" },
    { value: "DevOps", color: "#ff9800", icon: "🚀" },
    { value: "QA", color: "#9c27b0", icon: "🔍" },
    { value: "Design", color: "#e91e63", icon: "✨" },
    { value: "Mobile", color: "#00bcd4", icon: "📱" },
  ];

  const priorities = [
    { value: "Low", color: "#4caf50", icon: "🟢" },
    { value: "Medium", color: "#ff9800", icon: "🟡" },
    { value: "High", color: "#f44336", icon: "🔴" },
    { value: "Critical", color: "#d32f2f", icon: "🚨" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
              }}
            >
              <FilterIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: theme.palette.text.primary }}
              >
                Filter Tickets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refine your search with advanced filters
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={`${getActiveFiltersCount()} active`}
                size="small"
                color="primary"
                sx={{ fontWeight: 500 }}
              />
            )}
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Search Bar - Always Visible */}
        <TextField
          label="Search tickets"
          placeholder="Search by summary, ID, or description..."
          fullWidth
          value={filters.search || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleChange("search", "")}
                  sx={{ color: "text.secondary" }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            },
          }}
        />

        {/* Advanced Filters - Collapsible */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3, opacity: 0.5 }} />

            <Grid container spacing={3}>
              {/* Team Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <TeamIcon fontSize="small" />
                    Team
                  </InputLabel>
                  <Select
                    value={filters.predictedTeam || ""}
                    label="Team"
                    onChange={(e) =>
                      handleChange("predictedTeam", e.target.value)
                    }
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8
                      ),
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9
                        ),
                      },
                    }}
                  >
                    <MenuItem value="">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>🏢</span>
                        All Teams
                      </Box>
                    </MenuItem>
                    {teams.map((team) => (
                      <MenuItem key={team.value} value={team.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span>{team.icon}</span>
                          {team.value}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Priority Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <PriorityIcon fontSize="small" />
                    Priority
                  </InputLabel>
                  <Select
                    value={filters.priority || ""}
                    label="Priority"
                    onChange={(e) => handleChange("priority", e.target.value)}
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8
                      ),
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9
                        ),
                      },
                    }}
                  >
                    <MenuItem value="">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>📋</span>
                        All Priorities
                      </Box>
                    </MenuItem>
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span>{priority.icon}</span>
                          {priority.value}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="From Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { display: "flex", alignItems: "center", gap: 1 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  value={filters.fromDate || ""}
                  onChange={(e) => handleChange("fromDate", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8
                      ),
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9
                        ),
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="To Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: { display: "flex", alignItems: "center", gap: 1 },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                  value={filters.toDate || ""}
                  onChange={(e) => handleChange("toDate", e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8
                      ),
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9
                        ),
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Active Filters Display */}
            {getActiveFiltersCount() > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Active Filters:
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={clearFilters}
                    sx={{
                      color: "error.main",
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {filters.search && (
                    <Chip
                      label={`Search: "${filters.search}"`}
                      onDelete={() => handleChange("search", "")}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {filters.predictedTeam && (
                    <Chip
                      label={`Team: ${filters.predictedTeam}`}
                      onDelete={() => handleChange("predictedTeam", "")}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {filters.priority && (
                    <Chip
                      label={`Priority: ${filters.priority}`}
                      onDelete={() => handleChange("priority", "")}
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {filters.fromDate && (
                    <Chip
                      label={`From: ${filters.fromDate}`}
                      onDelete={() => handleChange("fromDate", "")}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {filters.toDate && (
                    <Chip
                      label={`To: ${filters.toDate}`}
                      onDelete={() => handleChange("toDate", "")}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
}
