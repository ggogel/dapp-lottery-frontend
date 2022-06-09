import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LOTTERY_ADDRESS } from '../config';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';
import { soliditySha3 } from 'web3-utils';

interface RevealRandomButtonProps {
    ticketNumber: number;
  }
  
    
const RevealRandomButton = (props:RevealRandomButtonProps) => {
    const {account, LotteryContract} = useMetaMaskContext();
    const [randomNumber, setRandomNumber] = React.useState("");

    const handleRandomNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRandomNumber(event.target.value);
    };


    const reveal = async (ticket_no : number, rnd : number) => {
        try {
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: LOTTERY_ADDRESS,
                    data: LotteryContract!.methods
                        .revealRndNumber(ticket_no,rnd)
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
        <>
            <TextField type="number" id="outlined-random-reveal" label="Random Number" variant="outlined" value={randomNumber} onChange={handleRandomNumberChange}/>
            <Button variant="contained" onClick={() => { reveal(props.ticketNumber, +randomNumber); } }>Reveal Random Number</Button>
        </>
    );
}
  
  export {RevealRandomButton};