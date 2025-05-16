import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

const drawerWidth = 220;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Users", icon: <PeopleIcon />, path: "/users" },
  { text: "Bookings", icon: <BookIcon />, path: "/bookings" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const drawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Toolbar
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 80,
          }}
        >
          <DashboardCustomizeIcon
            sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
          />
          {/* <Typography variant="h6" noWrap component="div">
            ePark Admin
          </Typography> */}
        </Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(0, 0, 0, 0.08)"
                    : "transparent",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
      <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <ListItem
          component="button"
          onClick={handleLogout}
          sx={{ color: "#d32f2f" }}
          disableGutters
        >
          <ListItemIcon sx={{ color: "#d32f2f" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 13V11H8V8L3 12L8 16V13H16Z" fill="currentColor" />
              <path
                d="M20 3H12C10.9 3 10 3.9 10 5V9H12V5H20V19H12V15H10V19C10 20.1 10.9 21 12 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z"
                fill="currentColor"
              />
            </svg>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
