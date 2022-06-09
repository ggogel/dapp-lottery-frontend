import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract';
import { LOTTERY_ABI, LOTTERY_ADDRESS, TL_ABI, TL_ADDRESS } from "./config";
import { useMetaMaskContext } from "./MetaMaskContext";


export interface Lottery {
  id: number;
  totalMoney: number;
  ownedTickets: number[];
  winningTickets: [number,number][];
}


type LotteryContextType = {
  CurrentLotteryNo: number | undefined,
  LotteryBalance: number | undefined,
  Lotteries: Lottery[] | undefined,
  isPurchaseActive: boolean | undefined,
  isRevealActive: boolean |undefined
}

const LotteryContext = createContext<LotteryContextType>({
  CurrentLotteryNo: undefined,
  LotteryBalance: undefined,
  Lotteries: undefined,
  isPurchaseActive: undefined,
  isRevealActive: undefined
});

interface ProvideLotteryContextProps {
  children: React.ReactNode;
}

export function useLotteryContext(): LotteryContextType {
  return useContext(LotteryContext);
}

export default function ProvideLotteryContext({ children }: ProvideLotteryContextProps) {
  const appData = useProvideLotteryContext();
  return (
    <LotteryContext.Provider
      value={appData}
    >
      {children}
    </LotteryContext.Provider>
  );
};

const useProvideLotteryContext = () => {
  const {account, LotteryContract} = useMetaMaskContext();
  const [CurrentLotteryNo, setCurrentLotteryNo] = useState<number | undefined>(undefined);
  const [LotteryBalance, setLotteryBalance] = useState<number | undefined>(undefined);
  const [Lotteries, setLotteries] = useState<Lottery[] | undefined>(undefined);
  const [isPurchaseActive, setIsPurchaseActive] = useState<boolean | undefined>(undefined);
  const [isRevealActive, setIsRevealActive] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (LotteryContract) {
      getLotteryNo();
    }
  }, [LotteryContract]);

  useEffect(() => {
    if (LotteryContract) {
      getLotteries();
    }
  }, [CurrentLotteryNo, isPurchaseActive, LotteryBalance]);

  useEffect(() => {
    let interval:NodeJS.Timer
    if (LotteryContract) {
      interval = setInterval(() => {
          getLotteryNo();
          getLotteryBalance();
          getIsPurchaseActive();
        }, 1000);
    }
  }, [CurrentLotteryNo]);

  const getLotteryNo = async () => {
    const time = Math.floor((new Date()).getTime() / 1000);
    setCurrentLotteryNo(await LotteryContract!.methods.getLotteryNo(time).call());
  }

  const getLotteryBalance = async () => {
    if(account){
      setLotteryBalance(await LotteryContract!.methods.getBalance().call({from:account}));
    }
  }

  const getIsPurchaseActive = async () => {
    setIsPurchaseActive(await LotteryContract!.methods.isPurchaseActive().call());
    setIsRevealActive(await LotteryContract!.methods.isRevealActive().call());
  }

  const getLotteries = async () => {
    const lotteries : Lottery[] = [];

    for (let i = 0; i <= CurrentLotteryNo!; i++) {
      const id = i;
      const totalMoney = await LotteryContract!.methods.getTotalLotteryMoneyCollected(id).call();
      const ownedTickets : number[] = [];
      const winningTickets : [number,number][] = [];
      let status = 1;
      let ownedTicketIndex = 0;
      let winningTicketIndex = 1;

      while(status == 1){
        try {
          let result = await LotteryContract!.methods.getIthOwnedTicketNo(ownedTicketIndex,id).call({from:account});
          if(result.status == 1){
            ownedTickets.push(result[0]);
          }
        } catch (e){
          status = 0;
        }
        ownedTicketIndex++; 
      }

      status = 1;

      while(status == 1){
        try {
          let result = await LotteryContract!.methods.getIthWinningTicket(winningTicketIndex,id).call();
          if(result[1] > 0){
            winningTickets.push([result[0],result[1]]);
          }
        } catch (e){
          status = 0;
        }
        winningTicketIndex++; 
      }

      const lottery : Lottery = {
        id: id,
        totalMoney: totalMoney,
        ownedTickets: ownedTickets,
        winningTickets: winningTickets
      }
      lotteries.push(lottery);
    }
    setLotteries(lotteries);
  }
  
  return {
    CurrentLotteryNo,
    LotteryBalance,
    Lotteries,
    isPurchaseActive,
    isRevealActive
  };
};

export {ProvideLotteryContext}