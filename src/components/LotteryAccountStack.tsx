import { Button, InputAdornment, Paper, Stack, TextField, Typography, Box, AppBar, Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LOTTERY_ADDRESS, TL_ADDRESS } from '../config';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';

    
const LotteryAccountStack = () => {
    const {account, TLToken, LotteryContract} = useMetaMaskContext();
    const {LotteryBalance} = useLotteryContext();
    const [depositAmount, setDepositAmount] = React.useState('0');
    const [withdrawAmount, setWithdrawAmount] = React.useState('0');

    const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDepositAmount(event.target.value);
    };

    const handleWithdrawChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWithdrawAmount(event.target.value);
    };

    const deposit = async (amount : number) => {
        try {
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: TL_ADDRESS,
                    data: TLToken!.methods
                        .increaseAllowance(LOTTERY_ADDRESS, amount)
                        .encodeABI(),
                    },
                ],
                })
                .then((result: any) =>  console.log(result))
                .catch((error: any) => console.error(error));
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: LOTTERY_ADDRESS,
                    data: LotteryContract!.methods
                        .depositTL(amount)
                        .encodeABI(),
                    },
                ],
                })
                .then((result: any) =>  console.log(result))
                .catch((error: any) => console.error(error));
        } catch (err) {
            console.error(err);
        }
    };

    const withdraw = async (amount : number) => {
        try {
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: LOTTERY_ADDRESS,
                    data: LotteryContract!.methods
                        .withdrawTL(amount)
                        .encodeABI(),
                    },
                ],
                })
                .then((result: any) =>  console.log(result))
                .catch((error: any) => console.error(error));
        } catch (err) {
            console.error(err);
        }
    };
    
    if(TLToken && LotteryContract){
        return (
            <><Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Stack spacing={2} direction="row">
                            <Typography>Lottery Balance: {LotteryBalance} TL (Wei)</Typography>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </Box>
            <Paper elevation={3} sx={{margin: '20px', padding: '20px'}}>
                <Stack spacing={2} direction="row">
                    <TextField type="number" id="outlined-deposit" label="Deposit Amount" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">TL (Wei)</InputAdornment> }} value={depositAmount} onChange={handleDepositChange} />
                    <Button variant="contained" onClick={() => { deposit(+depositAmount); } }>Deposit</Button>
                    <TextField type="number" id="outlined-withdraw" label="Withdraw Amount" variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start">TL (Wei)</InputAdornment> }} value={withdrawAmount} onChange={handleWithdrawChange} />
                    <Button variant="contained" onClick={() => { withdraw(+withdrawAmount); } }>Withdraw</Button>
            
                </Stack>
            </Paper></>
        );
    }
    else{
        return (<></>)
    }
}
  
  export {LotteryAccountStack};