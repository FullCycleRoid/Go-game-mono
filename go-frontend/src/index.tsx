import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Game from './components/Game/Game';
import reportWebVitals from './reportWebVitals';
import { ChainIdContext, generateChainId } from './hooks';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const chainId = generateChainId();
root.render(
  <React.StrictMode>
    <ChainIdContext.Provider value={chainId}>
      <Game />
    </ChainIdContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
