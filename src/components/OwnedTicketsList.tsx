import React, { useEffect, useState } from 'react';
import { List, ListItem, ListSubheader, Stack, Typography } from '@mui/material';
import { useLotteryContext } from '../LotteryContext';
import { RefundTicketButton } from './RefundTicketButton';
import { RevealRandomButton } from './RevealRandomButton';
import { CollectTicketPrizeButton } from './CollectTicketPrizeButton';

interface OwnedTicketsListProps {
    lotteryNumber: number;
  }

const OwnedTicketsList = (props : OwnedTicketsListProps) => {
    const {Lotteries, CurrentLotteryNo, isRevealActive} = useLotteryContext();

    return (
        <>
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Owned Tickets
                </ListSubheader>
            }>
            {Lotteries![props.lotteryNumber].ownedTickets.map((ticketNumber : number) => (
                <ListItem key={ticketNumber}>
                    <Stack spacing={2} direction="row">
                        <Typography># {ticketNumber}</Typography>
                        {props.lotteryNumber == CurrentLotteryNo ? 
                            isRevealActive ?  
                            <><RefundTicketButton ticketNumber={ticketNumber}></RefundTicketButton><RevealRandomButton ticketNumber={ticketNumber}></RevealRandomButton></>
                            : <></>
                        : props.lotteryNumber < CurrentLotteryNo! && (Lotteries![props.lotteryNumber].winningTickets.filter(t => t[0] == ticketNumber)).length > 0 ? 
                            <CollectTicketPrizeButton ticketNumber={ticketNumber}></CollectTicketPrizeButton>
                            : <></> 
                        }
                    </Stack>
                </ListItem>
            ))}
            </List>
        </>
    );
}
  
export {OwnedTicketsList};