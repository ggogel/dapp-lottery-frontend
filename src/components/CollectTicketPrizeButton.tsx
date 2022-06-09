import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LOTTERY_ADDRESS } from '../config';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';
import { soliditySha3 } from 'web3-utils';


interface CollectTicketPrizeButtonProps {
    ticketNumber: number;
  }
    
const CollectTicketPrizeButton = (props : CollectTicketPrizeButtonProps) => {
    const {account, LotteryContract} = useMetaMaskContext();

    const refund = async (ticket_no : number) => {
        try {
            await window.ethereum
                .request({
                method: "eth_sendTransaction",
                params: [
                    {
                    from: account,
                    to: LOTTERY_ADDRESS,
                    data: LotteryContract!.methods
                        .collectTicketPrize(ticket_no)
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
            <Button variant="contained" onClick={() => { refund(props.ticketNumber); } }>Collect Prize</Button>
        </>
    );
}
  
  export {CollectTicketPrizeButton};