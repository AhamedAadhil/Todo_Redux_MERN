import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/User";
import axios from "axios";

const pages = ["Completed", "InCompleted"];
const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.user.token);
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [errormessage, setErrormessage] = React.useState("");
  const [successmessage, setSuccessmessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setErrormessage("");
    setSuccessmessage("");
    setLoading(false);
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    try {
      setLoading(true);
      const response = await axios.delete("http://localhost:3001/auth/logout", {
        headers,
      });
      if (response.status === 200) {
        setLoading(false);
        localStorage.removeItem("Token");
        sessionStorage.removeItem("session");
        dispatch(logoutUser());
        setSuccessmessage("Logout Successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      if (
        response.status === 401 &&
        response.data.message === "Token about to expire"
      ) {
        setLoading(false);
        localStorage.removeItem("Token");
        sessionStorage.removeItem("session");
        dispatch(logoutUser());
        setSuccessmessage("Logout Successfully!");
        setTimeout(() => {
          navigate("/");
        }, 60000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrormessage(error.response.data.message);
        console.error(error.response.data);
      } else {
        setErrormessage("An Error occured when Logout! ", error);
        console.error("An Error occured when Logout! ", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ListAltIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TO-DO .
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ListAltIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TO-DO .
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleRoundedIcon
                  fontSize="large"
                  sx={{ color: "white", mr: 1 }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/2.jpg"
                />

                <Typography
                  variant="h6"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Poppins, monospace",
                    fontWeight: 400,
                    color: "white",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Hi, {userData?.username || "User"}
                </Typography>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === "Logout" ? handleLogout : handleCloseUserMenu
                  }
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
        {errormessage && (
          <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
            <strong>{errormessage}</strong>
          </Alert>
        )}
        {successmessage && (
          <Alert severity="success" sx={{ mt: 1, width: "100%" }}>
            <strong>{successmessage}</strong>
          </Alert>
        )}
        {loading && (
          <p>
            <strong>Loading...</strong>
          </p>
        )}
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
