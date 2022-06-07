import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract';
import { LOTTERY_ABI, LOTTERY_ADDRESS, NETWORK_ID, RPC_URL, TL_ABI, TL_ADDRESS } from "./config";



type MetaMaskContextType = {
  account: string | undefined,
  balance: string | undefined,
  errorMessage: string | undefined,
  web3: Web3 | undefined,
  TLToken: Contract | undefined,
  LotteryContract: Contract | undefined
}

const MetaMaskContext = createContext<MetaMaskContextType>({
  account: undefined,
  balance: undefined,
  errorMessage: undefined,
  web3: undefined,
  TLToken: undefined,
  LotteryContract: undefined
});

interface ProvideMetaMaskContextProps {
  children: React.ReactNode;
}

export function useMetaMaskContext(): MetaMaskContextType {
  return useContext(MetaMaskContext);
}

export default function ProvideMetaMaskContext({ children }: ProvideMetaMaskContextProps) {
  const appData = useProvideMetaMaskContext();
  return (
    <MetaMaskContext.Provider
      value={appData}
    >
      {children}
    </MetaMaskContext.Provider>
  );
};




const useProvideMetaMaskContext = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [TLToken, setTLToken] = useState<Contract | undefined>(undefined);
  const [LotteryContract, setLottery] = useState<Contract | undefined>(undefined);
  const [networkID, setNetworkID] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", accountsChanged);
      window.ethereum.on("connect", accountsChanged);
      if(window.ethereum.isConnected()){
        accountsChanged();
      }
    }
  }, [window.ethereum]);

  useEffect(() => {
    if(!account){
      setAccount(window.ethereum.selectedAddress);
    } 
    else if(window.ethereum && window.ethereum.isConnected()) { 
      getNetworkID();
      getBalance();
      connectWeb3();
    }
  }, [account]);

  useEffect(() => {
    if (web3 && networkID == NETWORK_ID) {
      loadContracts();
    }
  }, [web3, networkID]);

  const connectWeb3 = async () => {
    setWeb3(new Web3(RPC_URL));
  }

  const loadContracts = async () => {
    if(account){
      web3!.defaultAccount = account!;
      setTLToken(new web3!.eth.Contract(TL_ABI as AbiItem[], TL_ADDRESS));
      setLottery(new web3!.eth.Contract(LOTTERY_ABI as AbiItem[], LOTTERY_ADDRESS));
    }
  }

  const accountsChanged = async () => {
    setBalance(undefined);
    setLottery(undefined);
    setTLToken(undefined);
    setWeb3(undefined);
    setNetworkID(undefined);
    setAccount(undefined);
  };

  const getBalance = async () => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account!.toString(), "latest"],
      });
      setBalance(ethers.utils.formatEther(balance));
      setErrorMessage(undefined);
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const getNetworkID = async () => {
    try {
      const network = await window.ethereum.request({
        method: "net_version"
      });
      if(network != NETWORK_ID){
        setErrorMessage("Please connect to network with id " + NETWORK_ID);
      } else {
        setNetworkID(network);
        setErrorMessage(undefined);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  }

  return {
    account,
    balance,
    errorMessage,
    web3,
    TLToken,
    LotteryContract
  };
};

export {ProvideMetaMaskContext}