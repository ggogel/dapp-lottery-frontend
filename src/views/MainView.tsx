import { Container, Stack } from '@mui/material';
import React from 'react';
import { LotteryAccordion } from '../components/LotteryAccordion';
import { LotteryAccountStack } from '../components/LotteryAccountStack';
import { MetaMaskBar } from '../components/MetaMaskBar';
import LotteryContext from '../LotteryContext';
import { useMetaMaskContext } from '../MetaMaskContext';


const MainView = () => {
    const {LotteryContract} = useMetaMaskContext();
    if(LotteryContract){
        return (
            <>
                <Container>
                    <LotteryContext>
                        <LotteryAccountStack></LotteryAccountStack>
                        <LotteryAccordion></LotteryAccordion>
                    </LotteryContext>
                </Container>
            </>
        );

    } else {
        return (
            <MetaMaskBar></MetaMaskBar>
        );
    }
}

export default MainView;
