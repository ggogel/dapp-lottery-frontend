import React from 'react';
import './App.css';
import ProvideMetaMaskContext from './MetaMaskContext';
import MainView from './views/MainView';

function App() {
  return (
    <ProvideMetaMaskContext>
      <MainView></MainView>
    </ProvideMetaMaskContext>
  );
}

export default App;
