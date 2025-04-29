import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBookings,
  fetchBookingsByType,
  updateBookingStatus,
  Booking,
} from "../api/firebase";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";

const statusColors = {
  pending: "warning",
  active: "success",
  completed: "info",
  cancelled: "error",
} as const;

const BookingsPage: React.FC = () => {
  const [bookingType, setBookingType] = useState<"all" | "hotel" | "parking">(
    "all"
  );
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings", bookingType],
    queryFn: () =>
      bookingType === "all"
        ? fetchAllBookings()
        : fetchBookingsByType(bookingType),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      bookingId,
      status,
    }: {
      userId: string;
      bookingId: string;
      status: Booking["status"];
    }) => updateBookingStatus(userId, bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Failed to update booking status:", error);
      // Show error in UI
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update booking status";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const handleStatusChange = (
    booking: Booking,
    newStatus: Booking["status"]
  ) => {
    if (newStatus === booking.status) return; // Don't update if status hasn't changed

    // Add validation for required fields
    if (!booking.userId) {
      enqueueSnackbar("Booking is missing userId", { variant: "error" });
      console.error("Booking missing userId:", booking);
      return;
    }

    if (!booking.id) {
      enqueueSnackbar("Booking is missing bookingId", { variant: "error" });
      console.error("Booking missing id:", booking);
      return;
    }

    console.log("Updating booking status:", {
      userId: booking.userId,
      bookingId: booking.id,
      oldStatus: booking.status,
      newStatus,
    });

    updateStatusMutation.mutate({
      userId: booking.userId,
      bookingId: booking.id,
      status: newStatus,
    });
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    return format(date, "MMM dd, yyyy HH:mm");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      <Paper sx={{ p: 3, mt: 2, overflowX: "auto" }}>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Booking Type</InputLabel>
            <Select
              value={bookingType}
              label="Booking Type"
              onChange={(e) =>
                setBookingType(e.target.value as typeof bookingType)
              }
            >
              <MenuItem value="all">All Bookings</MenuItem>
              <MenuItem value="hotel">Hotel Only</MenuItem>
              <MenuItem value="parking">Parking Only</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load bookings. Please try again later.
            {error instanceof Error && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Error: {error.message}
              </Typography>
            )}
          </Alert>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">Type</TableCell>
                  <TableCell width="20%">User</TableCell>
                  <TableCell width="15%">Details</TableCell>
                  <TableCell width="15%">Start Date</TableCell>
                  <TableCell width="15%">End Date</TableCell>
                  <TableCell width="10%">Total Price</TableCell>
                  <TableCell width="10%">Status</TableCell>
                  <TableCell width="10%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings?.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Tooltip
                        title={booking.type === "hotel" ? "Hotel" : "Parking"}
                      >
                        <IconButton size="small" color="primary">
                          {booking.type === "hotel" ? (
                            <HotelIcon />
                          ) : (
                            <LocalParkingIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.userName || "N/A"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block" }}
                      >
                        {booking.userEmail || "No email"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.type === "hotel"
                          ? `Room ${booking.roomNumber || "N/A"}`
                          : `Spot ${booking.parkingSpot || "N/A"}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(booking.startDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(booking.endDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        $
                        {booking.totalPrice?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        }) || "0.00"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={statusColors[booking.status]}
                        size="small"
                        sx={{ minWidth: 85 }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={booking.status}
                          onChange={(e) =>
                            handleStatusChange(
                              booking,
                              e.target.value as Booking["status"]
                            )
                          }
                          disabled={updateStatusMutation.isPending}
                          size="small"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
                {(!bookings || bookings.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        No bookings found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default BookingsPage;
