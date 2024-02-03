import React, { Dispatch, SetStateAction, useRef } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface Props {
  setToken: Dispatch<SetStateAction<string>>
}

const Login: React.FC<Props> = (props: Props): React.ReactElement => {

  const navigate: NavigateFunction = useNavigate();

  const usernameInput = useRef<HTMLInputElement>();
  const passwordInput = useRef<HTMLInputElement>();

  const login = async (e: React.FormEvent): Promise<void> => {

    e.preventDefault();

    try {

      const response = await fetch("http://localhost:3110/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameInput.current?.value,
          password: passwordInput.current?.value
        })
      });

      const data = await response.json();

      if (response.status === 200) {

        props.setToken(data.token);
        localStorage.setItem("jwt", data.token);
        navigate("/Entries");

      }
    } catch (error: any) { }
  };

  return (
    <Box
      component="form"
      onSubmit={login}
      style={{
        width: 300,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">Log in</Typography>
        <TextField
          label="Username"
          inputRef={usernameInput}
        />
        <TextField
          label="Password"
          inputRef={passwordInput}
          type="password"
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
        >
          Log in
        </Button>

        <Typography variant="h6">"owner, password"</Typography>
      </Stack>
    </Box>
  );
};

export default Login;