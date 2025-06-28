import React, { createContext, useContext, useState, useEffect } from 'react';
import { blockchainService, type BlockchainVerification, type VerificationHistory } from '../lib/blockchain';

interface BlockchainContextType {
  isConnected: boolean;
  walletAddress: string | null;
  networkInfo: any;
  connectWallet: () => Promise<boolean>;
  verifyNews: (newsContent: string, credibilityScore: number, metadata: any) => Promise<BlockchainVerification | null>;
  updateScore: (tokenId: string, newScore: number) => Promise<boolean>;
  getVerification: (tokenId: string) => Promise<BlockchainVerification | null>;
  getHistory: (tokenId: string) => Promise<VerificationHistory[]>;
  isNewsVerified: (newsContent: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeBlockchain();
    checkWalletConnection();
  }, []);

  const initializeBlockchain = async () => {
    try {
      await blockchainService.initialize();
      const info = await blockchainService.getNetworkInfo();
      setNetworkInfo(info);
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await blockchainService.connectWallet();
      if (success) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
      return success;
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyNews = async (
    newsContent: string,
    credibilityScore: number,
    metadata: any
  ): Promise<BlockchainVerification | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await blockchainService.verifyNewsOnBlockchain(newsContent, credibilityScore, metadata);
      return result;
    } catch (error: any) {
      setError(error.message || 'Failed to verify news on blockchain');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (tokenId: string, newScore: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await blockchainService.updateCredibilityScore(tokenId, newScore);
      return success;
    } catch (error: any) {
      setError(error.message || 'Failed to update score');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getVerification = async (tokenId: string): Promise<BlockchainVerification | null> => {
    try {
      return await blockchainService.getNewsVerification(tokenId);
    } catch (error: any) {
      setError(error.message || 'Failed to get verification');
      return null;
    }
  };

  const getHistory = async (tokenId: string): Promise<VerificationHistory[]> => {
    try {
      return await blockchainService.getVerificationHistory(tokenId);
    } catch (error: any) {
      setError(error.message || 'Failed to get history');
      return [];
    }
  };

  const isNewsVerified = async (newsContent: string): Promise<boolean> => {
    try {
      return await blockchainService.isNewsVerified(newsContent);
    } catch (error: any) {
      setError(error.message || 'Failed to check verification');
      return false;
    }
  };

  const value = {
    isConnected,
    walletAddress,
    networkInfo,
    connectWallet,
    verifyNews,
    updateScore,
    getVerification,
    getHistory,
    isNewsVerified,
    loading,
    error
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};