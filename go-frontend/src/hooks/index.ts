import React, { createContext, useContext } from 'react';

export const ChainIdContext = createContext<string | undefined>(undefined);

export const useChainId = () => useContext(ChainIdContext);

export { useGame } from './useGame';
export * from '../services/logger'; 