import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [showPassword, setShowpassword] = useState(false);
  const [errormessage, setErrormessage] = useState("");
  const [successmessage, setSuccessmessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrormessage("");
    setLoading(false);

    if (name.trim() === "") {
      setErrormessage("Name Cannot be Empty!");
      return;
    }
    if (name.length < 4) {
      setErrormessage("Name is Too Short!");
      return;
    }
    if (email.trim() === "") {
      setErrormessage("Email Cannot be Empty!");
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setErrormessage("Invalid Email Address!");
      return;
    }
    if (password.length < 6) {
      setErrormessage("Password length must be higher than 6 char!");
      return;
    }
    if (confirmPassword !== password) {
      setErrormessage("Passwords Mis-match!");
      return;
    }
    if (password.trim() === "") {
      setErrormessage("Password Cannot be Empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/auth/register", {
        email,
        password,
        name,
      });
      console.log(response.data);
      if (response.data.user) {
        setSuccessmessage("New Account Created!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrormessage(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        setErrormessage("An error occurred while registering.");
        console.log("An error occurred while registering:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPasswordChange = () => {
    setShowpassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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

        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="cpassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            id="cpassword"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="show"
                color="primary"
                checked={showPassword}
                onChange={handleShowPasswordChange}
              />
            }
            label="Show Password"
          />
          {loading && (
            <p>
              <strong>Loading...</strong>
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ color: "white", backgroundColor: "green" }}
          >
            Register
          </Button>

          <Grid container>
            <Grid item mt={3}>
              <Link href="/" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
