import React from 'react';
import { AppBar, Box, Button, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { useMetaMaskContext } from '../MetaMaskContext';


const connectHandler = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } catch (err) {
      console.error(err);
    }
  }
};


const MetaMaskBar = () => {
  const {account , balance , errorMessage} = useMetaMaskContext();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          <Toolbar>
            <Button color="inherit" onClick={connectHandler}>Connect MetaMask</Button>
            {errorMessage ? (
              <Typography variant="body1" color="red">
                Error: {errorMessage}
              </Typography>
          ) : null}
          </Toolbar>
      </AppBar>
    </Box>
  );
}

export {MetaMaskBar};
