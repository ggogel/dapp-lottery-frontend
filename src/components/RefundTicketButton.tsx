import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LOTTERY_ADDRESS } from '../config';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';
import { soliditySha3 } from 'web3-utils';


interface RefundTicketButtonProps {
    ticketNumber: number;
  }
    
const RefundTicketButton = (props : RefundTicketButtonProps) => {
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
                        .collectTicketRefund(ticket_no)
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
            <Button variant="contained" onClick={() => { refund(props.ticketNumber); } }>Refund Ticket</Button>
        </>
    );
}
  
  export {RefundTicketButton};