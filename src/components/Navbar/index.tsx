"use client";

/**
 * Componente Navbar
 * Barra de navegação principal com autenticação e navegação
 */

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as RankingIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const getDashboardPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "super_admin":
        return "/super-admin";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  const navigationItems = [
    { label: "Início", href: "/", icon: <HomeIcon /> },
    { label: "Rankings", href: "/ranking", icon: <RankingIcon /> },
  ];

  const authItems = isAuthenticated
    ? [
        {
          label: "Dashboard",
          href: getDashboardPath(),
          icon: <DashboardIcon />,
        },
        { label: "Meus Quiosques", href: "/kiosks", icon: <RestaurantIcon /> },
      ]
    : [
        { label: "Login", href: "/login", icon: <LoginIcon /> },
        { label: "Cadastrar", href: "/register", icon: <RegisterIcon /> },
      ];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {authItems.map((item) => (
            <ListItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              mr: 4,
            }}
          >
            Pedido Rápido
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Auth Section */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    href={getDashboardPath()}
                    color="inherit"
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>

                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account"
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    color="inherit"
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "grey.300",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                    startIcon={<RegisterIcon />}
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <AccountIcon sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Sair
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
};

export default Navbar;
