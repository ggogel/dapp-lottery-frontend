import React, { useEffect, useState } from 'react';
import { List, ListItem, Stack, Typography, ListSubheader } from '@mui/material';
import { useLotteryContext } from '../LotteryContext';

interface WinningTicketsListProps {
    lotteryNumber: number;
  }

const WinningTicketsList = (props : WinningTicketsListProps) => {
    const {Lotteries, CurrentLotteryNo} = useLotteryContext();

    return (
        <>  
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Winning Tickets
                </ListSubheader>
            }>
            {props.lotteryNumber == CurrentLotteryNo ?
            <ListItem key="active">
                <Stack spacing={2} direction="row">
                    <Typography>Lottery is still active</Typography>
                </Stack>
            </ListItem>
            : 
            Lotteries![props.lotteryNumber].winningTickets.map((ticket : [number, number]) => (
                <ListItem key={ticket[0].toString() + "-" + ticket[1].toString()}>
                    <Stack spacing={2} direction="row">
                        <Typography>Ticket Number: {ticket[0]}</Typography>
                        <Typography>Prize Amount: {ticket[1]}</Typography>
                    </Stack>
                </ListItem>
            ))}
            </List>
        </>
    );
}
  
export {WinningTicketsList};