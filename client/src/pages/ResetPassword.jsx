import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {"Copyright © "}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function ResetPassword() {
  const [params, _] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.put("http://localhost:8010/update", {
        password: password,
        email: email,
      });

      console.log(result);
      if (result.data.status) {
        alert(result.data.message);
        navigate("/auth/login");
      } else {
        alert(result.data.message);
        navigate("/forgetpassword");
      }
    } catch (err) {
      console.log(err);
      navigate("/forgetpassword");
    }
  };

  const verify = async () => {
    try {
      setLoader(true);
      const result = await axios.get(
        "http://localhost:8000/verify?token=" + params.get("token")
      );
      if (result.data.status) {
        setEmail(result.data.email);
      } else {
        alert("Invalid link");
        navigate("/forgetpassword");
      }
    } catch (err) {
      navigate("/forgetpassword");
    } finally {
      setLoader(false);
    }
  };
  React.useEffect(() => {
    verify();
  }, []);

  if (!params.get("token")) {
    return <>Invalid Link</>;
  }
  return loader ? (
    <>Loader</>
  ) : (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Reset Password
          </Typography>

          <Box component='form' noValidate sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name='confirm-password'
              label='Confirm Password'
              type='password'
              id='confirm-password'
              autoComplete='confirm-password'
            />
            {password === confirmPassword ? (
              <Button
                type='submit'
                fullWidth
                onClick={handleSubmit}
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Reset
              </Button>
            ) : (
              <Button
                type='submit'
                fullWidth
                disabled
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Reset
              </Button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
