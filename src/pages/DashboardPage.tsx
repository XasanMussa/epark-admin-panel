import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, DashboardStats } from "../api/dashboard";

interface StatCard {
  key: keyof DashboardStats;
  label: string;
  color: string;
  isCurrency?: boolean;
}

const statCards: StatCard[] = [
  { key: "totalUsers", label: "Total Users", color: "#1976d2" },
  { key: "activeUsers", label: "Active Users", color: "#388e3c" },
  { key: "totalBookings", label: "Total Bookings", color: "#ff9800" },
  { key: "activeBookings", label: "Active Bookings", color: "#8e24aa" },
  { key: "hotelBookings", label: "Hotel Bookings", color: "#3949ab" },
  { key: "parkingBookings", label: "Parking Bookings", color: "#00897b" },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    color: "#43a047",
    isCurrency: true,
  },
] as const;

const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    retry: 2,
  });

  const formatValue = (
    value: number | undefined,
    isCurrency: boolean = false
  ) => {
    if (value === undefined || value === null) return "0";

    try {
      if (isCurrency) {
        return `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return value.toLocaleString();
    } catch (err) {
      console.error("Error formatting value:", err);
      return "0";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "100%", width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            py: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Typography variant="caption" color="error">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </Typography>
          }
        >
          Failed to load dashboard metrics. Please try again later.
        </Alert>
      ) : data ? (
        <Grid container spacing={3}>
          {statCards.map((stat) => (
            <Grid
              component="div"
              key={stat.key}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <Card
                sx={{
                  borderLeft: `6px solid ${stat.color}`,
                  height: "100%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color={stat.color}>
                    {formatValue(data[stat.key], stat.isCurrency)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
};

export default DashboardPage;
