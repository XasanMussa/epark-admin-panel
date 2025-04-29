import React, { useEffect, useState } from "react";
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
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchAllUsers, setUserActiveStatus } from "../api/firebase";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

interface User {
  id: string;
  displayName?: string;
  email?: string;
  isActive?: boolean;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleActive = async (user: User) => {
    setUpdating(user.id);
    try {
      await setUserActiveStatus(user.id, !user.isActive);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: !user.isActive } : u
        )
      );
    } catch {
      setError("Failed to update user status.");
    }
    setUpdating(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.displayName || "-"}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <>
                          <CheckIcon color="success" fontSize="small" /> Active
                        </>
                      ) : (
                        <>
                          <BlockIcon color="error" fontSize="small" /> Inactive
                        </>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={!!user.isActive}
                        onChange={() => handleToggleActive(user)}
                        color="primary"
                        disabled={updating === user.id}
                        inputProps={{
                          "aria-label": "Activate/Deactivate user",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default UsersPage;
