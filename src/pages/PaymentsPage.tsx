import React from "react";
import { Typography, Paper, Box } from "@mui/material";

const PaymentsPage: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Payments & Transactions
    </Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>Payment and transaction monitoring will be here.</Typography>
    </Paper>
  </Box>
);

export default PaymentsPage;
