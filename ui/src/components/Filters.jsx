import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const teamOptions = ["Backend", "Frontend", "DevOps", "QA"];
const priorityOptions = ["Low", "Medium", "High"];

export default function Filters({ onFilter }) {
  const [predictedTeam, setPredictedTeam] = useState("");
  const [priority, setPriority] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleApply = () => {
    onFilter({ predictedTeam, priority, fromDate, toDate });
  };

  const handleClear = () => {
    setPredictedTeam("");
    setPriority("");
    setFromDate(null);
    setToDate(null);
    onFilter({});
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="predictedTeam"
          select
          value={predictedTeam}
          onChange={(e) => setPredictedTeam(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {teamOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Priority"
          select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="From Date"
          value={fromDate}
          onChange={setFromDate}
          slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
        />

        <DatePicker
          label="To Date"
          value={toDate}
          onChange={setToDate}
          slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
        />

        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
