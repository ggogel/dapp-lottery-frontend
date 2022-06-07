import { Button, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LOTTERY_ADDRESS } from '../config';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';
import { soliditySha3 } from 'web3-utils';

    
const BuyTicketButton = () => {
    const {account, LotteryContract} = useMetaMaskContext();
    const [randomNumber, setRandomNumber] = React.useState(Math.floor(Math.random() * 10000).toString());

    const handleRandomNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRandomNumber(event.target.value);
    };


    const buy = async (rnd : number) => {
        try {
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: LOTTERY_ADDRESS,
                    data: LotteryContract!.methods
                        .buyTicket(soliditySha3(rnd,account!))
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
    

    return (
        <div>
            <Stack spacing={2} direction="row">
                <TextField id="outlined-random" label="Random Number" variant="outlined" value={randomNumber} onChange={handleRandomNumberChange}/>
                <Button variant="contained" onClick={() => { buy(+randomNumber); } }>Buy Ticket</Button>
            </Stack>
        </div>
    );
}
  
  export {BuyTicketButton};