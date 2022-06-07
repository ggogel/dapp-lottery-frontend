import React, { useEffect, useState } from 'react';
import { useMetaMaskContext } from '../MetaMaskContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Lottery, useLotteryContext } from '../LotteryContext';
import { Paper, Stack } from '@mui/material';
import { BuyTicketButton } from './BuyTicketButton';
import { OwnedTicketsList } from './OwnedTicketsList';
import { WinningTicketsList } from './WinningTicketsList';

const LotteryAccordion = () => {
    const {Lotteries, CurrentLotteryNo, isPurchaseActive} = useLotteryContext();
    
    if(Lotteries){
        return (
            <Paper elevation={3} sx={{margin: '20px', padding: '20px'}}>
                {Lotteries.slice(0).reverse().map((lottery:Lottery) => (
                    <Accordion elevation={5} sx={{padding: '20px'}} key={lottery.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack spacing={4} direction="row">
                                <Typography>Lottery {lottery.id}</Typography>
                                {lottery.id != CurrentLotteryNo ? 
                                    <Typography>Ended</Typography> : 
                                    isPurchaseActive ? 
                                        <Typography>Purchase Phase Active</Typography>:
                                        <Typography>Reveal Phase Active</Typography> 
                                }
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={4} direction="column">
                            {lottery.id == CurrentLotteryNo  && isPurchaseActive ?               
                                <BuyTicketButton></BuyTicketButton>
                                : <></>
                            }
                            <Typography>Total Tokens Collected: {lottery.totalMoney} TL (Wei)</Typography>
                            <OwnedTicketsList lotteryNumber={lottery.id}></OwnedTicketsList>
                            <WinningTicketsList lotteryNumber={lottery.id}></WinningTicketsList>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>
        );
    }
    else{
        return (<></>)
    }
}
  
  export {LotteryAccordion};