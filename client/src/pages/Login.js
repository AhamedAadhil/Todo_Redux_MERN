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
import axios from "axios";
import { loginUser } from "../Redux/User";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowpassword] = useState(false);
  const [errormessage, setErrormessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrormessage("");
    setLoading(false);

    if (email.trim() === "") {
      setErrormessage("Email Cannot be Empty");
      return;
    }
    if (password.trim() === "") {
      setErrormessage("Password Cannot be Empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      console.log(response.data);
      const authToken = response.data.token;
      const session = response.data.session;
      if (authToken && session) {
        const decodeToken = jwtDecode(authToken);
        const { email, username, id } = decodeToken;
        dispatch(
          loginUser({
            token: authToken,
            session: session,
            userData: { email, username, id },
          })
        );
        Cookies.set("jwtToken", authToken, {
          secure: true,
          sameSite: "strict",
          expires: 1,
          httpOnly: true,
        });
        localStorage.setItem("Token", authToken);
        sessionStorage.setItem("session", session.sessionId);
        navigate("/home");
      } else {
        setErrormessage("User Not Logged In!");
      }
    } catch (error) {
      setErrormessage("Incorrect Credentials!");
      console.log(error.response.data);
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
          <Typography color="error">
            {errormessage && (
              <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                <strong>{errormessage}</strong>
              </Alert>
            )}
          </Typography>
        )}
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item mt={3}>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
